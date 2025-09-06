"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Package, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getAll } from "@/app/provider/supabaseProvider";

interface Product {
  business_id: string;
  id: string;
  nft_verified: boolean;
  images: string[];
  name: string;
  price: number;
  artisan_name?: string;
}

// Loading Component with rotating image
const LoadingState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20">
    <div className="relative mb-4">
      <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Package className="w-6 h-6 text-amber-600" />
      </div>
    </div>
    <h3 className="text-lg font-medium text-gray-700 mb-2">Loading Products</h3>
    <p className="text-sm text-gray-500">
      Discovering amazing handcrafted items...
    </p>
  </div>
);

// Empty State Component
const EmptyState = ({ artisanId }: { artisanId?: string }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20">
    <div className="relative mb-6">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
        <Package className="w-12 h-12 text-gray-400" />
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      {artisanId ? "No Products Found" : "No Products Available"}
    </h3>
    <p className="text-gray-500 text-center max-w-md mb-6">
      {artisanId
        ? "This artisan hasn't added any products yet. Check back later for new items!"
        : "We're working on adding beautiful handcrafted products. Please check back soon!"}
    </p>
    <div className="flex gap-3">
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>
      {!artisanId && (
        <Link
          href="/artisans"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Browse Artisans
        </Link>
      )}
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20">
    <div className="relative mb-6">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      Unable to Load Products
    </h3>
    <p className="text-gray-500 text-center max-w-md mb-6">
      We're having trouble connecting to our servers. Please check your internet
      connection and try again.
    </p>
    <div className="flex gap-3">
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

interface FilterProps {
  categories?: string[];
  priceRange?: [number, number];
  origins?: string[];
  nftVerified?: boolean;
  artisanVerified?: boolean;
}

export default function ProductGrid({
  artisanId,
  filters,
}: {
  artisanId?: string;
  filters?: FilterProps;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Filters:", filters);
  console.log("Products:", products);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productDataRes: any = await getAll("products");
      const artisanDataRes = await getAll("artisan");

      if (
        productDataRes.status === "success" &&
        artisanDataRes.status === "success"
      ) {
        const rawProducts = productDataRes.data;
        const rawArtisans = artisanDataRes.data;

        console.log(rawProducts?.length, rawArtisans?.length);

        if (Array.isArray(rawProducts) && Array.isArray(rawArtisans)) {
          const transformedProducts: Product[] = rawProducts.map(
            (item: any) => {
              const matchingArtisan = rawArtisans.find(
                (artisan: any) => artisan.business_id === item.business_id
              );

              return {
                business_id: item.business_id || "",
                id: item.pid,
                nft_verified: item.nft_verified || false,
                images: item.images || [],
                name: item.name,
                price: item.price || 0,
                artisan_name: matchingArtisan?.business_name || "Unknown",
              };
            }
          );

          console.log(transformedProducts?.length);
          console.log(transformedProducts);

          setProducts(transformedProducts);

          let filtered = [...transformedProducts];

          // Only apply artisan filter if artisanId is *really* provided
          if (artisanId && artisanId.trim() !== "") {
            filtered = filtered.filter((p) => p.business_id === artisanId);
          }
          console.log("filtered");

          console.log(filtered.length);
          console.log(filtered);

          setFilteredProducts(filtered);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [artisanId]);

  // Apply filters whenever products or filters change
  useEffect(() => {
    if (!filters) {
      // If no filters provided, just apply artisan filter
      let filtered = products;
      if (artisanId) {
        filtered = filtered.filter(
          (product) => product.business_id === artisanId
        );
      }
      setFilteredProducts(filtered);
      return;
    }

    let filtered = [...products];

    // Filter by artisan if specified
    if (artisanId) {
      filtered = filtered.filter(
        (product) => product.business_id === artisanId
      );

      
    }

    // Apply category filters
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories!.some(
          (category) =>
            product.name.toLowerCase().includes(category) ||
            // Add more sophisticated category matching here based on your product schema
            (category === "textiles" &&
              (product.name.toLowerCase().includes("cloth") ||
                product.name.toLowerCase().includes("fabric"))) ||
            (category === "jewelry" &&
              (product.name.toLowerCase().includes("jewelry") ||
                product.name.toLowerCase().includes("necklace") ||
                product.name.toLowerCase().includes("bracelet"))) ||
            (category === "art" &&
              (product.name.toLowerCase().includes("art") ||
                product.name.toLowerCase().includes("painting"))) ||
            (category === "home" &&
              (product.name.toLowerCase().includes("home") ||
                product.name.toLowerCase().includes("decor"))) ||
            (category === "accessories" &&
              (product.name.toLowerCase().includes("accessory") ||
                product.name.toLowerCase().includes("bag")))
        )
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.priceRange![0] &&
          product.price <= filters.priceRange![1]
      );
    }

    // Apply origin filters (based on product name containing origin keywords)
    if (filters.origins && filters.origins.length > 0) {
      filtered = filtered.filter((product) =>
        filters.origins!.some(
          (origin) =>
            product.name.toLowerCase().includes(origin) ||
            product.artisan_name?.toLowerCase().includes(origin)
        )
      );
    }

    // Apply NFT verification filter
    if (filters.nftVerified) {
      filtered = filtered.filter((product) => product.nft_verified);
    }

    // Apply artisan verification filter
    if (filters.artisanVerified) {
      filtered = filtered.filter(
        (product) => product.artisan_name !== "Unknown"
      );
    }

    console.log("Filtered products:", filtered);

    setFilteredProducts(filtered);
  }, [products, filters, artisanId]);

  // Show loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ErrorState onRetry={fetchProducts} />
      </div>
    );
  }

  // Show empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <EmptyState artisanId={artisanId} />
      </div>
    );
  }

  // Show products
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          console.log("Rendering product:", product.id, product.name);

          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="group"
            >
              <Card className="overflow-hidden border-gray-200 transition-all hover:shadow-md">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {product.nft_verified && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" /> Verified
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    by {product.artisan_name}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="font-bold">GHS {product.price.toFixed(2)}</p>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// <Link
//   href={`/product/${product.id}`}
//   key={product.id}
//   className="group"
// >
//   <Card className="overflow-hidden border-gray-200 transition-all hover:shadow-md">
//     <div className="relative aspect-square overflow-hidden">
//       <Image
//         src={product.images[0] || "/placeholder.svg"}
//         alt={product.name}
//         fill
//         className="object-cover transition-transform group-hover:scale-105"
//       />
//       {product.nft_verified && (
//         <div className="absolute top-2 right-2">
//           <Badge
//             variant="secondary"
//             className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1"
//           >
//             <CheckCircle className="h-3 w-3" /> Verified
//           </Badge>
//         </div>
//       )}
//     </div>
//     <CardContent className="p-4">
//       <h3 className="font-medium line-clamp-2 group-hover:text-amber-600 transition-colors">
//         {product.name}
//       </h3>
//       <p className="text-sm text-gray-500 mt-1">
//         by {product.artisan_name}
//       </p>
//     </CardContent>
//     <CardFooter className="p-4 pt-0">
//       <p className="font-bold">GHS {product.price.toFixed(2)}</p>
//     </CardFooter>
//   </Card>
// </Link>
