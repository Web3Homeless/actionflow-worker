export interface ITranfserData {
    token: string;
}

export interface ISwapData {
    target: string;
    tokenIn: string;
    tokenOut: string;
    swapper: string;
} 

export interface ITwitterCallData {
    twitterHandle: string;
    searshWords: string;
}

export interface ITrigger {
    type: string;
    network: string;
    contractAddress: string;
    status: string;

    transferData: ITranfserData | undefined;
    swapData: ISwapData | undefined;
    twitterCallData: ITwitterCallData | undefined;
}