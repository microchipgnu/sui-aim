import { aim, defaultRuntimeOptions, Tag } from "@aim-sdk/core";
import { Sandbox } from '@e2b/code-interpreter';
import { z } from "zod";
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui/faucet';
import { suiGraphTools } from "./sui/graphql";
import { createRandoAccount } from "./sui/account";

const tools = {
    test: {
        description: "A test tool",
        parameters: z.object({
            name: z.string(),
        }),
        execute: async (input: any) => {
            return 1 + 1;
        }
    },
    accountDetails: {
        description: "Get the details of an account",
        parameters: z.object({
            address: z.string(),
        }),
        execute: async (input: any) => {
            return JSON.stringify(input);
        }
    },
    createRandomAccount: {
        description: "Create a new account",
        parameters: z.object({}),
        execute: async (input: any) => {
            return createRandoAccount();
        }
    },
    getFundsFromFaucet: {
        description: "Get funds from the faucet",
        parameters: z.object({
            address: z.string(),
        }),
        execute: async (input: any) => {
            const response = await requestSuiFromFaucetV0({
                host: getFaucetHost("devnet"),
                recipient: input.address,
            });
            return JSON.stringify(response);
        }
    },
    getGasPrice: {
        description: "Get the current gas price of a transaction",
        parameters: z.object({
            tx: z.any()
        }),
        execute: async (input: any) => {
            return input.tx.gasPrice;
        }
    },
    getGasBudget: {
        description: "Get the current gas budget of a transaction",
        parameters: z.object({
            tx: z.any()
        }),
        execute: async (input: any) => {
            return input.tx.gasBudget;
        }
    },
    getGasPayment: {
        description: "Get the current gas payment coins of a transaction",
        parameters: z.object({
            tx: z.any()
        }),
        execute: async (input: any) => {
            return input.tx.gasPayment;
        }
    },
    ...suiGraphTools,
}
export const createAimConfig = (content: string) => aim({
    content,
    options: {
        ...defaultRuntimeOptions,
        env: {
            "OPENAI_API_KEY": process.env.OPENAI_API_KEY || "",
            "E2B_API_KEY": process.env.E2B_API_KEY || "",
            "REPLICATE_API_KEY": process.env.REPLICATE_API_KEY || "",
            "OPENROUTER_API_KEY": process.env.OPENROUTER_API_KEY || "",
        },
        events: {
            onError: (error) => {
                console.error(error);
            },
            onLog: (message) => {
                console.log(message);
            }
        },
        adapters: [
            {
                type: "code",
                handlers: {
                    eval: async ({ code, language, variables }) => {
                        const sbx = await Sandbox.create({ envs: { ...variables }, apiKey: process.env.E2B_API_KEY });
                        const execution = await sbx.runCode(code, { language });
                        await sbx.kill();
                        return {
                            result: JSON.stringify(execution)
                        };
                    }
                }
            }
        ],
        tools: tools,
        plugins: [
            {
                plugin: {
                    name: "get",
                    version: "0.0.1",
                    tags: {
                        "tools": {
                            render: "tools",
                            execute: async function* ({ node, config, state }) {
                                yield Object.keys(tools).join(',');
                            },
                        },
                    },
                },
            },
        ],
    },
});
