import { MongoClient, ReturnDocument } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

interface Trigger {
  name: string;
  address: string;
  method: string;
  url: string;
  postData: string;
  condition: string;
  status: string;
  keywords: string;
}

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
  const collection = database.collection<Trigger>(collectionName);

  // For modular testing only
  if (NODE_ENV && NODE_ENV === 'development') {
    const triggers: Trigger[] = [
      {
        name: 'twitter',
        address: 'address',
        method: 'method',
        url: 'url',
        postData: 'data',
        condition: 'condition',
        status: 'new',
        keywords: 'keywords',
      },
      {
        name: 'swap',
        address: 'address',
        method: 'method',
        url: 'url',
        postData: 'data',
        condition: 'condition',
        status: 'new',
        keywords: 'keywords',
      },
      {
        name: 'transfer',
        address: 'address',
        method: 'method',
        url: 'url',
        postData: 'data',
        condition: 'condition',
        status: 'new',
        keywords: 'keywords',
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
      if (!trigger.name) {
        console.log('The `name` field is missing in this document. Skipping...');
        continue;
      }

      console.log(`id: ${trigger._id} and name ${trigger.name} and status ${trigger.status}`);


      

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
