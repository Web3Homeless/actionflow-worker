import { AddressZero } from "@ethersproject/constants"; // For ethers v5. Use constants directly for ethers v6.
import { JsonRpcProvider, Contract } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();

const networks = [
    {
        network: "ethereum",
        factoryAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        rpc_url: process.env.ETH_RPC_URL ?? "",
    },
    {
        network: "polygon",
        factoryAddress: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        rpc_url: process.env.POL_RPC_URL ?? "",
    },
    {
        network: "arbitrum",
        factoryAddress: "",
        rpc_url: process.env.ARB_RPC_URL ?? "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    },
];

const getPair = async (network: string, token1: string, token2: string) => {
    const rpc_key = process.env.RPC_KEY;

    // Uniswap V2 Factory ABI
    const factoryABI = [
        "function getPair(address tokenA, address tokenB) external view returns (address pair)"
    ];

    // Find the network configuration
    const networkConfig = networks.find((row) => row.network === network);
    if (!networkConfig || !networkConfig.factoryAddress) {
        throw new Error(`Invalid network: ${network}`);
    }

    const rpcUrl = networkConfig.rpc_url + rpc_key;
    const provider = new JsonRpcProvider(rpcUrl);

    const factoryContract = new Contract(networkConfig.factoryAddress, factoryABI, provider);

    // Function to get pool address
    async function getPoolAddress(token1: string, token2: string):Promise<string> {
        // Ensure token addresses are sorted (required by Uniswap)
        const [tokenA, tokenB] = [token1, token2].sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));

        // Call the factory contract's getPair function
        const pairAddress = await factoryContract.getPair(tokenA, tokenB);
        if (pairAddress === AddressZero) {
            console.log("No pool exists for this token pair.");
            return "";
        }
        return pairAddress;
    }

    const poolAddress = await getPoolAddress(token1, token2);
    console.log("Pool Address:", poolAddress);
    return poolAddress;
};


export const helper = {
    getPair,
    networks,
}