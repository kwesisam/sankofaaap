"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { NFT } from "@/lib/nft"
import { Search, Grid, List } from "lucide-react"
import { NFTCard } from "./NFTCard"

interface NFTCollectionProps {
  nfts: NFT[]
  title?: string
  description?: string
  showFilters?: boolean
}

export function NFTCollection({ nfts, title = "NFT Collection", description, showFilters = true }: NFTCollectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAndSortedNFTs = nfts
    .filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.metadata.properties.artisanName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter =
        filterBy === "all" ||
        nft.metadata.attributes.some(
          (attr) =>
            attr.trait_type === "Product Type" && attr.value.toString().toLowerCase().includes(filterBy.toLowerCase()),
        )

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime()
        case "oldest":
          return new Date(a.mintedAt).getTime() - new Date(b.mintedAt).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="art">Art & Crafts</SelectItem>
                  <SelectItem value="home">Home Decor</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredAndSortedNFTs.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No NFTs Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterBy !== "all"
                  ? "Try adjusting your search or filters"
                  : "You don't have any NFT certificates yet"}
              </p>
            </div>
          ) : (
            <div
              className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}
            >
              {filteredAndSortedNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  showDetails={viewMode === "grid"}
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
