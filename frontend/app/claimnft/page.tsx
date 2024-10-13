'use client';

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClaimNFT() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!currentAccount) {
      router.push('/');
    }
  }, [currentAccount, router]);

  const handleClaim = () => {
    console.log("Claiming NFT...");
    // TODO: Implement actual NFT claiming logic here
    router.push('/profile');
  };

  const handleImageError = () => {
    console.error('Failed to load image from:', '/app_UX/avatar/avatar1.png');
    setImageError(true);
  };

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
            onClick={handleClaim}
            className="bg-[#FFB7D5] text-white font-bold py-3 px-8 rounded-full text-base shadow-md hover:bg-[#FFA3C9] transition duration-300 w-full transform hover:scale-105"
          >
            CLAIM
          </button>
        </div>
      </div>
    </div>
  );
}
