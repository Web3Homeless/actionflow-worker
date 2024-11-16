import { MongoClient, ReturnDocument } from 'mongodb';
import * as dotenv from 'dotenv';
import { ITrigger } from './types';

dotenv.config();

async function run(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI;
  const NODE_ENV = process.env.NODE_ENV;

  if (!MONGODB_URI) {
    console.log('URI is not set, check your .env');
    return;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const dbName = 'mongo';
  const collectionName = 'triggers';

  const database = client.db(dbName);
  const collection = database.collection<ITrigger>(collectionName);

  // For modular testing only
  if (NODE_ENV && NODE_ENV === 'development') {
    const triggers: ITrigger[] = [
        {
            type: "transfer",
            network: "ethereum",
            contractAddress: "0x395A8bFE7dAb89ec5A1CE75Fd98F3DcfD3e4221F",
            status: "new",
          
            transferData: {
              token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            },
            swapData: undefined,
            twitterCallData: undefined,
        },
        {
            type: "twitter",
            network: "arbitrum",
            contractAddress: "0x7cf9957383d484A2a780aCcaEC3E0707E948b93e",
            status: "new",
          
            transferData: undefined,
            swapData: undefined,
            twitterCallData: {
              twitterHandle: "elonmusk",
              searshWords: "dodge",
            }
        },
        {
            type: "swap",
            network: "polygon",
            contractAddress: "0x792de4298b705eC02D5ae69B22849330618a98C6",
            status: "new",
          
            transferData: undefined,
            swapData: {
              target: "0x0895c52dADc167AeB8AD8ceB9A137480B9D6291d",
              tokenIn: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
              tokenOut: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              swapper: "1inch",
            },
            twitterCallData: undefined,
          },
    ];

    try {
      const insertManyResult = await collection.insertMany(triggers);
      console.log(`${insertManyResult.insertedCount} documents successfully inserted.`);
    } catch (err) {
      console.error(`Something went wrong trying to insert the new documents: ${err}`);
    }
  }

  try {
    // Find all documents in the "triggers" collection and sort them
    const cursor = await collection.find({}).sort({ name: 1 });

    while (await cursor.hasNext()) {
      const trigger = await cursor.next();

      if (!trigger) {
        console.log('Empty document returned by cursor.');
        continue;
      }

      // Debugging: Log the entire document to ensure it has the expected structure
      console.log('Trigger document:', JSON.stringify(trigger, null, 2));

      // Ensure the `name` field exists
      if (!trigger.type) {
        console.log('The `name` field is missing in this document. Skipping...');
        continue;
      }

      console.log(`id: ${trigger._id} and name ${trigger.type} and status ${trigger.status}`);


      

      const findOneQuery = { _id: trigger._id };
      const updateDoc = { $set: { status: 'success' } };
      const updateOptions = { returnDocument: ReturnDocument.AFTER }; // Use enum for "after"

      try {
        // Update the document
        const updateResult = await collection.findOneAndUpdate(
          findOneQuery,
          updateDoc,
          updateOptions
        );

        console.log(updateResult);

        if (updateResult) {
          console.log(`Here is the updated document:\n${JSON.stringify(updateResult)}`);
        } else {
          console.log(`No document found matching: ${JSON.stringify(findOneQuery)}`);
        }
      } catch (err) {
        console.error(`Something went wrong trying to update one document: ${err}`);
      }
    }
  } catch (err) {
    console.error(`Something went wrong trying to find the documents: ${err}`);
  }

  // Delete testing data
  if (NODE_ENV && NODE_ENV === 'development') {
    try {
      // Delete all documents from the "triggers" collection
      const result = await collection.deleteMany({});
      console.log(`Deleted ${result.deletedCount} documents from the "triggers" collection.`);
    } catch (err) {
      console.error(`Something went wrong trying to delete the documents: ${err}`);
    }
  }

  await client.close();
}

run().catch(console.dir);