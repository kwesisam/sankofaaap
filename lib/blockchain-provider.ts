import { JsonRpcProvider, Wallet, formatEther } from "ethers";

interface ProviderConfig {
  url: string;
  timeout: number;
  retries: number;
}

const RPC_CONFIGS: ProviderConfig[] = [
  {
    url: "https://eth-sepolia.g.alchemy.com/v2/L_dm72EyQrIunbN3zhuPE",
    timeout: 15000,
    retries: 3,
  },
  {
    url: "https://ethereum-sepolia-rpc.publicnode.com",
    timeout: 30000,
    retries: 2,
  },
];

const NETWORK_CONFIG = {
  chainId: 11155111,
  name: "sepolia",
  ensAddress: null,
};

export class BlockchainProvider {
  private static instance: JsonRpcProvider | null = null;

  static async getProvider(): Promise<JsonRpcProvider> {
    if (this.instance) {
      try {
        // Health check
        await this.instance.getBlockNumber();
        return this.instance;
      } catch {
        this.instance = null;
      }
    }

    this.instance = await this.createRobustProvider();
    return this.instance;
  }

  private static async createRobustProvider(): Promise<JsonRpcProvider> {
    const errors: string[] = [];

    for (const config of RPC_CONFIGS) {
      for (let attempt = 1; attempt <= config.retries; attempt++) {
        try {
          const provider = new JsonRpcProvider(config.url, NETWORK_CONFIG as any);

          const blockNumber = await provider.getBlockNumber();

          console.log(
            `Connected to Sepolia - Block: ${blockNumber}, ChainId: ${NETWORK_CONFIG.chainId}`
          );
          return provider;
        } catch (error: any) {
          const errorMsg = `${config.url} (attempt ${attempt}/${config.retries}): ${error.message}`;
          errors.push(errorMsg);
          console.warn(errorMsg);

          if (attempt < config.retries) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
    }

    throw new Error(`All RPC connections failed:\n${errors.join("\n")}`);
  }

  static async createSigner(privateKey: string): Promise<Wallet> {
    const provider = await this.getProvider();
    const signer = new Wallet(privateKey, provider);

    const address = signer.address;
    const balance = await provider.getBalance(address);

    console.log(`Signer ready: ${address} (${formatEther(balance)} ETH)`);
    return signer;
  }
}
