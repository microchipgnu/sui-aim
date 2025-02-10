
const BLUEFIN_API_URL = 'https://dapi.api.sui-prod.bluefin.io';

export const getBluefinExchangeInfo = async () => {
  const response = await fetch(`${BLUEFIN_API_URL}/exchangeInfo`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });
  const data = await response.json();
  return JSON.stringify(data);
}

export const getMarketData = async () => {
  const response = await fetch(`${BLUEFIN_API_URL}/marketData`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });
  const data = await response.json();
  return JSON.stringify(data);
}

export const getCandlestickData = async (interval = '1m') => {
  const response = await fetch(`${BLUEFIN_API_URL}/candlestickData?interval=${interval}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });
  const data = await response.json();
  return JSON.stringify(data);
}

// only works on mainnet
// TODO: fix this after the hackathon and support other netwworks
// export const executeSpotTrade = async (params: {
//   poolId: string,
//   amount: number,
//   aToB: boolean,
//   byAmountIn: boolean,
//   slippage: number
// }): Promise<string> => {
//   // Validate environment variables
//   if (!process.env.SUI_PRIVATE_KEY) {
//     throw new Error("SUI_PRIVATE_KEY environment variable is required");
//   }

//   // Initialize Sui client and signer
//   const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
//   const signer = Ed25519Keypair.fromSecretKey(
//     Buffer.from(process.env.SUI_PRIVATE_KEY, 'hex')
//   );

//   // Initialize chain interaction objects
//   // @ts-ignore TODO: fix this after the hackathon
//   const onChainCalls = new OnChainCalls(client, {}, {signer});
//   const queryChain = new QueryChain(client);

//   // Get pool state and prepare swap parameters
//   const poolState = await queryChain.getPool(params.poolId);
//   const getDecimalsByDirection = (isInputToken: boolean) => 
//     params.aToB ? 
//       (isInputToken ? poolState.coin_a.decimals : poolState.coin_b.decimals) :
//       (isInputToken ? poolState.coin_b.decimals : poolState.coin_a.decimals);

//   const swapParams: ISwapParams = {
//     pool: poolState,
//     amountIn: params.byAmountIn ? toBigNumber(params.amount, getDecimalsByDirection(true)) : 0,
//     amountOut: params.byAmountIn ? 0 : toBigNumber(params.amount, getDecimalsByDirection(false)),
//     aToB: params.aToB,
//     byAmountIn: params.byAmountIn,
//     slippage: params.slippage
//   };

//   try {
//     // Execute swap
//     const result = await onChainCalls.swapAssets(swapParams);
//     return JSON.stringify({
//       success: true,
//       result,
//       params
//     });
//   } catch (error) {
//     return JSON.stringify({
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error occurred", 
//       params
//     });
//   }
// }
