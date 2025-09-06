"use client";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductGrid from "@/components/product-grid";
import ProductGridSkeleton from "@/components/product-grid-skeleton";
import {
  MapPin,
  Star,
  Award,
  ExternalLink,
  User,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { getSpecific } from "@/app/provider/supabaseProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ArtisanDetail {
  id: string;
  name: string;
  location: string;
  bio: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  joinedDate: string;
  avatar: string;
  coverImage: string;
}

// Loading State Component
const LoadingState = () => (
  <div className="container mx-auto max-w-7xl pb-16">
    {/* Cover Image Skeleton */}
    <div className="relative h-64 md:h-80 w-full bg-gray-200 animate-pulse" />

    {/* Profile Info Skeleton */}
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6 -mt-16 relative">
        <div className="relative h-32 w-32 rounded-full border-4 border-white bg-gray-200 animate-pulse" />

        <div className="flex-1 pt-4 md:pt-0 md:mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex flex-col items-center justify-center py-12 mt-8">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Loading Artisan Profile
        </h3>
        <p className="text-gray-500 text-center">Fetching artisan details...</p>
      </div>
    </div>
  </div>
);

// Artisan Not Found State
const ArtisanNotFoundState = ({
  artisanId,
  onRetry,
}: {
  artisanId: string;
  onRetry: () => void;
}) => (
  <div className="container mx-auto max-w-7xl pb-16">
    {/* Cover Image Placeholder */}
    <div className="relative h-64 md:h-80 w-full bg-gray-100" />

    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          Artisan Not Found
        </h1>
        <p className="text-gray-500 text-center max-w-md mb-2">
          Sorry, we couldn't find the artisan profile you're looking for.
        </p>
        <p className="text-sm text-gray-400 mb-8">Artisan ID: {artisanId}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/artisans"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Artisans
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
  <div className="container mx-auto max-w-7xl pb-16">
    {/* Cover Image Placeholder */}
    <div className="relative h-64 md:h-80 w-full bg-gray-100" />

    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          Unable to Load Profile
        </h1>
        <p className="text-gray-500 text-center max-w-md mb-2">
          We encountered an error while loading this artisan's profile.
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
            href="/artisans"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Artisans
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
  </div>
);

export default function ArtisanProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [artisan, setArtisan] = useState<ArtisanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtisan = async () => {
    try {
      setLoading(true);
      setError(null);

      const resData: any = await getSpecific("artisan", {
        business_id: params.id,
      });

      if (
        resData.status === "success" &&
        Array.isArray(resData.data) &&
        resData.data.length > 0
      ) {
        const a = resData.data[0];

        const transformedArtisan: ArtisanDetail = {
          id: a.business_id,
          name: `${a.first_name} ${a.last_name}`.trim(),
          location: a.city || "Unknown",
          bio: a.description || "",
          rating: 0, // Replace with actual rating if available
          reviewCount: 0, // Replace with actual review count if available
          verified: a.is_verified || false,
          joinedDate: a.created_at,
          avatar: a.business_image || "/placeholder.svg",
          coverImage: a.cover_image || "/basicover.jpg",
        };

        setArtisan(transformedArtisan);
      } else {
        // No artisan found
        setArtisan(null);
      }
    } catch (err) {
      console.error("Error fetching artisan:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisan();
  }, [params.id]);

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={fetchArtisan} />;
  }

  // Show artisan not found state
  if (!artisan) {
    return (
      <ArtisanNotFoundState artisanId={params.id} onRetry={fetchArtisan} />
    );
  }

  // Show artisan profile
  return (
    <div className="container mx-auto max-w-7xl pb-16">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={artisan.coverImage || "/placeholder.svg"}
          alt={`${artisan.name}'s workshop`}
          fill
          className="object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 -mt-16 relative">
            <Avatar className="h-32 w-32 shadow-lg ">
              <AvatarImage
                src={artisan?.avatar || "/placeholder.svg"}
                alt={artisan?.name || ""}
              />
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-2xl font-bold">
                {(artisan?.name || "").charAt(0)}
              </AvatarFallback>
            </Avatar>
          

          <div className="flex-1 pt-4 md:pt-0 md:mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {artisan.name}
                  </h1>

                  {artisan.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Award className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {artisan.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    {artisan.rating} ({artisan.reviewCount} reviews)
                  </div>
                  <div>Member since {artisan.joinedDate.split("T")[0]}</div>
                </div>
              </div>

              <Button>Contact Artisan</Button>
            </div>

            <p className="mt-4 text-gray-700">{artisan.bio}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="creations" className="mt-12">
          {artisan != null && (
            <TabsList>
              <TabsTrigger value="creations">Creations</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="creations" className="mt-6">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid artisanId={params.id} />
            </Suspense>
          </TabsContent>
          <TabsContent value="reviews">
            <div className="bg-white rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <p className="text-gray-500">
                Reviews will appear here once available.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="about">
            <div className="bg-white rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">
                About {artisan.name}
              </h3>
              <p className="text-gray-700 mb-4">{artisan.bio}</p>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-amber-600" />
                <a href="#" className="text-amber-600 hover:underline">
                  View Blockchain Verification
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
