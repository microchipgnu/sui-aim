import { Transaction } from '@mysten/sui/transactions';

/**
 * Sets a custom gas price for a transaction
 * @param tx The transaction to set gas price for
 * @param gasPrice The gas price in MIST
 */
export function setCustomGasPrice(tx: Transaction, gasPrice: number) {
    tx.setGasPrice(gasPrice);
}

/**
 * Sets a custom gas budget for a transaction
 * @param tx The transaction to set gas budget for 
 * @param gasBudget The gas budget in MIST
 */
export function setCustomGasBudget(tx: Transaction, gasBudget: number) {
    tx.setGasBudget(gasBudget);
}

/**
 * Sets custom gas payment coins for a transaction
 * @param tx The transaction to set gas payment for
 * @param gasCoins Array of gas coin objects with objectId, version and digest
 */
export function setCustomGasPayment(tx: Transaction, gasCoins: Array<{
    objectId: string;
    version: string | number;
    digest: string;
}>) {
    tx.setGasPayment(gasCoins);
}