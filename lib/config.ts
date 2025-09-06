
  // Environment Configuration
  // Environment Configuration
  export const config = {
    // Database
    database: {
      url: process.env.DATABASE_URL || "file:./dev.db",
    },

    // NextAuth
    auth: {
      secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
      url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    },

    // Ethereum Configuration
    ethereum: {
      network: process.env.NEXT_PUBLIC_ETHEREUM_NETWORK || "sepolia",
      escrowContractAddress:
        process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS ||
        "0x50bA12644d8E69c28a8694Bf46EeE5F1a47D3eF1",
      rpcUrl:
        process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL ||
        "https://ethereum-sepolia-rpc.publicnode.com", // ✅ fixed
    },

    // Private Keys (for testing - keep secure in production)
    keys: {
      sepoliaPrivateKey:
        process.env.SEPOLIA_PRIVATE_KEY ||
        "1d45957846bffa2d56a254094bb9c5c5ccdb3ef9df97a97f20af7b28ab6327c0",
    },

    // Contract Addresses
    contracts: {
      escrow:
        process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS ||
        "0x50bA12644d8E69c28a8694Bf46EeE5F1a47D3eF1",
      nft:
        process.env.NEXT_PUBLIC_SANKOFA_NFT_ADDRESS ||
        "0x0000000000000000000000000000000000000000",
    },

    // Network Configuration
    networks: {
      sepolia: {
        chainId: 11155111,
        name: "sepolia",
        rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com", // ✅ fixed
      },
      mainnet: {
        chainId: 1,
        name: "mainnet",
        rpcUrl: "https://ethereum.publicnode.com", // ✅ also updated
      },
    },
  } as const;

  // Type for the config
  export type Config = typeof config;

  // Helper function to get network config
  export function getNetworkConfig(networkName: string = "sepolia") {
    return config.networks[networkName as keyof typeof config.networks] || config.networks.sepolia;
  }

  // Helper function to get contract address
  export function getContractAddress(contractName: keyof typeof config.contracts) {
    return config.contracts[contractName];
  }

  // Helper function to get RPC URL
  export function getRpcUrl(networkName: string = "sepolia") {
    return getNetworkConfig(networkName).rpcUrl;
  }
