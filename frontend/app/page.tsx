'use client';

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();
  const [walletStatus, setWalletStatus] = useState('disconnected');
  const [isConnected, setIsConnected] = useState('No');
  const [fullAddress, setFullAddress] = useState('Not connected');

  useEffect(() => {
    if (currentAccount) {
      router.push('/claimnft');
      setWalletStatus('connected');
      setIsConnected('Yes');
      setFullAddress(currentAccount.address);
    } else {
      setWalletStatus('disconnected');
      setIsConnected('No');
      setFullAddress('Not connected');
    }
  }, [currentAccount, router]);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#C4F9FF] to-[#D1FFE3] font-dosis">
      <main className="text-center">
        <div className="mb-4">
          <Image
            src="/app_UX/logo_hydra.png"
            alt="Hydra Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-[#00A8C0] mb-2">Hydra</h1>
        <p className="text-2xl font-semibold text-[#FF7BA7] mb-6">START HERE</p>
        <div className="mb-8">
          <ConnectButton 
            className="bg-[#8FDDFF] text-white font-bold py-3 px-12 rounded-full text-lg shadow-md hover:bg-[#7DCBEE] transition duration-300"
            connectText="CONNECT WALLET"
            displayAccount={({ account }) => 
              account ? truncateAddress(account.address) : 'CONNECT WALLET'
            }
          />
        </div>
        <div className="mt-4 text-left">
          <p>Wallet status: {walletStatus}</p>
          <p>Connected: {isConnected}</p>
          <p>Wallet address: {fullAddress}</p>
        </div>
      </main>
    </div>
  );
}
