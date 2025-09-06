"use client"

import { useFilters } from "@/contexts/FilterContext"
import ProductGrid from "@/components/product-grid"

export default function MarketplaceProductGrid({ artisanId }: { artisanId?: string }) {
  const { filters } = useFilters()
  
  return (
    <div className="h-screen p-2">

      <ProductGrid 
        artisanId={artisanId} 
        filters={{
          categories: filters.categories,
          priceRange: filters.priceRange,
          origins: filters.origins,
          nftVerified: filters.nftVerified,
          artisanVerified: filters.artisanVerified,
        }}
        />
    </div>
  )
}
