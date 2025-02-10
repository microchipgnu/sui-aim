import { aim, defaultRuntimeOptions, GLOBAL_SCOPE, Tag } from "@aim-sdk/core";
import { Sandbox } from '@e2b/code-interpreter';
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui/faucet';
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { z } from "zod";
import { getBluefinExchangeInfo, getMarketData } from "./bluefin/api";
import { createFileSystem } from "./filesystem";
import { naviAITools } from "./navi/api";
import { createRandoAccount } from "./sui/account";
import { suiGraphTools } from "./sui/graphql";
import { springSuiTools } from "./suilend/springsui";
import { handleAtomaCompletion } from "./atoma";

const tools = {
    accountDetails: {
        description: "Get the details of an account",
        parameters: z.object({}),
        execute: async (input: any) => {
            const keyPair = Ed25519Keypair.fromSecretKey(process.env.SUI_PRIVATE_KEY || "");
            return JSON.stringify({ address: keyPair.toSuiAddress() });
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
    mintNFT: {
        description: "Mint an NFT",
        parameters: z.object({
            name: z.string({ description: "The name of the NFT" }),
            description: z.string({ description: "The description of the NFT" }),
            recipient: z.string({ description: `The address to mint the NFT to. Default is ${process.env.SUI_PUBLIC_ADDRESS}` }),
        }),
        execute: async (input: any) => {
            const tx = new Transaction();
            tx.moveCall({
                target: '0xec555da15e4b30307b20887792d173fe395ffddd7ec348670f3071d72a192598::devnet_nft::mint_to_address',
                arguments: [
                    tx.pure.string(input.name),
                    tx.pure.string(input.description),
                    tx.pure.string("https://cdn.prod.website-files.com/6425f546844727ce5fb9e5ab/65690e9a6e0d07d1b68c7050_sui-type.svg"),
                    tx.pure.address(input.recipient)
                ]
            });

            tx.setGasBudget(10000000);

            return JSON.stringify(await tx.toJSON());
        }
    },
    submitTransaction: {
        description: "Submit a transaction",
        parameters: z.object({
            transaction: z.string(),
        }),
        execute: async (input: any) => {
            console.log(input);
            const client = new SuiClient({ url: getFullnodeUrl('devnet') });
            const keyPair = Ed25519Keypair.fromSecretKey(process.env.SUI_PRIVATE_KEY || "");

            const tx = Transaction.from(input.transaction);

            // Get coins owned by the address
            const address = keyPair.getPublicKey().toSuiAddress();
            const coins = await client.getCoins({
                owner: address,
                coinType: "0x2::sui::SUI"
            });

            if (coins.data.length === 0) {
                throw new Error("No SUI coins found in wallet. Please get some SUI from the faucet first.");
            }

            const result = await client.signAndExecuteTransaction({
                transaction: tx,
                signer: keyPair
            });

            const txn = await client.waitForTransaction({ digest: result.digest });

            return `Transaction submitted successfully. View it at https://suiscan.xyz/devnet/tx/${txn.digest}?network=devnet`;
        }
    },
    getBluefinExchangeInfo: {
        description: "Get the exchange info",
        parameters: z.object({}),
        execute: async (input: any) => {
            return getBluefinExchangeInfo();
        }
    },
    getBluefinMarketData: {
        description: "Get the market data",
        parameters: z.object({}),
        execute: async (input: any) => {
            return getMarketData();
        }
    },
    ...suiGraphTools,
    ...naviAITools,
    ...springSuiTools
}

const fileSystem = createFileSystem();
const files = fileSystem.getAllFiles();

export const createAimConfig = (content: string) => aim({
    content,
    options: {
        ...defaultRuntimeOptions,
        timeout: 1000 * 60 * 5,
        experimental_files: files.reduce((acc, file) => {
            acc[file.path] = { content: file.content };
            return acc;
        }, {} as Record<string, { content: string }>),
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
                        console.log(code, language, variables);
                        const sbx = await Sandbox.create({
                            apiKey: process.env.E2B_API_KEY || "", logger: console
                        });
                        const execution = await sbx.runCode(code, { language });
                        await sbx.kill();
                        return execution.toJSON();
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
            {
                plugin: {
                    name: "time",
                    version: "0.0.1",
                    tags: {
                        "wait": {
                            render: "wait",
                            execute: async function* ({ node, config, state }) {
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            },
                        },
                    },
                },
            },
            {
                plugin: {
                    name: "atoma",
                    version: "0.0.1",
                    tags: {
                        "completion": {
                            render: "completion",
                            execute: async function* ({ node, config, state }) {

                                const contextText = Object.entries(state.context.textRegistry)
                                    .map(([key, values]) => `${key}:\n${values.join('\n')}`)
                                    .join('\n\n');
                                    
                                const result = await handleAtomaCompletion(contextText);
                                
                                yield new Tag("completion", {}, [result.textStream[0]]);
                            },
                        },
                    },
                },
            },
        ],
    },
});
