import { Contract, Signer, keccak256, toUtf8Bytes, parseEther } from "ethers";

const ESCROW_ABI = [
  "function createEscrow(bytes32 escrowId, address seller) payable",
  "function confirmDelivery(bytes32 escrowId)",
  "function getEscrow(bytes32 escrowId) view returns (address buyer, address seller, uint256 amount, uint8 status)",
];

export const ESCROW_ADDRESS = "0xdAcbB7f3dEb110389C46ff74E41d70b550AF0573";

// Hash utility
export function hashEscrowId(escrowId: string) {
  return keccak256(toUtf8Bytes(escrowId.trim()));
}

// Create escrow
export async function createEscrow(
  signer: Signer,
  escrowId: string,
  seller: string,
  amountEth: string
) {
  const contract = new Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);
  const tx = await contract.createEscrow(hashEscrowId(escrowId), seller, {
    value: parseEther(amountEth),
  });
  const receipt = await tx.wait();
  return receipt.transactionHash;
}

// Confirm delivery
export async function confirmDelivery(signer: Signer, escrowId: string) {
  const contract = new Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);
  const tx = await contract.confirmDelivery(hashEscrowId(escrowId));
  const receipt = await tx.wait();
  return receipt.transactionHash;
}

// Get escrow
export async function getEscrow(signer: Signer, escrowId: string) {
  const contract = new Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);
  const [buyer, seller, amount, status] = await contract.getEscrow(
    hashEscrowId(escrowId)
  );
  return { buyer, seller, amount: amount.toString(), status };
}


// import { ethers, Contract, Provider, Signer, ZeroAddress, keccak256, toUtf8Bytes } from "ethers";
// import { BlockchainProvider } from "./blockchain-provider";
// import { config } from "./config";

// // --- ABIs ---
// const SANKOFA_NFT_ABI = [
//   "function mint(address to, string memory tokenURI) public returns (uint256)",
//   "function tokenURI(uint256 tokenId) public view returns (string memory)",
//   "function ownerOf(uint256 tokenId) public view returns (address)",
// ];

// const ESCROW_ABI = [
//   { anonymous: false, inputs: [{ indexed: true, internalType: "bytes32", name: "escrowId", type: "bytes32" }], name: "DeliveryConfirmed", type: "event" },
//   { anonymous: false, inputs: [{ indexed: true, internalType: "bytes32", name: "escrowId", type: "bytes32" }], name: "EscrowCompleted", type: "event" },
//   { anonymous: false, inputs: [
//       { indexed: true, internalType: "bytes32", name: "escrowId", type: "bytes32" },
//       { indexed: false, internalType: "address", name: "buyer", type: "address" },
//       { indexed: false, internalType: "address", name: "seller", type: "address" },
//       { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
//     ], name: "EscrowCreated", type: "event" },
//   { inputs: [{ internalType: "bytes32", name: "escrowId", type: "bytes32" }], name: "confirmDelivery", outputs: [], stateMutability: "nonpayable", type: "function" },
//   { inputs: [
//       { internalType: "bytes32", name: "escrowId", type: "bytes32" },
//       { internalType: "address", name: "seller", type: "address" },
//       { internalType: "uint256", name: "amount", type: "uint256" },
//     ], name: "createEscrow", outputs: [], stateMutability: "payable", type: "function" },
//   { inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], name: "escrows", outputs: [
//       { internalType: "address", name: "buyer", type: "address" },
//       { internalType: "address", name: "seller", type: "address" },
//       { internalType: "uint256", name: "amount", type: "uint256" },
//       { internalType: "uint8", name: "status", type: "uint8" },
//     ], stateMutability: "view", type: "function" },
//   { inputs: [{ internalType: "bytes32", name: "escrowId", type: "bytes32" }], name: "getEscrowStatus", outputs: [{ internalType: "uint8", name: "", type: "uint8" }], stateMutability: "view", type: "function" },
// ];

// const SANKOFA_NFT_ADDRESS = config.contracts.nft;
// const ESCROW_ADDRESS = config.contracts.escrow;

// // --- Provider helper ---
// async function createProvider(): Promise<Provider> {
//   return await BlockchainProvider.getProvider();
// }

// // --- Contract factories ---
// export async function getSankofaNFTContract(signer?: Signer): Promise<Contract> {
//   const provider = signer?.provider || (await createProvider());
//   return new Contract(SANKOFA_NFT_ADDRESS, SANKOFA_NFT_ABI, signer || provider);
// }

// export async function getEscrowContract(signer?: Signer): Promise<Contract> {
//   const provider = signer?.provider || (await createProvider());
//   return new Contract(ESCROW_ADDRESS, ESCROW_ABI, signer || provider);
// }

