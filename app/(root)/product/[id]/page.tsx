"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Truck,
  Shield,
  ExternalLink,
  User,
  Package,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import CheckoutButton from "@/components/checkout-button";
import { useEffect, useState } from "react";
import { getAll, getSpecific } from "@/app/provider/supabaseProvider";
import { useSession } from "next-auth/react";

interface ProductAttribute {
  name: string;
  value: string;
}

interface Artisan {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
  
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  artisan: Artisan;
  attributes: ProductAttribute[];
  hasNFT: boolean;
  nftAddress: string;
  inStock: boolean;
  stock: number;
  wallet_address: string
}

// Loading State Component
const LoadingState = () => (
  <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Product
          </h3>
          <p className="text-gray-500 text-center">
            Fetching product details...
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Product Not Found State
const ProductNotFoundState = ({
  productId,
  onRetry,
}: {
  productId: string;
  onRetry: () => void;
}) => (
  <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
          <Package className="w-16 h-16 text-gray-400" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-700 mb-4">
        Product Not Found
      </h1>
      <p className="text-gray-500 text-center max-w-md mb-2">
        Sorry, we couldn't find the product you're looking for.
      </p>
      <p className="text-sm text-gray-400 mb-8">Product ID: {productId}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Products
        </Link>
        <button
          onClick={onRetry}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-700 mb-4">
        Something Went Wrong
      </h1>
      <p className="text-gray-500 text-center max-w-md mb-2">
        We encountered an error while loading this product.
      </p>
      <p className="text-sm text-gray-400 mb-8">{error}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/marketplace"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Products
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  </div>
);

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const productDataRes: any = await getSpecific("products", {
        pid: params.id,
      });
      const artisanDataRes = await getAll("artisan");

      if (
        productDataRes.status === "success" &&
        artisanDataRes.status === "success"
      ) {
        const rawProduct = productDataRes?.data?.[0] ?? null;
        const rawArtisans = artisanDataRes.data;

        console.log(rawArtisans, rawProduct);

        if (rawProduct && Array.isArray(rawArtisans)) {
          const matchingArtisan: any = rawArtisans.find(
            (artisan: any) => artisan.business_id === rawProduct.business_id
          );

          console.log(rawProduct.material);
          const transformedProduct: Product = {
            id: rawProduct.pid,
            title: rawProduct.name || "Untitled",
            description: rawProduct.description || "",
            price: rawProduct.price || 0,
            currency: rawProduct.currency || "USD",
            images: rawProduct.images || [],
            wallet_address: matchingArtisan?.walllet_address || "",
            artisan: {
              id: matchingArtisan?.business_id || "unknown",
              name: matchingArtisan?.business_name || "Unknown Artisan",
              avatar: matchingArtisan?.business_image || null,
              rating: 4.5,
            },
            attributes: [
              {
                name: "Category",
                value: rawProduct.category || "",
              },
              {
                name: "Material",
                value: rawProduct.materials[0] || "",
              },
              {
                name: "Weight",
                value: rawProduct.weight || "",
              },
              {
                name: "Experience",
                value: matchingArtisan?.experience_years || "",
              },
              {
                name: "Craft Time",
                value: rawProduct.crafting_time || "",
              },
              {
                name: "Origin",
                value: matchingArtisan?.country || "",
              },
            ],
            hasNFT: rawProduct.nft_verified || false,
            nftAddress: rawProduct.nft_address || "0x68i68",
            inStock: rawProduct.stock > 0 || false,
            stock: rawProduct.stock || 0,
          };

          console.log(transformedProduct);
          setProduct(transformedProduct);
        } else {
          console.warn("Product not found for ID:", params.id);
          setProduct(null);
        }
      } else {
        throw new Error("Failed to fetch product data");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

    useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch("/api/escrow/status?escrowId=samescrow1");
      console.log(2222)
      const data = await res.json();
      console.log(data);
    };

    checkStatus();
  }, []);

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={fetchProduct} />;
  }

  // Show product not found state
  if (!product) {
    return (
      <ProductNotFoundState productId={params.id} onRetry={fetchProduct} />
    );
  }

  // Show product details
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {product.images.length > 0 && (
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.title}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg border"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} - View ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/artisan/${product.artisan.id}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600"
              >
                <div className="relative h-6 w-6 rounded-full overflow-hidden">
                  {product.artisan.avatar ? (
                    <Image
                      src={product.artisan.avatar || "/placeholder.svg"}
                      alt={product.artisan.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {product.artisan.name}
              </Link>
            </div>

            <h1 className="text-3xl font-bold">{product.title}</h1>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-2xl font-bold">
                {product.currency} {product.price.toFixed(2)}
              </span>
              {product.inStock ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  In Stock
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {product.hasNFT && (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-amber-100 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">
                    Blockchain Verified Authenticity
                  </h3>
                  <p className="text-sm text-gray-600">
                    This item includes a digital certificate of authenticity as
                    an NFT
                  </p>
                  <Link
                    href={`https://etherscan.io/address/${product.nftAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 text-amber-600 hover:underline mt-1"
                  >
                    <ExternalLink className="h-3 w-3" /> View on blockchain
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {(!session || session.user.id !== product.artisan.id) && (
              <CheckoutButton product={product} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-600" />
                <span>Global Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <span>Direct from Artisan</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-gray-700 mt-4">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <div className="space-y-2">
                {product.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 border-b border-gray-100 py-2"
                  >
                    <span className="font-medium">{attr.name}</span>
                    <span>{attr.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="text-gray-700 mt-4">
              <p>
                Shipping information will be calculated at checkout based on
                your location.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
