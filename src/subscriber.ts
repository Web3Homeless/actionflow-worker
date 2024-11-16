import { ethers } from "ethers";
import { ITrigger } from './types';
import { helper } from './helper';
import { proover } from './proover';
import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import { json } from "stream/consumers";


export const subscribeToUniSwap = async (data: ITrigger) => {

    const tokenIn = data.swapData?.tokenIn;
    const tokenOut = data.swapData?.tokenOut;

    if(!tokenIn || !tokenOut){
        throw new Error(`Invalid tokenIn or tokenOut`);
    }

    // Uniswap Pair Address (for the token pair involved)
    const pairAddress = helper.getPair(data.network, tokenIn, tokenOut); // Replace with the pair address

    // ABI for Uniswap V2 Pair (Swap event)
    const pairABI = [
        "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)"
    ];

    // Setup Provider
     // Find the network configuration
     const networkConfig = helper.networks.find((row) => row.network === data.network);
     if (!networkConfig || !networkConfig.factoryAddress) {
         throw new Error(`Invalid network: ${data.network}`);
     }
 
     const rpcUrl = networkConfig.rpc_url + process.env.rpc_key;
     const provider = new JsonRpcProvider(rpcUrl);


    // Initialize Contract
    const resolvedPairAddress = await pairAddress; // Resolve the Promise
    const pairContract = new ethers.Contract(resolvedPairAddress, pairABI, provider);

    // Your contract address
    const contractAddress = data.contractAddress;

    // Listen for Swap events
    pairContract.on("Swap", (sender, amount0In, amount1In, amount0Out, amount1Out, to, event) => {
        if (sender.toLowerCase() === contractAddress.toLowerCase() || to.toLowerCase() === contractAddress.toLowerCase()) {
            console.log(`Swap detected!`);
            console.log(`Sender: ${sender}`);
            console.log(`Amount In: Token0: ${amount0In}, Token1: ${amount1In}`);
            console.log(`Amount Out: Token0: ${amount0Out}, Token1: ${amount1Out}`);
            console.log(`Recipient: ${to}`);

             //call vilayer
            const body = {}
            proover.transferProover("uniswap",JSON.stringify(body));
        }   
    });
}

export const subscribeTo1Inch = async (data: ITrigger) => {

    // Setup provider (replace with your RPC URL)
     const networkConfig = helper.networks.find((row) => row.network === data.network);
     if (!networkConfig || !networkConfig.factoryAddress) {
         throw new Error(`Invalid network: ${data.network}`);
     }
 
     const rpcUrl = networkConfig.rpc_url + process.env.rpc_key;
     const provider = new JsonRpcProvider(rpcUrl);

    // 1inch Aggregation Router address
    const routerAddress = "0x11111112542d85b3ef69ae05771c2dccff4faa26";
    
    // ABI with the Swapped event
    const routerABI = [
        "event Swapped(address indexed sender, address srcToken, address dstToken, address indexed dstReceiver, uint256 spentAmount, uint256 returnAmount)"
    ];
    
    // Initialize contract
    const routerContract = new ethers.Contract(routerAddress, routerABI, provider);
    
    // Your contract address
    const contractAddress = data.contractAddress;
    
    // Listen for swaps involving your contract
    routerContract.on("Swapped", (sender, srcToken, dstToken, dstReceiver, spentAmount, returnAmount, event) => {
        if (sender.toLowerCase() === contractAddress.toLowerCase() || dstReceiver.toLowerCase() === contractAddress.toLowerCase()) {
            console.log(`Swap detected!`);
            console.log(`Sender: ${sender}`);
            console.log(`Source Token: ${srcToken}`);
            console.log(`Destination Token: ${dstToken}`);
            console.log(`Spent Amount: ${formatUnits(spentAmount)}`);
            console.log(`Received Amount: ${formatUnits(returnAmount)}`);
        }

         //call vilayer
         const body = {}
         proover.transferProover("1inch_swap",JSON.stringify(body));
    });

}

export const subscribeToTransaction = async (data: ITrigger) => {

    // Setup provider and contract
    // Setup provider (replace with your RPC URL)
    const networkConfig = helper.networks.find((row) => row.network === data.network);
    if (!networkConfig || !networkConfig.factoryAddress) {
        throw new Error(`Invalid network: ${data.network}`);
    }

    const tokenAddress = data.transferData?.token;
   
    if (!tokenAddress) {
        throw new Error(`Invalid tokenAddress: ${tokenAddress}`);
    }

    
    const rpcUrl = networkConfig.rpc_url + process.env.rpc_key;
    const provider = new JsonRpcProvider(rpcUrl);
    const tokenContract = new ethers.Contract(tokenAddress, ["event Transfer(address indexed from, address indexed to, uint256 value)"], provider);

    // Listen for Transfer events to your contract
    const contractAddress = data.contractAddress;

    tokenContract.on("Transfer", (from, to, value, event) => {
    if (to.toLowerCase() === contractAddress.toLowerCase()) {
        console.log(`Tokens received! From: ${from}, Amount: ${formatUnits(value)}`);
        
         //call vilayer
         const body = {}
         proover.transactionProover("transaction",JSON.stringify(body));
    }
    });
}

export const subscribeToTwitter = async (data: ITrigger) => {

    if ( 1 == 1 ) {

         //call vilayer
         const body = {}
         proover.transactionProover("twitter",JSON.stringify(body));
    }
}

export const subscriber = {
    subscribeToUniSwap,
    subscribeTo1Inch,
    subscribeToTransaction,
    subscribeToTwitter,
}
