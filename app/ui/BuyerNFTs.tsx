"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Send,
  Share2,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  Zap,
  Globe,
  RefreshCw,
  Download,
  Image as LuImage,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input as InputComponent } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAll, getSpecific } from "../provider/supabaseProvider";
import { useSession } from "next-auth/react";
import { ethers } from "ethers";
import contractJson from "../../lib/AuthenticityCertificate.json";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

// NFT Interface
interface NFT {
  id: string;
  name: string;
  description: string;
  artisanName: string;
  category: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  blockchain: "Ethereum" | "Polygon" | "Solana";
  tokenId: string;
  contractAddress: string;
  mintDate: string;
  currentValue: number;
  estimatedValue: number;
  isListed: boolean;
  listingPrice?: number;
  marketplaceLinks: {
    opensea?: string;
    rarible?: string;
    foundation?: string;
  };
  metadata: {
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
    image: string;
    animation_url?: string;
  };
}

// Mock NFT Data

export default function BuyerNFTsPage() {
  const CERTIFICATE_ABI = contractJson.abi;

  const [nfts] = useState<NFT[] | []>([]);
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [transferSheet, setTransferSheet] = useState<string | null>(null);
  const [transferAddress, setTransferAddress] = useState("");
  const [confirmTransfer, setConfirmTransfer] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { data: session } = useSession();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [nftLink, setNftLink] = useState<string | null>(null);

  // Filter and sort NFTs
  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask");
    const _provider = new ethers.BrowserProvider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const _signer = await _provider.getSigner();
    const contractAddress =
      process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS;

    if (!contractAddress) return alert("Contract address not set");
    const _contract = new ethers.Contract(
      contractAddress,
      CERTIFICATE_ABI,
      _signer
    );
    setProvider(_provider);
    setSigner(_signer);
    setContract(_contract);
  }

  useEffect(() => {
    connectWallet();
  }, []);

  async function viewCertificate(tokenId: string) {
    if (!contract) return alert("⚠️ Connect wallet first");

    try {
      // setLoading(true);
      // Ensure tokenId is converted to BigInt before calling contract
      const id = BigInt(tokenId);
      const data = await contract.certificate(id);

      if (!data) {
        toast({
          title: "Error",
          description: "Failed to fetch certificate. See console.",
          variant: "destructive",
        });
        return;
      }

      setNftLink(data[2]);

      // Convert BigInt fields to string for React rendering
      const safeData = {
        artisan: data.artisan,
        craftId: data.craftId,
        metadataURI: data.metadataURI,
        issuedAt: data.issuedAt.toString(), // bigint -> string
      };

      //setCertificateData(safeData);
    } catch (err) {
      console.log("View error:", err);
      alert("Failed to fetch certificate. See console.");
    } finally {
      //setLoading(false);
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;

      try {
        const getOrdersRes = await getSpecific("orders", {
          user_id: session.user.id,
        });

        const getProductsRes = await getAll("products");

        if (
          getOrdersRes.status === "success" &&
          Array.isArray(getOrdersRes.data) &&
          getProductsRes.status === "success" &&
          Array.isArray(getProductsRes.data)
        ) {
          // Filter orders that have a non-empty nft_token_id
          const products = getProductsRes.data;

          const nftOrders = getOrdersRes.data.filter(
            (order: any) =>
              order.nft_token_id !== null && order.nft_token_id !== ""
          );

          // Transform orders into NFT[] structure
          const nftList: NFT[] = nftOrders.map((order: any) => {
            const product = products.find(
              (p: any) => p.pid === order.product_id
            );

            return {
              id: order.oid,
              name: order.product_name || "Unnamed NFT",
              description: order.description || "",
              artisanName: order.artisan_name || "",
              category: order.category || "",
              rarity: order.rarity || "Common",
              blockchain: "Ethereum", // adjust if dynamic
              tokenId: order.nft_token_id,
              contractAddress: order.contract_address || "",
              mintDate: order.created_at || "",
              currentValue: parseInt(product.price) || 0,
              estimatedValue: parseInt(product.price) || 0,
              isListed: order.is_listed || false,
              listingPrice: order.listing_price,
              marketplaceLinks: order.marketplace_links || {},
              metadata: {
                attributes: order.metadata?.attributes || [],
                image: product.images[0] || "",
                animation_url: order.metadata?.animation_url,
              },
            };
          });

          setFilteredNFTs(nftList);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [session]);

  const filterAndSortNFTs = () => {
    let filtered = nfts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply rarity filter
    if (rarityFilter !== "all") {
      filtered = filtered.filter((nft) => nft.rarity === rarityFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((nft) => nft.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.mintDate).getTime() - new Date(a.mintDate).getTime()
          );
        case "date-asc":
          return (
            new Date(a.mintDate).getTime() - new Date(b.mintDate).getTime()
          );
        case "value-desc":
          return b.currentValue - a.currentValue;
        case "value-asc":
          return a.currentValue - b.currentValue;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredNFTs(filtered);
  };

  useEffect(() => {
    filterAndSortNFTs();
  }, [searchQuery, rarityFilter, categoryFilter, sortBy, nfts]);

  // Helper functions
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "Rare":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Epic":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Legendary":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain) {
      case "Ethereum":
        return "bg-indigo-100 text-indigo-700 border-indigo-300";
      case "Polygon":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Solana":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleTransferNFT = (nft: NFT, address: string) => {
    console.log(`Transferring ${nft.name} to ${address}`);
    // Implement transfer logic here
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-b from-amber-50 to-amber-100">
          <CardHeader className="rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  My NFT Collection ({filteredNFTs.length})
                </CardTitle>
                <CardDescription>
                  Manage your digital certificates and collectibles
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                >
                  {viewMode === "grid" ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <Grid3X3 className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Search NFTs</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, artisan, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rarity</Label>
                <Select
                  value={rarityFilter}
                  onValueChange={(value) => setRarityFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                    <SelectItem value="Legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Textiles">Textiles</SelectItem>
                    <SelectItem value="Pottery">Pottery</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                    <SelectItem value="Woodwork">Woodwork</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="value-desc">Highest Value</SelectItem>
                    <SelectItem value="value-asc">Lowest Value</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={filterAndSortNFTs} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFTs Display */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {filteredNFTs.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No NFTs Found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredNFTs.map((nft) => (
                    <Card
                      key={nft.id}
                      className="border hover:border-purple-200 transition-all duration-200 hover:shadow-lg"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="aspect-square rounded-lg flex items-center justify-center">
                            <Image
                              src={nft.metadata.image || ""}
                              alt={nft.name}
                              width={200}
                              height={200}
                              className="object-cover"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-lg leading-tight">
                                {nft.name}
                              </h3>
                              <Badge
                                className={`${getRarityColor(
                                  nft.rarity
                                )} border text-xs`}
                              >
                                {nft.rarity}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600">
                              by {nft.artisanName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Token ID: {nft.tokenId}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">
                                Current Value:
                              </span>
                              <span className="font-semibold text-green-600">
                                ₵{nft.currentValue.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Estimated:</span>
                              <span className="font-semibold text-blue-600">
                                ₵{nft.estimatedValue.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {nft.isListed && (
                            <Badge className="w-full justify-center bg-green-100 text-green-700 border-green-300">
                              <Zap className="h-3 w-3 mr-1" />
                              Listed for ₵{nft.listingPrice}
                            </Badge>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={async () => {
                                await viewCertificate(nft.tokenId);
                                setSelectedNFT(nft);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => setTransferSheet(nft.id)}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Transfer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-4">
                  {filteredNFTs.map((nft) => (
                    <Card
                      key={nft.id}
                      className="border hover:border-purple-200 transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 border rounded-lg  flex items-center justify-center">
                            <Image
                              src={nft.metadata.image || ""}
                              alt={nft.name}
                              width={100}
                              height={100}
                              className=""
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-lg truncate">
                                  {nft.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  by {nft.artisanName} • {nft.category}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Token ID: {nft.tokenId} • Minted{" "}
                                  {nft.mintDate}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <Badge
                                  className={`${getRarityColor(
                                    nft.rarity
                                  )} border`}
                                >
                                  {nft.rarity}
                                </Badge>
                                <Badge
                                  className={`${getBlockchainColor(
                                    nft.blockchain
                                  )} border`}
                                >
                                  {nft.blockchain}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">
                                    Current:{" "}
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    ₵{nft.currentValue.toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Est: </span>
                                  <span className="font-semibold text-blue-600">
                                    ₵{nft.estimatedValue.toFixed(2)}
                                  </span>
                                </div>
                                {nft.isListed && (
                                  <Badge className="bg-green-100 text-green-700 border-green-300">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Listed ₵{nft.listingPrice}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedNFT(nft)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setTransferSheet(nft.id)}
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Transfer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* NFT Details Sheet */}
        <Sheet
          open={!!selectedNFT}
          onOpenChange={(open) => !open && setSelectedNFT(null)}
        >
          <SheetContent className="w-full sm:max-w-lg">
            {selectedNFT && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedNFT.name}</SheetTitle>
                  <SheetDescription>
                    Digital certificate by {selectedNFT.artisanName}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                  <div className="aspect-square rounded-lg  flex items-center justify-center">
                    <Image
                      src={selectedNFT.metadata.image || ""}
                      alt={selectedNFT.name}
                      width={400}
                      height={400}
                      className=""
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-gray-600">
                        {selectedNFT.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Token ID</h4>
                        <p className="text-sm text-gray-600">
                          {selectedNFT.tokenId}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Blockchain</h4>
                        <Badge
                          className={`${getBlockchainColor(
                            selectedNFT.blockchain
                          )} border`}
                        >
                          {selectedNFT.blockchain}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Certificate Link</h4>
                      <div className="flex items-center gap-2">
                          {nftLink != "" && <Link href={nftLink || ""}>View Certificate</Link>}
                      
                        {/* <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleCopyAddress(selectedNFT.contractAddress)
                          }
                        >
                          {copiedAddress === selectedNFT.contractAddress ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* <SheetFooter>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button onClick={() => setTransferSheet(selectedNFT.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Transfer NFT
                  </Button>
                </SheetFooter> */}
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Transfer NFT Sheet */}
        <Sheet
          open={!!transferSheet}
          onOpenChange={(open) => !open && setTransferSheet(null)}
        >
          <SheetContent>
            {transferSheet && (
              <>
                <SheetHeader>
                  <SheetTitle>Transfer NFT</SheetTitle>
                  <SheetDescription>
                    Transfer this NFT to another wallet address.
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">
                      Important
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Double-check the recipient address. This action cannot be
                      undone.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="transfer-address">
                      Recipient Wallet Address
                    </Label>
                    <Input
                      id="transfer-address"
                      placeholder="0x..."
                      value={transferAddress}
                      onChange={(e) => setTransferAddress(e.target.value)}
                    />
                  </div>
                </div>

                <SheetFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTransferSheet(null);
                      setTransferAddress("");
                    }}
                  >
                    Cancel
                  </Button>
                  {confirmTransfer === transferSheet ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Confirm transfer to:{" "}
                        <code className="bg-gray-100 px-1 rounded text-xs">
                          {transferAddress}
                        </code>
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmTransfer(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            const nft = filteredNFTs.find(
                              (n) => n.id === transferSheet
                            );
                            if (nft) {
                              handleTransferNFT(nft, transferAddress);
                              setConfirmTransfer(null);
                              setTransferSheet(null);
                              setTransferAddress("");
                            }
                          }}
                        >
                          Yes, Transfer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      disabled={!transferAddress || transferAddress.length < 10}
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => setConfirmTransfer(transferSheet)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Transfer NFT
                    </Button>
                  )}
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
