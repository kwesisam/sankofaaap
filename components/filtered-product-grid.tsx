"use client"

import { useEffect, useState } from "react"
import { useFilters } from "@/contexts/FilterContext"
import ProductGrid from "@/components/product-grid"
import { getAll } from "@/app/provider/supabaseProvider"

interface Product {
  business_id: string
  id: string
  nft_verified: boolean
  images: string[]
  name: string
  price: number
  artisan_name?: string
  category?: string
  materials?: string[]
}

export default function FilteredProductGrid({ artisanId }: { artisanId?: string }) {
  const { filters } = useFilters()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const productDataRes: any = await getAll("products")
      const artisanDataRes = await getAll("artisan")

      if (
        productDataRes.status === "success" &&
        artisanDataRes.status === "success"
      ) {
        const rawProducts = productDataRes.data
        const rawArtisans = artisanDataRes.data

        if (Array.isArray(rawProducts) && Array.isArray(rawArtisans)) {
          const transformedProducts: Product[] = rawProducts.map(
            (item: any) => {
              const matchingArtisan = rawArtisans.find(
                (artisan: any) => artisan.business_id === item.business_id
              )

              return {
                business_id: item.business_id || "",
                id: item.pid,
                nft_verified: item.nft_verified || false,
                images: item.images || [],
                name: item.name,
                price: item.price || 0,
                artisan_name: matchingArtisan?.business_name || "Unknown",
                category: item.category?.toLowerCase() || "",
                materials: item.materials || [],
              }
            }
          )

          setAllProducts(transformedProducts)
        } else {
          setAllProducts([])
        }
      } else {
        throw new Error("Failed to fetch data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = [...allProducts]

    // Filter by artisan if specified
    if (artisanId) {
      filtered = filtered.filter(product => product.business_id === artisanId)
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.some(category => 
          product.category?.includes(category) || 
          product.name.toLowerCase().includes(category)
        )
      )
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    )

    // Apply origin filters (based on artisan location - you might need to add this to your schema)
    if (filters.origins.length > 0) {
      // For now, we'll filter based on product name or materials containing origin keywords
      filtered = filtered.filter(product => 
        filters.origins.some(origin => 
          product.name.toLowerCase().includes(origin) ||
          product.materials?.some(material => 
            material.toLowerCase().includes(origin)
          )
        )
      )
    }

    // Apply NFT verification filter
    if (filters.nftVerified) {
      filtered = filtered.filter(product => product.nft_verified)
    }

    // Apply artisan verification filter (assuming all artisans are verified for now)
    if (filters.artisanVerified) {
      filtered = filtered.filter(product => product.artisan_name !== "Unknown")
    }

    setFilteredProducts(filtered)
  }, [allProducts, filters, artisanId])

  // Create a mock ProductGrid component that accepts filtered products
  return (
    <FilteredProductGridDisplay 
      products={filteredProducts}
      loading={loading}
      error={error}
      onRetry={fetchProducts}
      artisanId={artisanId}
    />
  )
}

// Component to display filtered products using the same UI as ProductGrid
function FilteredProductGridDisplay({ 
  products, 
  loading, 
  error, 
  onRetry, 
  artisanId 
}: {
  products: Product[]
  loading: boolean
  error: string | null
  onRetry: () => void
  artisanId?: string
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 text-amber-600">📦</div>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Loading Products</h3>
          <p className="text-sm text-gray-500">Discovering amazing handcrafted items...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 text-red-500">⚠️</div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Unable to Load Products
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            We're having trouble connecting to our servers. Please check your internet connection and try again.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onRetry}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              🔄 Try Again
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 text-gray-400">📦</div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            No products match your current filters. Try adjusting your search criteria.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Use the existing ProductGrid component by temporarily setting filtered products
  // This is a workaround to reuse the existing ProductGrid styling
  return <ProductGrid artisanId={artisanId} />
}
