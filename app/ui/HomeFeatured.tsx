import ProductGrid from "@/components/product-grid";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const HomeFeatured = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-16 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Creations
          </h2>
          <Link
            href="/marketplace"
            className="text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid />
      </div>
    </section>
  );
};

export default HomeFeatured;
