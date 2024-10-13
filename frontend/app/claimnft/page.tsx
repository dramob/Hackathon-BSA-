'use client';


import { ConnectButton, useCurrentAccount,useSuiClientQuery, useSuiClient, useCurrentWallet, useSignAndExecuteTransaction, useSignTransaction } from "@mysten/dapp-kit";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";


function OwnedObjects({ address }: { address: string }) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address,
	});
	if (!data) {
		return null;
	}

	return data;
}

export default function ClaimNFT() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [result, setTxResult] = useState<SuiTransactionBlockResponse | null>(null);
  const packageId = "0x76fd1fcc8139c7678988d4a466ae4a1e84e118ae8f995bbfe5333e005df37681";
  const moduleId = "Hydra";
  const functionId = "mint_avatar";

  useEffect(() => {
    if (!currentAccount) {
      router.push('/');
    }
  }, [currentAccount, router]);

  const handleClaim = async (url: string) => {
    console.log("Claiming NFT...");
    const transaction = new Transaction();
    
    // Define the Move function call
    transaction.moveCall({
      target: `${packageId}::${moduleId}::${functionId}`,
      arguments: [transaction.pure.string(url)], // Pass the URL as an argument
    });

     const signer = currentAccount?.address;

    if (signer) {
    transaction.setSender(signer);
    } else {
      console.log("Error getting currentAccount")
    }

    const result = await signAndExecuteTransaction(
      {
        transaction: transaction,
        chain: 'sui:devnet',
      },
      { 
        onSuccess: (result) => {
          console.log('executed transaction', result);
          router.push('/profile');
        },
        onError: (error) => {
          console.error('Transaction failed:', error);
          // You can add additional error handling here, such as displaying an error message to the user
        },
      },
    );
    

    //setTxResult(result);
    console.log('Mint Avatar Response:', result);
    
  };

  const handleImageError = () => {
    console.error('Failed to load image from:', '/app_UX/avatar/avatar1.png');
    setImageError(true);
  };

  /*const mintAvatar = async function mintAvatar(url: string) {
    const transaction = new Transaction();
    
    // Define the Move function call
    transaction.moveCall({
      target: `${packageId}::${moduleId}::${functionId}`,
      arguments: [transaction.pure.string(url)], // Pass the URL as an argument
    });

     const signer = currentAccount?.address;

    if (signer) {
    transaction.setSender(signer);
    } else {
      console.log("Error getting currentAccount")
    }

    await signAndExecuteTransaction(
      {
        transaction: transaction,
        chain: 'sui:devnet',
      },
      { 
        onSuccess: (result) => {
          console.log('executed transaction', result);
          //setDigest(result.digest);
        },
        onError: (error) => {
          console.error('Transaction failed:', error);
          // You can add additional error handling here, such as displaying an error message to the user
        },
      },
    );
    

    setTxResult(result);
    console.log('Mint Avatar Response:', result);
  }*/
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#C4F9FF] to-[#D1FFE3] font-dosis relative">
      <div className="absolute top-4 right-4 z-10">
        <ConnectButton />
      </div>
      <div className="bg-[#5EBAE7] p-8 rounded-3xl shadow-lg text-center max-w-sm w-full">
        <div className="relative">
          {imageError ? (
            <div className="w-[140px] h-[140px] bg-gray-200 flex items-center justify-center mx-auto mb-6 rounded-full shadow-lg">
              Image not found
            </div>
          ) : (
            <Image
              src="/app_UX/avatar/avatar1.png"
              alt="Hydra Avatar"
              width={140}
              height={140}
              className="mx-auto mb-6 rounded-full shadow-lg"
              onError={handleImageError}
            />
          )}
          <div className="bg-[#B5E8FF] p-4 rounded-xl mb-6 shadow-sm">
            <h2 className="text-[#00A8C0] text-xl font-bold mb-1">START YOUR JOURNEY</h2>
            <p className="text-[#3D8CA7] text-sm">Claim your unique Hydra NFT and begin your eco-friendly adventure!</p>
          </div>
          <button 
            onClick={(event) => handleClaim('https://ibb.co/PTtS4V9')}
            className="bg-[#FFB7D5] text-white font-bold py-3 px-8 rounded-full text-base shadow-md hover:bg-[#FFA3C9] transition duration-300 w-full transform hover:scale-105"
          >
            CLAIM
          </button>
        </div>
      </div>
    </div>
  );
}
