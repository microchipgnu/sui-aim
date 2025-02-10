import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export const createRandoAccount = () => {
    const keypair = new Ed25519Keypair();
    const address = keypair.toSuiAddress();
    return {
        keypair, address, keypairString: JSON.stringify({
            type: 'ed25519',
            publicKey: keypair.toSuiAddress(),
            privateKey: keypair.getSecretKey(),
        })
    };
}