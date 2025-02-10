import { Transaction } from '@mysten/sui/transactions';

/**
 * Creates a transaction to transfer SUI to a recipient
 * @param recipient The recipient address
 * @param amount The amount of SUI to transfer
 * @returns Transaction
 */
export function createSuiTransferTx(recipient: string, amount: number): Transaction {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [amount]);
    tx.transferObjects([coin], recipient);
    return tx;
}

/**
 * Creates a transaction to merge multiple SUI coins into one
 * @param coinIds Array of coin object IDs to merge
 * @returns Transaction
 */
export function createSuiMergeCoinsTx(coinIds: string[]): Transaction {
    const tx = new Transaction();
    // Convert coin IDs to object references
    const coins = coinIds.map(id => tx.object(id));
    const primary = coins[0];
    const rest = coins.slice(1);
    tx.mergeCoins(primary, rest);
    return tx;
}

/**
 * Creates a transaction to mint an NFT on Sui
 * @param name The name of the NFT
 * @param description The description of the NFT
 * @param url The IPFS URL of the NFT content
 * @returns Transaction
 */
export function createNftMintTx(name: string, description: string, url: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
        target: '0x2::devnet_nft::mint',
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.pure.string(url)
        ]
    });
    return tx;
}

/**
 * Creates a transaction to transfer an NFT to a recipient
 * @param nftId The object ID of the NFT to transfer
 * @param recipient The recipient address
 * @returns Transaction
 */
export function createNftTransferTx(nftId: string, recipient: string): Transaction {
    const tx = new Transaction();
    tx.transferObjects([tx.object(nftId)], recipient);
    return tx;
}

/**
 * Creates a transaction to delete/burn an NFT
 * @param nftId The object ID of the NFT to delete
 * @returns Transaction
 */
export function createNftDeleteTx(nftId: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
        target: '0x2::devnet_nft::burn',
        arguments: [tx.object(nftId)]
    });
    return tx;
}

/**
 * Creates a transaction to update an NFT's metadata
 * @param nftId The object ID of the NFT to update
 * @param name The new name
 * @param description The new description 
 * @param url The new IPFS URL
 * @returns Transaction
 */
export function createNftUpdateTx(nftId: string, name: string, description: string, url: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
        target: '0x2::devnet_nft::update',
        arguments: [
            tx.object(nftId),
            tx.pure.string(name),
            tx.pure.string(description), 
            tx.pure.string(url)
        ]
    });
    return tx;
}