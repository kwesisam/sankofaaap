
import { Contract, Signer } from "ethers";

// Replace with your actual deployed contract address
export const CERTIFICATE_CONTRACT_ADDRESS =
  "0x2030483545A9a989e0c2b6907236E6a917fC98E4";

// Minimal ABI for interaction
const CERTIFICATE_ABI = [
  "function mintCertificate(address buyer, string craftId, string metadataURI) returns (uint256)",
  "function burnCertificate(uint256 tokenId)",
  "function certificate(uint256 tokenId) view returns (address artisan, string craftId, string metadataURI, uint64 issuedAt)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getCertificatesByArtisan(address artisan) view returns (uint256[])",
];

// Helper: get contract instance
function getContract(signer: Signer) {
  return new Contract(CERTIFICATE_CONTRACT_ADDRESS, CERTIFICATE_ABI, signer);
}

// Artisan mints certificate to buyer
// Mint certificate with correct nonce
export async function mintCertificate(
  signer: Signer,
  buyer: string,
  craftId: string,
  metadataURI: string
) {
  const contract = getContract(signer);
  const provider = signer.provider;

  if (!provider) throw new Error("No provider found on signer");

  // Fetch latest nonce from the network
  const nextNonce = await provider.getTransactionCount(
    await signer.getAddress(),
    "latest"
  );

  // Send transaction with correct nonce
  const tx = await contract.mintCertificate(buyer, craftId, metadataURI, {
    nonce: nextNonce,
  });

  const receipt = await tx.wait();
  return receipt.transactionHash;
}


// Verify certificate by tokenId
export async function getCertificate(signer: Signer, tokenId: number) {
  const contract = getContract(signer);
  const [artisan, craftId, metadataURI, issuedAt] = await contract.certificate(
    tokenId
  );
  const owner = await contract.ownerOf(tokenId);

  return {
    tokenId,
    owner,
    artisan,
    craftId,
    metadataURI,
    issuedAt: Number(issuedAt),
  };
}

// Buyer or anyone can verify ownership
export async function verifyOwnership(
  signer: Signer,
  tokenId: number,
  addressToCheck: string
) {
  const contract = getContract(signer);
  const owner = await contract.ownerOf(tokenId);
  return owner.toLowerCase() === addressToCheck.toLowerCase();
}

// Burn certificate (owner or admin)
export async function burnCertificate(signer: Signer, tokenId: number) {
  const contract = getContract(signer);
  const tx = await contract.burnCertificate(tokenId);
  const receipt = await tx.wait();
  return receipt.transactionHash;
}

// Get all certificate tokenIds by artisan
export async function getCertificatesByArtisan(
  signer: Signer,
  artisan: string
) {
  const contract = getContract(signer);
  const tokenIds: bigint[] = await contract.getCertificatesByArtisan(artisan);
  return tokenIds.map((id) => Number(id));
}
