"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Loader2, Plus } from "lucide-react"

interface ProductAttribute {
  name: string
  value: string
}

export default function CreateListingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    mintNFT: false,
  })
  const [attributes, setAttributes] = useState<ProductAttribute[]>([{ name: "", value: "" }])
  const { toast } = useToast()

  const categories = [
    { value: "textiles", label: "Textiles" },
    { value: "jewelry", label: "Jewelry" },
    { value: "art", label: "Art" },
    { value: "home", label: "Home Decor" },
    { value: "accessories", label: "Accessories" },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAttributeChange = (index: number, field: "name" | "value", value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index][field] = value
    setAttributes(newAttributes)
  }

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", value: "" }])
  }

  const removeAttribute = (index: number) => {
    if (attributes.length > 1) {
      setAttributes(attributes.filter((_, i) => i !== index))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // In a real implementation, you would upload these to IPFS/Pinata
      // For now, we'll create placeholder URLs
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=400&width=400&text=${file.name}`,
      )
      setImages((prev) => [...prev, ...newImages].slice(0, 5)) // Max 5 images
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.price || !formData.category) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      if (images.length === 0) {
        toast({
          title: "Images Required",
          description: "Please upload at least one image of your product.",
          variant: "destructive",
        })
        return
      }

      // Filter out empty attributes
      const validAttributes = attributes.filter((attr) => attr.name && attr.value)

      // Submit to API
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          category: formData.category,
          images,
          mintNFT: formData.mintNFT,
          attributes: validAttributes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create listing")
      }

      const product = await response.json()

      toast({
        title: "Listing Created",
        description: `Your product "${formData.title}" has been listed successfully!${
          formData.mintNFT ? " NFT minting is in progress." : ""
        }`,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        mintNFT: false,
      })
      setImages([])
      setAttributes([{ name: "", value: "" }])
    } catch (error) {
      console.error("Create listing error:", error)
      toast({
        title: "Listing Failed",
        description: "There was an error creating your listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Hand-woven Kente Cloth"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your creation, its cultural significance, materials used, and crafting process..."
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (GHC) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">Upload Image</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Upload up to 5 high-quality images of your product. The first image will be used as the main display image.
          </p>
        </CardContent>
      </Card>

      {/* Product Attributes */}
      <Card>
        <CardHeader>
          <CardTitle>Product Attributes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {attributes.map((attribute, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`attr-name-${index}`}>Attribute Name</Label>
                <Input
                  id={`attr-name-${index}`}
                  value={attribute.name}
                  onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                  placeholder="e.g., Material, Dimensions, Weight"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor={`attr-value-${index}`}>Value</Label>
                  <Input
                    id={`attr-value-${index}`}
                    value={attribute.value}
                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                    placeholder="e.g., Cotton & Silk, 2m x 1.5m, 0.5kg"
                  />
                </div>
                {attributes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAttribute(index)}
                    className="mt-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addAttribute} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Attribute
          </Button>
        </CardContent>
      </Card>

      {/* NFT Certificate */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Certificate of Authenticity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mintNFT"
              checked={formData.mintNFT}
              onCheckedChange={(checked) => handleInputChange("mintNFT", checked as boolean)}
            />
            <Label htmlFor="mintNFT" className="text-sm font-normal">
              Create a Digital Certificate of Authenticity (NFT) for this item
            </Label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This will create a blockchain-based certificate that proves the authenticity and origin of your creation.
            There may be a small gas fee for minting the NFT.
          </p>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Listing...
            </>
          ) : (
            "Create Listing"
          )}
        </Button>
      </div>
    </form>
  )
}
