
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
