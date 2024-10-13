import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/zklogin';
import { SuiClient } from '@mysten/sui/client';

const FULLNODE_URL = 'https://fullnode.devnet.sui.io'; // replace with the RPC URL you want to use
const suiClient = new SuiClient({ url: FULLNODE_URL });

export type EphemeralData = {
    ephemeralKeyPair: Ed25519Keypair;
    nonce: string;
    maxEpoch: number;
  };

export async function generateEphemeralKeyAndNonce() {
  const { epoch } = await suiClient.getLatestSuiSystemState();
  const maxEpoch = Number(epoch) + 2;
  const ephemeralKeyPair = new Ed25519Keypair();
  const randomness = generateRandomness();
  const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

  return { ephemeralKeyPair, nonce, maxEpoch };
}