// // --- Types ---
// export enum EscrowStatus {
//   NOT_CREATED = 0,
//   FUNDED = 1,
//   DELIVERED = 2,
// }

// export interface EscrowData {
//   buyer: string;
//   seller: string;
//   amount: bigint;
//   status: EscrowStatus;
// }

// // --- Utilities ---
// export function generateEscrowIdHash(escrowId: string): string {
//   return keccak256(toUtf8Bytes(escrowId.trim()));
// }

// // --- Escrow helpers ---
// export async function createEscrow(
//   signer: Signer,
//   escrowId: string,
//   sellerAddress: string,
//   amountWei: bigint
// ): Promise<string> {
//   if (!ethers.isAddress(sellerAddress) || sellerAddress === ethers.ZeroAddress) {
//     throw new Error("Invalid seller address");
//   }

//   const escrowHash = generateEscrowIdHash(escrowId);
//   const buyerAddress = await signer.getAddress();
//   console.log("[Escrow] Creating escrow:", { escrowId, escrowHash, buyerAddress, sellerAddress, amountWei: amountWei.toString() });

//   const contract = await getEscrowContract(signer);

//   try {
//     const tx = await contract.createEscrow(escrowHash, sellerAddress, amountWei, { value: amountWei });
//     const receipt = await tx.wait();
//     console.log("[Escrow] Escrow created, txHash:", receipt.transactionHash, "status:", receipt.status);
//     return receipt.transactionHash;
//   } catch (error: any) {
//     console.error("[Escrow] createEscrow failed:", error?.reason || error.message || error);
//     throw error;
//   }
// }

// export async function confirmDelivery(signer: Signer, escrowId: string): Promise<string> {
//   const escrowHash = generateEscrowIdHash(escrowId);
//   const buyerAddress = await signer.getAddress();
//   console.log("[Escrow] Confirming delivery:", { escrowId, escrowHash, buyerAddress });

//   const contract = await getEscrowContract(signer);

//   try {
//     const escrow: any = await contract.escrows(escrowHash);

//     if (!escrow || !escrow.buyer || escrow.buyer === ethers.ZeroAddress) {
//       throw new Error("Escrow does not exist");
//     }

//     if (escrow.buyer.toLowerCase() !== buyerAddress.toLowerCase()) {
//       throw new Error("Only the original buyer can confirm delivery");
//     }

//     const status: number = escrow.status;
//     if (status !== EscrowStatus.FUNDED) {
//       throw new Error("Escrow is not funded yet");
//     }

//     const tx = await contract.confirmDelivery(escrowHash);
//     const receipt = await tx.wait();
//     console.log("[Escrow] Delivery confirmed, txHash:", receipt.transactionHash, "status:", receipt.status);
//     return receipt.transactionHash;
//   } catch (error: any) {
//     console.error("[Escrow] confirmDelivery failed:", error?.reason || error.message || error);
//     throw error;
//   }
// }

// export async function getEscrowDetails(escrowId: string): Promise<EscrowData | null> {
//   const contract = await getEscrowContract();
//   const escrowHash = generateEscrowIdHash(escrowId);

//   try {
//     const escrow: any = await contract.escrows(escrowHash);
//     if (!escrow || !escrow.buyer || escrow.buyer === ethers.ZeroAddress) return null;

//     return {
//       buyer: escrow.buyer,
//       seller: escrow.seller,
//       amount: BigInt(escrow.amount.toString()),
//       status: escrow.status as EscrowStatus,
//     };
//   } catch (error) {
//     console.error("[Escrow] getEscrowDetails failed:", error);
//     return null;
//   }
// }

// export async function getEscrowStatus(escrowId: string): Promise<EscrowStatus | { error: string }> {
//   const contract = await getEscrowContract();
//   const escrowHash = generateEscrowIdHash(escrowId);

//   try {
//     const escrowData: any = await contract.escrows(escrowHash);

//     if (!escrowData || !escrowData.buyer || escrowData.buyer === ethers.ZeroAddress) {
//       return { error: "Escrow not found" };
//     }

//     // Convert numeric status to enum
//     const status: number = escrowData.status;
//     if (status === EscrowStatus.NOT_CREATED) return EscrowStatus.NOT_CREATED;
//     if (status === EscrowStatus.FUNDED) return EscrowStatus.FUNDED;
//     if (status === EscrowStatus.DELIVERED) return EscrowStatus.DELIVERED;

//     return { error: "Unknown escrow status" };
//   } catch (error: any) {
//     console.error("[Escrow] getEscrowStatus failed:", error);
//     return { error: error.message || "Unknown error" };
//   }
// }
