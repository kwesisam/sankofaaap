
// NFT utilities and types
export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: NFTAttribute[]
  properties: {
    orderId: string
    productName: string
    artisanName: string
    artisanAddress: string
    purchaseDate: string
    authenticity: string
  }
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: "number" | "boost_number" | "boost_percentage" | "date"
}

export interface NFT {
  id: string
  tokenId: string
  contractAddress: string
  name: string
  description: string
  image: string
  metadata: NFTMetadata
  owner: string
  mintedAt: string
  transactionHash: string
  openseaUrl?: string
}

// Mock NFT contract details
export const NFT_CONTRACT_ADDRESS = "0x9876543210987654321098765432109876543210"
export const NFT_CONTRACT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI", type: "string" },
    ],
    name: "mintCertificate",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
]

export class NFTService {
  private contract: any
  private web3: any

  constructor(web3Provider: any) {
    this.web3 = web3Provider
    // In real implementation, initialize contract with web3
    this.contract = null
  }

  async mintAuthenticityNFT(
    buyerAddress: string,
    orderId: string,
    productName: string,
    artisanName: string,
    artisanAddress: string,
  ): Promise<{ tokenId: string; transactionHash: string }> {
    try {
      // Generate NFT metadata
      const metadata = this.generateNFTMetadata(orderId, productName, artisanName, artisanAddress)

      // In real implementation, upload metadata to IPFS
      const metadataURI = `ipfs://QmExample${orderId}`

      console.log("Minting NFT for order:", orderId)
      console.log("Metadata:", metadata)

      // Simulate minting transaction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const tokenId = Math.floor(Math.random() * 10000).toString()
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`

      return { tokenId, transactionHash }
    } catch (error) {
      console.error("Error minting NFT:", error)
      throw new Error("Failed to mint authenticity NFT")
    }
  }

  generateNFTMetadata(orderId: string, productName: string, artisanName: string, artisanAddress: string): NFTMetadata {
    const currentDate = new Date().toISOString().split("T")[0]

    return {
      name: `${productName} - Authenticity Certificate`,
      description: `This NFT serves as an authenticity certificate for "${productName}" created by ${artisanName}. It verifies the genuine nature and provenance of this African artisan product purchased through AfriMarket's secure escrow system.`,
      image: `https://afrimarket.com/nft-certificates/${orderId}.png`,
      external_url: `https://afrimarket.com/orders/${orderId}`,
      attributes: [
        {
          trait_type: "Product Type",
          value: this.getProductCategory(productName),
        },
        {
          trait_type: "Artisan",
          value: artisanName,
        },
        {
          trait_type: "Origin",
          value: "Africa",
        },
        {
          trait_type: "Purchase Date",
          value: currentDate,
          display_type: "date",
        },
        {
          trait_type: "Authenticity Score",
          value: 100,
          display_type: "number",
        },
        {
          trait_type: "Marketplace",
          value: "AfriMarket",
        },
      ],
      properties: {
        orderId,
        productName,
        artisanName,
        artisanAddress,
        purchaseDate: currentDate,
        authenticity: "Verified Authentic",
      },
    }
  }

  private getProductCategory(productName: string): string {
    const name = productName.toLowerCase()
    if (name.includes("kente") || name.includes("cloth") || name.includes("textile")) return "Textiles"
    if (name.includes("jewelry") || name.includes("beaded") || name.includes("necklace")) return "Jewelry"
    if (name.includes("mask") || name.includes("carved") || name.includes("sculpture")) return "Art & Crafts"
    if (name.includes("basket") || name.includes("pottery") || name.includes("home")) return "Home Decor"
    return "Handcrafted Goods"
  }

  getOpenSeaUrl(contractAddress: string, tokenId: string): string {
    return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`
  }

  getRaribleUrl(contractAddress: string, tokenId: string): string {
    return `https://rarible.com/token/${contractAddress}:${tokenId}`
  }
}

export const formatTokenId = (tokenId: string): string => {
  return `#${tokenId.padStart(4, "0")}`
}

export const generateNFTImage = (productName: string, artisanName: string, orderId: string): string => {
  // In real implementation, this would generate or retrieve the actual NFT certificate image
  return `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(`${productName} authenticity certificate by ${artisanName}`)}`
}
