"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  Award,
  Users,
  RefreshCw,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAll } from "@/app/provider/supabaseProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ArtisanProfile {
  id: string;
  name: string;
  location: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  avatar: string;
  coverImage: string;
  productCount: number;
}

// Loading State Component
const LoadingState = () => (
  <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Meet Our Artisans
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Discover the talented craftspeople behind every authentic piece. Each
        artisan brings generations of knowledge and cultural heritage to their
        work, creating unique items that tell the story of African artistry.
      </p>
    </div>

    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gray-100 rounded-lg p-6 text-center animate-pulse"
        >
          <div className="h-8 bg-gray-200 rounded mb-2 mx-auto w-16"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-24"></div>
        </div>
      ))}
    </div>

    {/* Loading Indicator */}
    <div className="flex flex-col items-center justify-center py-12 mb-8">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Users className="w-6 h-6 text-amber-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Loading Artisans
      </h3>
      <p className="text-gray-500 text-center">
        Discovering talented craftspeople...
      </p>
    </div>

    {/* Artisan Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden border-gray-200">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse -mt-8"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Meet Our Artisans
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Discover the talented craftspeople behind every authentic piece.
      </p>
    </div>

    {/* Empty State */}
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="w-16 h-16 text-gray-400" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-700 mb-4">
        No Artisans Found
      </h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        We're currently building our community of talented artisans. Check back
        soon to discover amazing craftspeople and their unique creations.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        <Link
          href="/become-artisan"
          className="px-6 py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Become an Artisan
        </Link>
      </div>
    </div>

    {/* Call to Action - Still show even when empty */}
    <div className="mt-16 text-center bg-amber-50 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Become Our First Artisan
      </h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Be part of building this community! Join us as one of our founding
        artisans and help us create a platform that celebrates traditional
        craftsmanship.
      </p>
      <Link href="/become-artisan">
        <Button className="bg-amber-600 hover:bg-amber-700">
          Apply to Join
        </Button>
      </Link>
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
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Meet Our Artisans
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Discover the talented craftspeople behind every authentic piece.
      </p>
    </div>

    {/* Error State */}
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-700 mb-4">
        Unable to Load Artisans
      </h2>
      <p className="text-gray-500 text-center max-w-md mb-2">
        We're having trouble loading our artisan profiles. Please check your
        connection and try again.
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
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>

    {/* Call to Action - Still show even on error */}
    <div className="mt-16 text-center bg-amber-50 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Become a Sankofa Artisan
      </h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Join our community of talented artisans and share your craft with the
        world. Get access to global markets while preserving traditional
        techniques and cultural heritage.
      </p>
      <Link href="/become-artisan">
        <Button className="bg-amber-600 hover:bg-amber-700">
          Apply to Join
        </Button>
      </Link>
    </div>
  </div>
);

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);

      const resData: any = await getAll("artisan");
      const productsResData: any = await getAll("products");

      if (
        resData.status === "success" &&
        productsResData.status === "success" &&
        Array.isArray(resData.data) &&
        Array.isArray(productsResData.data)
      ) {
        const rawArtisans = resData.data;
        const rawProducts = productsResData.data;

        const transformedArtisans: ArtisanProfile[] = rawArtisans.map(
          (a: any) => {
            const productCount = rawProducts.filter(
              (p: any) => p.business_id === a.business_id
            ).length;

            return {
              id: a.business_id,
              name: `${a.first_name} ${a.last_name}`.trim(),
              location: a.city || "Unknown",
              specialty: a.craft || "Unknown Craft",
              bio: a.description || "",
              rating: 0, // Replace with actual rating if available
              reviewCount: 0, // Replace with actual review count if available
              verified: a.is_verified, // Or derive from another field
              avatar: a.business_image || "/placeholder.svg",
              coverImage: a.cover_image || "/basicover.jpg",
              productCount: productCount,
            };
          }
        );

        setArtisans(transformedArtisans);
      } else {
        throw new Error("Failed to fetch artisan data");
      }
    } catch (err) {
      console.error("Error fetching artisans:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={fetchArtisans} />;
  }

  // Show empty state
  if (artisans.length === 0) {
    return <EmptyState onRetry={fetchArtisans} />;
  }

  // Show artisans
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Meet Our Artisans
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the talented craftspeople behind every authentic piece. Each
          artisan brings generations of knowledge and cultural heritage to their
          work, creating unique items that tell the story of African artistry.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-amber-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">
            {artisans.length}+
          </div>
          <div className="text-gray-700">Verified Artisans</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">6</div>
          <div className="text-gray-700">Countries Represented</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">
            {artisans.reduce(
              (total, artisan) => total + artisan.productCount,
              0
            )}
          </div>
          <div className="text-gray-700">Unique Creations</div>
        </div>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artisans.map((artisan) => (
          <Link
            href={`/artisan/${artisan.id}`}
            key={artisan.id}
            className="group"
          >
            <Card className="overflow-hidden border-gray-200 transition-all hover:shadow-lg">
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={artisan.coverImage || "/placeholder.svg"}
                  alt={`${artisan.name}'s workshop`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {artisan.verified && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                      <Award className="h-3 w-3" /> Verified
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-20 w-20 shadow-lg ">
                    <AvatarImage
                      src={artisan?.avatar || "/placeholder.svg"}
                      alt={artisan?.name || ""}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-2xl font-bold">
                      {(artisan?.name || "").charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-amber-600 transition-colors">
                      {artisan.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {artisan.location}
                    </p>
                  </div>
                </div>

                {/* Specialty */}
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    {artisan.specialty}
                  </Badge>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {artisan.bio}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    {artisan.rating} ({artisan.reviewCount})
                  </div>
                  <div>{artisan.productCount} items</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center bg-amber-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Become a Sankofa Artisan
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our community of talented artisans and share your craft with the
          world. Get access to global markets while preserving traditional
          techniques and cultural heritage.
        </p>
        <Link href="/become-artisan">
          <Button className="bg-amber-600 hover:bg-amber-700">
            Apply to Join
          </Button>
        </Link>
      </div>
    </div>
  );
}
