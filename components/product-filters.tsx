"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { useFilters } from "@/contexts/FilterContext"

export default function ProductFilters() {
  const { filters, updateFilters, clearFilters } = useFilters()

  const categories = [
    { id: "textiles", label: "Textiles" },
    { id: "jewelry", label: "Jewelry" },
    { id: "art", label: "Art" },
    { id: "home", label: "Home Decor" },
    { id: "accessories", label: "Accessories" },
  ]

  const origins = [
    { id: "ghana", label: "Ghana" },
    { id: "nigeria", label: "Nigeria" },
    { id: "kenya", label: "Kenya" },
    { id: "senegal", label: "Senegal" },
    { id: "ethiopia", label: "Ethiopia" },
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId)
    updateFilters({ categories: newCategories })
  }

  const handleOriginChange = (originId: string, checked: boolean) => {
    const newOrigins = checked
      ? [...filters.origins, originId]
      : filters.origins.filter(id => id !== originId)
    updateFilters({ origins: newOrigins })
  }

  const handlePriceRangeChange = (newRange: [number, number]) => {
    updateFilters({ priceRange: newRange })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Filters</h3>
        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "origin", "verification"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider 
                defaultValue={[0, 3000]} 
                max={3000} 
                step={10} 
                value={filters.priceRange} 
                onValueChange={handlePriceRangeChange} 
              />
              <div className="flex items-center space-x-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="from">From</Label>
                  <Input
                    type="number"
                    id="from"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange([Number.parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  />
                </div>
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    type="number"
                    id="to"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([filters.priceRange[0], Number.parseInt(e.target.value) || 1000])}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="origin">
          <AccordionTrigger>Origin</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {origins.map((origin) => (
                <div key={origin.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`origin-${origin.id}`}
                    checked={filters.origins.includes(origin.id)}
                    onCheckedChange={(checked) => handleOriginChange(origin.id, checked as boolean)}
                  />
                  <Label htmlFor={`origin-${origin.id}`} className="text-sm font-normal">
                    {origin.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification">
          <AccordionTrigger>Verification</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="nft-verified"
                  checked={filters.nftVerified}
                  onCheckedChange={(checked) => updateFilters({ nftVerified: checked as boolean })}
                />
                <Label htmlFor="nft-verified" className="text-sm font-normal">
                  NFT Verified
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="artisan-verified"
                  checked={filters.artisanVerified}
                  onCheckedChange={(checked) => updateFilters({ artisanVerified: checked as boolean })}
                />
                <Label htmlFor="artisan-verified" className="text-sm font-normal">
                  Verified Artisan
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
