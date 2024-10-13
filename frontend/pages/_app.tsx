import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { Dosis } from 'next/font/google';
import '@mysten/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';
import '../styles/globals.css';

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const dosis = Dosis({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Theme appearance="dark">
      <main className={dosis.className}>
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
            <WalletProvider autoConnect>
              <Component {...pageProps} />
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </main>
    </Theme>
  );
}
