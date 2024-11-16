import { Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";  // Correct import for AddressZero


// Update the function to use the new imports
export const getPool = async (rpc_url: string, factory: string, token1: string, token2: string) => {

    // Uniswap V2 Factory ABI
    const factoryABI = [
        "function getPair(address tokenA, address tokenB) external view returns (address pair)"
    ];

    // Factory Address (adjust per chain)
    const factoryAddress = factory;

    // Initialize the provider and factory contract
    const provider = new JsonRpcProvider(rpc_url);  // use rpc_url passed in
    const factoryContract = new Contract(factoryAddress, factoryABI, provider);

    // Function to get pool address
    async function getPoolAddress(token1: string, token2: string) {
        // Ensure token addresses are sorted (required by Uniswap)
        const [tokenA, tokenB] = [token1, token2].sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);

        // Call the factory contract's getPair function
        const pairAddress = await factoryContract.getPair(tokenA, tokenB);
        if (pairAddress === AddressZero) {
            console.log("No pool exists for this token pair.");
            return null;
        }
        return pairAddress;
    }

    const poolAddress = await getPoolAddress(token1, token2);
    console.log("Pool Address:", poolAddress);

}
