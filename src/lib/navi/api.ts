import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import axios from 'axios';
import { NAVISDKClient } from "navi-sdk";
import { z } from 'zod';
const {
    Sui,
    NAVX,
    vSui,
    USDT,
    WETH,
    CETUS,
    haSui,
    WBTC,
    AUSD,
    wUSDC,
} = await import("navi-sdk");
const NAVI_BASE_URL = 'https://open-api.naviprotocol.io/api';

export interface NaviPool {
    borrowCapCeiling: string;
    coinType: string;
    currentBorrowIndex: string;
    currentBorrowRate: string;
    currentSupplyIndex: string;
    currentSupplyRate: string;
    id: number;
    isIsolated: boolean;
    lastUpdateTimestamp: string;
    ltv: string;
    oracleId: number;
    supplyCapCeiling: string;
    treasuryBalance: string;
    treasuryFactor: string;
    totalSupplyAmount: string;
    minimumAmount: string;
    leftSupply: string;
    validBorrowAmount: string;
    borrowedAmount: string;
    leftBorrowAmount: string;
    availableBorrow: string;
    oracle: {
        decimal: number;
        value: string;
        price: string;
        oracleId: number;
        valid: boolean;
    };
    supplyIncentiveApyInfo: {
        vaultApr: string;
        boostedApr: string;
        stakingYieldApy: string;
        rewardCoin: string[];
        apy: string;
    };
    borrowIncentiveApyInfo: {
        vaultApr: string;
        boostedApr: string;
        stakingYieldApy: string;
        rewardCoin: string[];
        apy: string;
    };
}

export interface NaviPackage {
    packageId: string;
    outdated: {
        packageId: string;
        version: number;
    }[];
}

export interface NaviFlashloanConfig {
    max: string;
    min: string;
    assetId: number;
    poolId: string;
    supplierFee: number;
    flashloanFee: number;
}

export interface NaviOracleConfig {
    oracleId: number;
    maxTimestampDiff: number;
    priceDiffThreshold1: number;
    priceDiffThreshold2: number;
    maxDurationWithinThresholds: number;
    maximumAllowedSpanPercentage: number;
    maximumEffectivePrice: number;
    minimumEffectivePrice: number;
    historicalPriceTTL: number;
    coinType: string;
    feedId: string;
    supraPairId: number;
    pythPriceFeedId: string;
    pythPriceInfoObject: string;
    priceDecimal: number;
    expiration: number;
}

export interface NaviReward {
    amount: string;
    pool: string;
    sender: string;
    timestamp: string;
    coin_type: string;
    token_price: number;
}

export const naviApi = {
    // Get NAVI pools information
    getNaviPools: async (): Promise<NaviPool[]> => {
        const response = await axios.get(`${NAVI_BASE_URL}/navi/pools`);
        return response.data;
    },

    // Get NAVI package information
    getNaviPackage: async (): Promise<NaviPackage> => {
        const response = await axios.get(`${NAVI_BASE_URL}/package`);
        return response.data;
    },

    // Get NAVI contract configurations
    getNaviContractConfigs: async () => {
        const response = await axios.get(`${NAVI_BASE_URL}/navi/contract/configs`);
        return response.data;
    },

    // Get NAVI fee and revenue data
    getNaviFeeAndRevenue: async (fromTimestamp: number) => {
        const response = await axios.get(`${NAVI_BASE_URL}/navi/fee`, {
            params: { fromTimestamp }
        });
        return response.data;
    },

    // Get NAVI flashloan configurations
    getNaviFlashloanConfig: async (): Promise<Record<string, NaviFlashloanConfig>> => {
        const response = await axios.get(`${NAVI_BASE_URL}/navi/flashloan`);
        return response.data;
    },

    // Get NAVI oracle configurations
    getNaviOracleConfig: async (): Promise<Record<string, NaviOracleConfig>> => {
        const response = await axios.get(`${NAVI_BASE_URL}/navi/oracle`);
        return response.data;
    },

    // Get user's claimed rewards history
    getNaviClaimedRewards: async (userAddress: string): Promise<NaviReward[]> => {
        const response = await axios.get(`${NAVI_BASE_URL}/navi/user/rewards`, {
            params: { userAddress }
        });
        return response.data;
    }
};

