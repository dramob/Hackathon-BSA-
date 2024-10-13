'use client';

import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useUser } from '../../contexts/UserContext';
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function Actions() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiConfig, setConfettiConfig] = useState({});
  const { addPoints } = useUser();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [result, setTxResult] = useState<SuiTransactionBlockResponse | null>(null);
  const packageId = "0x76fd1fcc8139c7678988d4a466ae4a1e84e118ae8f995bbfe5333e005df37681";
  const moduleId = "Hydra";
  const functionId = "update_hydra";
  const objectId = "0x26975450f54c013ec8f6db715b3ed06b518bdc14af01be51e959b1993b70227a";

  const popupRef = useRef(null);

  useEffect(() => {
    if (!currentAccount) {
      router.push('/');
    }
  }, [currentAccount, router]);

  useEffect(() => {
    if (showResult) {
      //@ts-ignore
      const popupRect = popupRef.current?.getBoundingClientRect();
      if (popupRect) {
        setConfettiConfig({
          numberOfPieces: 200,
          recycle: false,
          gravity: 0.5,
          initialVelocityX: { min: -5, max: 5 },
          initialVelocityY: { min: -15, max: -5 },
          origin: {
            x: (popupRect.left + popupRect.width / 2) / window.innerWidth,
            y: (popupRect.top + popupRect.height / 2) / window.innerHeight
          }
        });
      }
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000); // Stop confetti after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setShowPopup(true);
    setIsLoading(true);
    const transaction = new Transaction();
    
    // Define the Move function call
    transaction.moveCall({
      target: `${packageId}::${moduleId}::${functionId}`,
      arguments: [transaction.object(objectId), transaction.pure.u64(300), transaction.pure.u64(300)],
    });

    const signer = currentAccount?.address;

    if (signer) {
      transaction.setSender(signer);
    } else {
      console.log("Error getting currentAccount");
    }

    try {
      const result = await signAndExecuteTransaction(
        {
          transaction: transaction,
          chain: 'sui:devnet',
        },
        { 
          onSuccess: (result) => {
            console.log('Transaction successful:', result);
            setShowResult(true);
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            // Handle error, e.g., show an error message to the user
          },
        },
      );
    } catch (error) {
      console.error('Transaction execution error:', error);
      // Handle any additional errors
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowResult(false);
    setShowConfetti(false);
  };

  const handleClaim = () => {
    addPoints(300, 0.8); // Add 300 points and increase level by 0.8 (80%)
    router.push('/profile');
  };

  const handleShare = () => {
    // TODO: Implement share logic
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#C4F9FF] to-[#D1FFE3] font-dosis relative pt-40">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>
      <div className="fixed top-28 left-1/2 transform -translate-x-1/2 flex space-x-6 mb-4 z-10">
        <Link href="/profile" className="bg-[#8FDDFF] text-white font-bold py-3 px-8 rounded-full shadow-md text-base">PROFILE</Link>
        <Link href="/actions" className="bg-[#FFE9A0] text-[#FF7BA7] font-bold py-3 px-8 rounded-full shadow-md text-base">ACTIONS</Link>
        <Link href="/challenges" className="bg-[#8FDDFF] text-white font-bold py-3 px-8 rounded-full shadow-md text-base">CHALLENGES</Link>
      </div>
      <div className="bg-[#5EBAE7] p-8 rounded-3xl shadow-lg text-center max-w-md w-full mt-10">
        <h2 className="text-white text-lg font-bold mb-4">DESCRIBE YOUR ECO-ACTION</h2>
        <textarea
          className="w-full p-2 rounded-xl mb-4 text-[#00A8C0] placeholder-[#A0A0A0] bg-white text-sm"
          rows={3}
          placeholder="Type your eco-action here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mb-8">
          <h3 className="text-white text-base font-bold mb-2">UPLOAD YOUR PROOF</h3>
          <div className="bg-white rounded-xl p-2 flex items-center justify-between">
            <span className="text-[#A0A0A0] text-xs truncate max-w-[150px]">{file ? file.name : 'No file chosen'}</span>
            <label className="bg-[#8FDDFF] text-white font-bold py-1 px-3 rounded-full cursor-pointer text-xs">
              CHOOSE FILE
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
            </label>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#FFE9A0] text-[#FF7BA7] font-bold py-3 px-4 rounded-full text-sm shadow-md hover:bg-[#FFD670] transition duration-300 w-full mt-4"
        >
          SUBMIT TO CALCULATE YOUR ECO-SCORE
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={popupRef} className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative">
            <button onClick={closePopup} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              ✕
            </button>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="loading-spinner mb-8"></div>
                <div>
                  <h2 className="text-[#00A8C0] text-2xl font-bold mb-2">Wait a second...</h2>
                  <p className="text-[#00A8C0] text-lg">
                    We are calculating the impact<br />
                    of your eco-action...
                  </p>
                </div>
              </div>
            ) : showResult && (
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-[#FF69B4] text-2xl font-bold mb-4">
                  🎉 CONGRATULATIONS YOUR ACTIONS<br />
                  CAN LET YOU EARN 300 POINTS!<br />
                  LEVEL UP 10%
                </h2>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleClaim}
                    className="bg-[#8FDDFF] text-white font-bold py-2 px-6 rounded-full shadow-md"
                  >
                    CLAIM
                  </button>
                  <button
                    onClick={handleShare}
                    className="bg-[#8FDDFF] text-white font-bold py-2 px-6 rounded-full shadow-md"
                  >
                    SHARE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showConfetti && <ReactConfetti {...confettiConfig} />}

      <style jsx>{`
        .loading-spinner {
          border: 4px solid rgba(0, 168, 192, 0.1);
          border-left-color: #00A8C0;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export const dynamicConfig = 'force-dynamic';
