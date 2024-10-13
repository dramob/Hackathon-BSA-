'use client';


import { ConnectButton, useCurrentAccount,useSuiClientQuery, useSuiClient, useCurrentWallet, useSignAndExecuteTransaction, useSignTransaction } from "@mysten/dapp-kit";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { SuiClient } from "@mysten/sui/client";


function OwnedObjects({ address }: { address: string }) {
	const { data } = useSuiClientQuery('getObject', {
		id: address,
	});
	if (!data) {
		return null;
	}

	// Assuming data is an object, you can render it as JSON for simplicity
	return <div>{JSON.stringify(data)}</div>;
}
let objectId: any

export default function ClaimNFT() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const client = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
		execute: async ({ bytes, signature }) =>
			await client.executeTransactionBlock({
				transactionBlock: bytes,
				signature,
				options: {
					// Raw effects are required so the effects can be reported back to the wallet
					showRawEffects: true,
					// Select additional data to return
					showObjectChanges: true,
				},
			}),
	});
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

    const result = signAndExecuteTransaction(
      {
        transaction: transaction,
        chain: 'sui:devnet',
      },
      { 
        onSuccess: async (result) => {
          console.log('executed transaction', result);
          
            console.log('object changes', result.objectChanges);
            // Extract object ID from created objects
            const createdObject = result.objectChanges?.find(change => change.type === 'created');
            if (createdObject && 'objectId' in createdObject) {
               objectId = createdObject.objectId;
              console.log('Minted NFT Object ID:', objectId);
            } else {
              console.log('No created object found in transaction result');
            }
          //fetch object by id
          //console.log()
          const r = await client.getObject({id: objectId})
          console.log("getobject",r);
          /*const { data } = useSuiClientQuery('getObject', {
            id: objectId,
          });
          if (data) {
            console.log("getobject",data);
          }*/

            //setDigest(result.digest);
          /*if (signer) {
          const data = OwnedObjects({address: signer});
          console.log(data);
          }*/

          /*try {
            // Decode the base64 effects string
            const decodedEffects = atob(result.effects);
            // Parse the JSON if applicable
            const effectsJson = JSON.parse(decodedEffects);

            // Attempt to extract the object ID
            const objectId = effectsJson?.created?.[0]?.reference?.objectId; // Adjust this path based on the actual structure
            if (objectId) {
              console.log('Minted NFT Object ID:', objectId);
            } else {
              console.log('Object ID not found in transaction result');
            }
          } catch (error) {
            console.error('Failed to decode or parse effects:', error);
          }*/

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
      {/* <div>
      <h1>Owned Objects</h1>
      <OwnedObjects address={"0x26975450f54c013ec8f6db715b3ed06b518bdc14af01be51e959b1993b70227a"} />
    </div> */}
    </div>
  );
}