export const naviAITools = {
    getNaviPools: {
        description: "Get NAVI pools information",
        parameters: z.object({}),
        execute: async (input: any) => {
            const result = await naviApi.getNaviPools();
            return JSON.stringify(result);
        }
    },
    getNaviPackage: {
        description: "Get NAVI package information", 
        parameters: z.object({}),
        execute: async (input: any) => {
            const result = await naviApi.getNaviPackage();
            return JSON.stringify(result);
        }
    },
    getNaviContractConfigs: {
        description: "Get NAVI contract configurations",
        parameters: z.object({}),
        execute: async (input: any) => {
            const result = await naviApi.getNaviContractConfigs();
            return JSON.stringify(result);
        }
    },
    getNaviFeeAndRevenue: {
        description: "Get NAVI fee and revenue data",
        parameters: z.object({
            fromTimestamp: z.number()
        }),
        execute: async (input: any) => {
            const result = await naviApi.getNaviFeeAndRevenue(input.fromTimestamp);
            return JSON.stringify(result);
        }
    },
    getNaviFlashloanConfig: {
        description: "Get NAVI flashloan configurations",
        parameters: z.object({}),
        execute: async (input: any) => {
            const result = await naviApi.getNaviFlashloanConfig();
            return JSON.stringify(result);
        }
    },
    getNaviOracleConfig: {
        description: "Get NAVI oracle configurations",
        parameters: z.object({}),
        execute: async (input: any) => {
            const result = await naviApi.getNaviOracleConfig();
            return JSON.stringify(result);
        }
    },
    getNaviClaimedRewards: {
        description: "Get user's claimed rewards history",
        parameters: z.object({
            userAddress: z.string()
        }),
        execute: async (input: any) => {
            const result = await naviApi.getNaviClaimedRewards(input.userAddress);
            return JSON.stringify(result);
        }
    },
    naviInteract: {
        description: "Interact with NAVI protocol to supply tokens, withdraw tokens, borrow, repay or claim rewards",
        parameters: z.object({
            action: z
                .enum(["supply", "withdraw", "borrow", "repay", "claim"])
                .describe("Action to perform on NAVI"),
            coinType: z
                .enum([
                    "Sui",
                    "NAVX",
                    "vSui",
                    "USDT", 
                    "USDC",
                    "WETH",
                    "CETUS",
                    "haSui",
                    "WBTC",
                    "AUSD",
                ])
                .optional()
                .describe("Coin type to interact with"),
            amount: z.string().optional().describe("Amount in base units"),
        }),
        execute: async (args: any) => {
            // Validate environment variables
            if (!process.env.SUI_PRIVATE_KEY) {
                throw new Error("SUI_PRIVATE_KEY environment variable is required");
            }

            const signer = Ed25519Keypair.fromSecretKey(
                Buffer.from(process.env.SUI_PRIVATE_KEY, 'hex')
            );
            const client = new NAVISDKClient({
                privateKeyList: [signer.getSecretKey().toString()],
            });
            const account = client.accounts[0];

   

            const coinMap: { [key: string]: any } = {
                Sui,
                NAVX,
                vSui,
                USDT,
                WETH,
                CETUS,
                haSui,
                WBTC,
                AUSD,
                wUSDC,
            };

            let result;
            switch (args.action) {
                case "supply":
                    if (!args.coinType || !args.amount) {
                        throw new Error("Coin type and amount required for supply");
                    }
                    result = await account.depositToNavi(
                        coinMap[args.coinType],
                        Number(args.amount)
                    );
                    return result;

                case "withdraw":
                    if (!args.coinType || !args.amount) {
                        throw new Error("Coin type and amount required for withdraw");
                    }
                    result = await account.withdraw(
                        coinMap[args.coinType],
                        Number(args.amount)
                    );
                    return result;

                case "borrow":
                    if (!args.coinType || !args.amount) {
                        throw new Error("Coin type and amount required for borrow");
                    }
                    result = await account.borrow(coinMap[args.coinType], Number(args.amount));
                    return result;

                case "repay":
                    if (!args.coinType || !args.amount) {
                        throw new Error("Coin type and amount required for repay");
                    }
                    result = await account.repay(coinMap[args.coinType], Number(args.amount));
                    return result;

                case "claim":
                    result = await account.claimAllRewards();
                    return result;

                default:
                    throw new Error("Invalid action specified");
            }
        }
    }
}
