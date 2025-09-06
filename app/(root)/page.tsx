"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import HomeFeatured from "../ui/HomeFeatured";
import ValueProp from "../ui/ValueProp";
import { SessionPageLoading } from "@/components/session-loading";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return <SessionPageLoading />;
  // }

  


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-amber-50 to-amber-100 py-20 px-4 sm:px-6 lg:px-16">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Authentic African Artistry,{" "}
                <span className="text-amber-600">Globally Connected</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
                Sankofa connects talented Ghanaian and African artisans directly
                to global markets, with blockchain-verified authenticity for
                every handcrafted piece.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
                  >
                    Explore Marketplace
                  </Button>
                </Link>
                <Link href="/become-artisan">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent w-full sm:w-auto"
                  >
                    Become an Artisan
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/homepage.png?height=600&width=800"
                alt="African artisan crafts"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <HomeFeatured />

      {/* Value Proposition */}
      <ValueProp />
    </div>
  );
}
