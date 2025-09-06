
import { Suspense } from "react"
import ProductFilters from "@/components/product-filters"
import ProductGridSkeleton from "@/components/product-grid-skeleton"
import MarketplaceProductGrid from "@/components/marketplace-product-grid"
import { FilterProvider } from "@/contexts/FilterContext"

export const metadata = {
  title: "Marketplace | Sankofa",
  description: "Browse authentic African artisan crafts with blockchain-verified authenticity",
}

export default function MarketplacePage() {
  return (
  <FilterProvider>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Marketplace</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-4">
            <Suspense fallback={<ProductGridSkeleton />}>
              <MarketplaceProductGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}
