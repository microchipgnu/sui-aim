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
 * Creates a transaction to split a SUI coin into multiple coins
 * @param coinId The coin object ID to split
 * @param amounts Array of amounts to split into
 * @returns Transaction
 */
export function createSuiSplitCoinTx(coinId: string, amounts: number[]): Transaction {
    const tx = new Transaction();
    const coin = tx.object(coinId);
    tx.splitCoins(coin, amounts);
    return tx;
}
