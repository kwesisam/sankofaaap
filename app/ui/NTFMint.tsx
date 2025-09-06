"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NFTService } from "@/lib/nft"
import { CheckCircle, Loader2, Sparkles, ExternalLink } from "lucide-react"

interface NFTMintingProgressProps {
  orderId: string
  productName: string
  artisanName: string
  artisanAddress: string
  buyerAddress: string
  onMintingComplete?: (nft: { tokenId: string; transactionHash: string }) => void
}

export function NFTMintingProgress({
  orderId,
  productName,
  artisanName,
  artisanAddress,
  buyerAddress,
  onMintingComplete,
}: NFTMintingProgressProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [nftData, setNftData] = useState<{ tokenId: string; transactionHash: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    { id: 1, title: "Generating Certificate", description: "Creating authenticity metadata" },
    { id: 2, title: "Uploading to IPFS", description: "Storing certificate data permanently" },
    { id: 3, title: "Minting NFT", description: "Creating your authenticity token" },
    { id: 4, title: "Complete", description: "Your NFT certificate is ready!" },
  ]

  useEffect(() => {
    const mintNFT = async () => {
      try {
        const nftService = new NFTService(null)

        // Step 1: Generate metadata
        setCurrentStep(1)
        setProgress(25)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Step 2: Upload to IPFS (simulated)
        setCurrentStep(2)
        setProgress(50)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Step 3: Mint NFT
        setCurrentStep(3)
        setProgress(75)
        const result = await nftService.mintAuthenticityNFT(
          buyerAddress,
          orderId,
          productName,
          artisanName,
          artisanAddress,
        )

        // Step 4: Complete
        setCurrentStep(4)
        setProgress(100)
        setNftData(result)
        setIsComplete(true)
        onMintingComplete?.(result)
      } catch (err: any) {
        setError(err.message || "Failed to mint NFT")
      }
    }

    mintNFT()
  }, [orderId, productName, artisanName, artisanAddress, buyerAddress, onMintingComplete])

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Minting Your NFT Certificate
        </CardTitle>
        <CardDescription>Creating your authenticity certificate as an NFT</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* <Progress value={progress} className="w-full" /> */}

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {step.id < currentStep ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : step.id === currentStep && !isComplete ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : step.id === currentStep && isComplete ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isComplete && nftData && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>Success!</strong> Your NFT certificate has been minted.
                </p>
                <div className="text-sm space-y-1">
                  <p>Token ID: #{nftData.tokenId}</p>
                  <p className="font-mono text-xs">Transaction: {nftData.transactionHash.slice(0, 20)}...</p>
                </div>
                <a
                  href={`https://etherscan.io/tx/${nftData.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  View on Etherscan <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">Certificate Details</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span>{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Artisan:</span>
              <span>{artisanName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order:</span>
              <span className="font-mono">{orderId}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
