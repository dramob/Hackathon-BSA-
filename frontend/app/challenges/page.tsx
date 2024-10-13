'use client';

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Challenges() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();

  useEffect(() => {
    if (!currentAccount) {
      router.push('/');
    }
  }, [currentAccount, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#C4F9FF] to-[#D1FFE3] font-dosis relative">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex space-x-4 mb-4">
          <Link href="/profile" className="bg-[#8FDDFF] text-white font-bold py-2 px-6 rounded-full">PROFILE</Link>
          <Link href="/actions" className="bg-[#8FDDFF] text-white font-bold py-2 px-6 rounded-full">ACTIONS</Link>
          <Link href="/challenges" className="bg-[#FFE9A0] text-[#FF7BA7] font-bold py-2 px-6 rounded-full">CHALLENGES</Link>
        </div>
        <div className="bg-[#5EBAE7] p-8 rounded-3xl shadow-lg text-center max-w-sm w-full">
          <h2 className="text-white text-2xl font-bold mb-4">Challenges</h2>
          <p className="text-white">This is where users can view and participate in eco-challenges.</p>
        </div>
      </div>
    </div>
  );
}
