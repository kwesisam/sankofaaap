"use client"
import { injected, WagmiProvider } from "wagmi";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { metaMask, safe, walletConnect } from "wagmi/connectors";

import { SessionProvider } from "next-auth/react";

const projectId = "fe09807b73369231a32fc97fb5761cbf";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [injected(), metaMask(), walletConnect({ projectId }), safe()],
});

const queryClient = new QueryClient();

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
