import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { z } from 'zod';
import BigNumber from 'bignumber.js';
import { fetchLiquidStakingInfo, LstClient } from "@suilend/springsui-sdk"

const LIQUID_STAKING_INFO = {
    id: "0x15eda7330c8f99c30e430b4d82fd7ab2af3ead4ae17046fcb224aa9bad394f6b",
    type: "0x83556891f4a0f233ce7b05cfe7f957d4020492a34f5405b2cb9377d060bef4bf::spring_sui::SPRING_SUI",
    weightHookId: "0xbbafcb2d7399c0846f8185da3f273ad5b26b3b35993050affa44cfa890f1f144",
};

const SUI_DECIMALS = 9;
const SSUI_DECIMALS = 9;

export const springSuiTools = {
    mintSSui: {
        description: "Gets the transaction to mint sSUI by staking SUI",
        parameters: z.object({
            amount: z.number().describe("Amount of SUI to stake"),
            recipientAddress: z.string().describe("Address to receive sSUI")
        }),
        execute: async (input: any) => {
            const tx = new Transaction();
            const [sui] = tx.splitCoins(tx.gas, [input.amount]);
            const client = new SuiClient({ url: getFullnodeUrl('devnet') });
            const lstClient = await LstClient.initialize(client, LIQUID_STAKING_INFO);
            const sSui = lstClient.mint(tx, sui);
            tx.transferObjects([sSui], input.recipientAddress);

            return JSON.stringify(await tx.toJSON());
        }
    },

    redeemSSui: {
        description: "Gets the transaction to redeem sSUI back to SUI",
        parameters: z.object({
            amount: z.number().describe("Amount of sSUI to redeem"),
            recipientAddress: z.string().describe("Address to receive SUI")
        }), 
        execute: async (input: any) => {
            const tx = new Transaction();
            const client = new SuiClient({ url: getFullnodeUrl('devnet') });
            const lstClient = await LstClient.initialize(client, LIQUID_STAKING_INFO);
            const lstCoins = await client.getCoins({
                owner: input.recipientAddress,
                coinType: LIQUID_STAKING_INFO.type,
                limit: 1000,
            });

            if (lstCoins.data.length > 1) {
                tx.mergeCoins(
                    lstCoins.data[0].coinObjectId,
                    lstCoins.data.slice(1).map((c) => c.coinObjectId),
                );
            }
            const [lst] = tx.splitCoins(lstCoins.data[0].coinObjectId, [BigInt(input.amount)]);
            const sui = lstClient.redeem(tx, lst);
            tx.transferObjects([sui], input.recipientAddress);
            return JSON.stringify(await tx.toJSON());
        }
    },

    getExchangeRate: {
        description: "Gets the exchange rate between sSUI and SUI",
        parameters: z.object({}),
        execute: async () => {
            const client = new SuiClient({ url: getFullnodeUrl('devnet') });
            const rawLiquidStakingInfo = await fetchLiquidStakingInfo(
                LIQUID_STAKING_INFO,
                client
            );

            const totalSuiSupply = new BigNumber(
                rawLiquidStakingInfo.storage.totalSuiSupply.toString()
            ).div(10 ** SUI_DECIMALS);

            const totalLstSupply = new BigNumber(
                rawLiquidStakingInfo.lstTreasuryCap.totalSupply.value.toString()
            ).div(10 ** SSUI_DECIMALS);

            const suiToLstExchangeRate = !totalSuiSupply.eq(0)
                ? totalLstSupply.div(totalSuiSupply)
                : new BigNumber(0);

            return {
                suiToLstExchangeRate: suiToLstExchangeRate.toString(),
                totalSuiSupply: totalSuiSupply.toString(),
                totalLstSupply: totalLstSupply.toString()
            };
        }
    }
};
