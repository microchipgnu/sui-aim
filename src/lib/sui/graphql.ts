import { GraphQLClient, gql } from 'graphql-request';
import { tool } from 'ai';
import { z } from 'zod';

export const NETWORK_URLS = {
    MAINNET: 'https://sui-mainnet.mystenlabs.com/graphql',
    TESTNET: 'https://sui-testnet.mystenlabs.com/graphql',
    DEVNET: 'https://sui-devnet.mystenlabs.com/graphql',
} as const;

export type NetworkType = keyof typeof NETWORK_URLS;

const createGqlClient = (network: NetworkType | string = 'TESTNET') => {
    const endpoint = NETWORK_URLS[network as NetworkType] || network;
    return new GraphQLClient(endpoint);
};

export const suiGraphTools = {
    getNetworks: tool({
        description: 'Get information about available Sui networks',
        parameters: z.object({}),
        execute: async () => {
            return Object.entries(NETWORK_URLS)
                .map(([network, url]) => `${network} - ${url}`)
                .join('\n');
        }
    }),

    getChainIdentifier: tool({
        description: 'Get the chain identifier for a specific Sui network',
        parameters: z.object({
            network: z.enum(['MAINNET', 'TESTNET', 'DEVNET']).optional()
                .describe('The network to query (MAINNET, TESTNET, or DEVNET)')
        }),
        execute: async ({ network = 'TESTNET' }) => {
            const client = createGqlClient(network);
            const query = gql`
                query ChainIdentifier {
                    chainIdentifier
                }
            `;

            try {
                const result = await client.request<{ chainIdentifier: string }>(query);
                return result.chainIdentifier;
            } catch (error: any) {
                throw new Error(`Failed to get chain identifier: ${error.message}`);
            }
        }
    }),

    getObjectHistory: tool({
        description: 'Get transaction history for a specific Sui object',
        parameters: z.object({
            network: z.enum(['MAINNET', 'TESTNET', 'DEVNET']).optional()
                .describe('The network to query'),
            objectId: z.string().describe('The object ID to fetch history for')
        }),
        execute: async ({ network = 'TESTNET', objectId }) => {
            const client = createGqlClient(network);
            const query = gql`
                query GetObjectHistory($objectId: SuiAddress!) {
                    transactionBlocks(filter: {changedObject: $objectId}) {
                        nodes {
                            sender {
                                address
                            }
                            digest
                            timestamp
                            effects {
                                objectChanges {
                                    nodes {
                                        address
                                        inputState {
                                            version
                                        }
                                        outputState {
                                            version
                                        }
                                    }
                                }
                                balanceChanges {
                                    nodes {
                                        amount
                                        coinType {
                                            name
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            try {
                const result = await client.request<{ transactionBlocks: unknown }>(query, { objectId });
                return JSON.stringify(result.transactionBlocks || null, null, 2);
            } catch (error: any) {
                throw new Error(`Failed to fetch object history: ${error.message}`);
            }
        }
    }),

    getStakingHistory: tool({
        description: 'Get staking transaction history for an address',
        parameters: z.object({
            network: z.enum(['MAINNET', 'TESTNET', 'DEVNET']).optional()
                .describe('The network to query'),
            address: z.string().describe('The address to fetch staking history for')
        }),
        execute: async ({ network = 'TESTNET', address }) => {
            const client = createGqlClient(network);
            const query = gql`
                query GetStakingHistory($address: SuiAddress!) {
                    transactionBlocks(filter: {
                        function: "0x3::sui_system::request_add_stake"
                        sentAddress: $address
                    }) {
                        nodes {
                            digest
                            timestamp
                            effects {
                                balanceChanges {
                                    nodes {
                                        owner {
                                            address
                                        }
                                        amount
                                        coinType {
                                            name
                                        }
                                    }
                                }
                                gasUsed {
                                    computationCost
                                    storageCost
                                    storageRebate
                                }
                            }
                            gasInput {
                                gasSponsor {
                                    address
                                }
                                gasPrice
                                gasPayment {
                                    nodes {
                                        address
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            try {
                const result = await client.request<{ transactionBlocks: unknown }>(query, { address });
                return JSON.stringify(result.transactionBlocks || null, null, 2);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch staking history: ${error.message}`);
                }
                throw new Error('Failed to fetch staking history');
            }
        }
    }),

    getRecentTransactions: tool({
        description: 'Get recent non-system transactions',
        parameters: z.object({
            network: z.enum(['MAINNET', 'TESTNET', 'DEVNET']).optional()
                .describe('The network to query'),
            limit: z.number().optional().describe('Number of transactions to fetch')
        }),
        execute: async ({ network = 'TESTNET', limit = 10 }) => {
            const client = createGqlClient(network);
            const query = gql`
                query GetRecentTransactions($limit: Int!) {
                    transactionBlocks(last: $limit, filter: {kind: PROGRAMMABLE_TX}) {
                        nodes {
                            digest
                            sender {
                                address
                            }
                            timestamp
                            effects {
                                status
                                balanceChanges {
                                    nodes {
                                        amount
                                        coinType {
                                            name
                                        }
                                    }
                                }
                                gasUsed {
                                    computationCost
                                    storageCost
                                    storageRebate
                                }
                            }
                            signatures {
                                nodes {
                                    signatureScheme
                                    signature
                                    pubKey {
                                        toBase64
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            try {
                const result = await client.request<{ transactionBlocks: unknown }>(query, { limit });
                return JSON.stringify(result.transactionBlocks || null, null, 2);
            } catch (error: any) {
                throw new Error(`Failed to fetch recent transactions: ${error.message}`);
            }
        }
    }),

    getPublicTransfers: tool({
        description: 'Get recent public transfer transactions',
        parameters: z.object({
            network: z.enum(['MAINNET', 'TESTNET', 'DEVNET']).optional()
                .describe('The network to query'),
            limit: z.number().optional().describe('Number of transactions to fetch')
        }),
        execute: async ({ network = 'TESTNET', limit = 10 }) => {
            const client = createGqlClient(network);
            const query = gql`
                query GetPublicTransfers($limit: Int!) {
                    transactionBlocks(
                        last: $limit,
                        filter: {
                            function: "0x2::transfer::public_transfer"
                        }
                    ) {
                        nodes {
                            digest
                            sender {
                                address
                            }
                            effects {
                                status
                                balanceChanges {
                                    nodes {
                                        amount
                                        coinType {
                                            abilities
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            try {
                const result = await client.request<{ transactionBlocks: unknown }>(query, { limit });
                return JSON.stringify(result.transactionBlocks || null, null, 2);
            } catch (error: any) {
                throw new Error(`Failed to fetch public transfers: ${error.message}`);
            }
        }
    })
};