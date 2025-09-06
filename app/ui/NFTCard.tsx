"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { type NFT, formatTokenId } from "@/lib/nft"
import { ExternalLink, Eye, Share2, Download } from "lucide-react"

interface NFTCardProps {
  nft: NFT
  showDetails?: boolean
  className?: string
}

export function NFTCard({ nft, showDetails = true, className }: NFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: nft.name,
          text: nft.description,
          url: nft.openseaUrl || window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(nft.openseaUrl || window.location.href)
    }
  }

  const handleDownload = () => {
    // In real implementation, this would download the high-res certificate
    const link = document.createElement("a")
    link.href = nft.image
    link.download = `${nft.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`
    link.click()
  }

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="aspect-square bg-muted relative overflow-hidden">
        <img
          src={nft.image || "/placeholder.svg"}
          alt={nft.name}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-muted-foreground/20 rounded-lg h-16 w-16" />
          </div>
        )}

        {/* NFT Badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary/90 text-primary-foreground">{formatTokenId(nft.tokenId)}</Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button variant="secondary" size="sm" onClick={handleShare} className="h-8 w-8 p-0">
            <Share2 className="h-3 w-3" />
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload} className="h-8 w-8 p-0">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2">{nft.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{nft.description}</p>
          </div>

          {showDetails && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Artisan:</span>
                <span className="font-medium">{nft.metadata.properties.artisanName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Minted:</span>
                <span>{new Date(nft.mintedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="mr-1 h-3 w-3" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{nft.name}</DialogTitle>
                  <DialogDescription>Authenticity Certificate Details</DialogDescription>
                </DialogHeader>
                <NFTDetailsView nft={nft} />
              </DialogContent>
            </Dialog>

            {nft.openseaUrl && (
              <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                <a href={nft.openseaUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  OpenSea
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// NFT Details View Component
function NFTDetailsView({ nft }: { nft: NFT }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Certificate Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token ID:</span>
                <span className="font-mono">{formatTokenId(nft.tokenId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract:</span>
                <span className="font-mono text-xs">{nft.contractAddress.slice(0, 10)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono">{nft.metadata.properties.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchase Date:</span>
                <span>{nft.metadata.properties.purchaseDate}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Artisan Information</h3>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/artisan-craftsman.png" />
                <AvatarFallback>{nft.metadata.properties.artisanName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{nft.metadata.properties.artisanName}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {nft.metadata.properties.artisanAddress.slice(0, 10)}...
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Attributes</h3>
            <div className="grid grid-cols-2 gap-2">
              {nft.metadata.attributes.map((attr, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                  <p className="text-sm font-medium">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {nft.openseaUrl && (
          <Button asChild className="flex-1">
            <a href={nft.openseaUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View on OpenSea
            </a>
          </Button>
        )}
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(nft.contractAddress)}>
          Copy Contract
        </Button>
      </div>
    </div>
  )
}
