"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Search,
  Filter,
  Grid3X3,
  List,
  Archive,
  Copy,
  Check,
  Camera,
  Upload,
  Tag,
  Ruler,
  Clock,
  Palette,
  Heart,
  Share2,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Settings,
  Image as Imageicon,
  Globe,
  Zap,
  Award,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import {
  addData,
  deleteSpecific,
  getSpecific,
  updateData,
  uploadProductImages,
} from "../provider/supabaseProvider";
import { Session } from "next-auth";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  lowStockThreshold: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
  createdDate: string;
  lastModified: string;
  tags: string[];
  dimensions?: string;
  weight?: string;
  materials: string[];
  craftingTime: string;
  isCustomizable: boolean;
  customizationOptions?: string[];
  //shippingCost: number;
  views: number;
  favorites: number;
  conversionRate: number;
  totalRevenue: number;
}

// const mockProducts: Product[] = [
//   {
//     id: "PROD-001",
//     name: "Royal Kente Cloth",
//     description:
//       "Handwoven traditional Kente cloth featuring the royal gold and red pattern passed down through generations. Each piece tells a story of African heritage and craftsmanship.",
//     price: 89.99,
//     category: "Textiles",
//     subcategory: "Traditional Fabrics",
//     images: ["/kente-1.jpg", "/kente-2.jpg", "/kente-3.jpg"],
//     isActive: true,
//     isFeatured: true,
//     stock: 5,
//     lowStockThreshold: 3,
//     salesCount: 23,
//     rating: 4.8,
//     reviewCount: 18,
//     createdDate: "2023-06-15",
//     lastModified: "2024-01-10",
//     tags: ["Kente", "Royal", "Traditional", "Handwoven", "Ghana", "Cultural"],
//     dimensions: '72" x 48"',
//     weight: "2.5 lbs",
//     materials: ["Cotton", "Silk", "Gold Thread"],
//     craftingTime: "3-4 weeks",
//     isCustomizable: true,
//     customizationOptions: ["Size", "Color Pattern", "Border Design"],
//     //shippingCost: 15.00,
//     views: 1247,
//     favorites: 89,
//     conversionRate: 1.8,
//     totalRevenue: 2069.77,
//   },
//   {
//     id: "PROD-002",
//     name: "Traditional Kente Stole",
//     description:
//       "Elegant graduation stole featuring authentic Kente patterns, perfect for ceremonies and special occasions. Lightweight and comfortable for all-day wear.",
//     price: 45.99,
//     category: "Textiles",
//     subcategory: "Ceremonial Wear",
//     images: ["/stole-1.jpg", "/stole-2.jpg"],
//     isActive: true,
//     isFeatured: false,
//     stock: 12,
//     lowStockThreshold: 5,
//     salesCount: 67,
//     rating: 4.9,
//     reviewCount: 52,
//     createdDate: "2023-08-20",
//     lastModified: "2024-01-05",
//     tags: ["Graduation", "Ceremony", "Kente", "Stole", "Academic"],
//     dimensions: '60" x 4"',
//     weight: "0.3 lbs",
//     materials: ["Cotton", "Rayon"],
//     craftingTime: "1-2 weeks",
//     isCustomizable: true,
//     customizationOptions: ["Embroidery", "Length", "Edge Trim"],
//     //shippingCost: 8.00,
//     views: 2341,
//     favorites: 156,
//     conversionRate: 2.9,
//     totalRevenue: 3081.33,
//   },
//   {
//     id: "PROD-003",
//     name: "Kente Table Runner",
//     description:
//       "Beautiful table runner that brings African elegance to your dining experience. Perfect for special dinners and cultural celebrations.",
//     price: 34.99,
//     category: "Home Decor",
//     subcategory: "Table Linens",
//     images: ["/runner-1.jpg"],
//     isActive: false,
//     isFeatured: false,
//     stock: 0,
//     lowStockThreshold: 2,
//     salesCount: 12,
//     rating: 4.6,
//     reviewCount: 8,
//     createdDate: "2023-09-10",
//     lastModified: "2023-12-20",
//     tags: ["Table Runner", "Home Decor", "Dining", "Cultural"],
//     dimensions: '72" x 14"',
//     weight: "1.0 lbs",
//     materials: ["Cotton"],
//     craftingTime: "1 week",
//     isCustomizable: false,
//     //shippingCost: 12.00,
//     views: 567,
//     favorites: 23,
//     conversionRate: 2.1,
//     totalRevenue: 419.88,
//   },
//   {
//     id: "PROD-004",
//     name: "Kente Face Masks",
//     description:
//       "Stylish and comfortable face masks featuring traditional Kente patterns. Set of 3 masks with adjustable ear loops.",
//     price: 24.99,
//     category: "Accessories",
//     subcategory: "Health & Safety",
//     images: ["/masks-1.jpg", "/masks-2.jpg"],
//     isActive: true,
//     isFeatured: true,
//     stock: 25,
//     lowStockThreshold: 10,
//     salesCount: 89,
//     rating: 4.7,
//     reviewCount: 76,
//     createdDate: "2023-11-01",
//     lastModified: "2024-01-15",
//     tags: ["Face Masks", "Protection", "Set", "Comfortable"],
//     dimensions: '7" x 5"',
//     weight: "0.2 lbs",
//     materials: ["Cotton", "Elastic"],
//     craftingTime: "3-5 days",
//     isCustomizable: true,
//     customizationOptions: ["Pattern", "Size"],
//     //shippingCost: 5.00,
//     views: 3421,
//     favorites: 234,
//     conversionRate: 2.6,
//     totalRevenue: 2224.11,
//   },
// ];

type ArtisanListingsPageProps = {
  session: Session | null;
};

export default function ArtisanListingsPage({
  session,
}: ArtisanListingsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProductDilho, setNewProductDialog] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    materials: "",
    craftingTime: "",
    dimensions: "",
    weight: "",
    tags: "",
    isCustomizable: false,
    customizationOptions: "",
    stock: "",
    lowStockThreshold: "",
    //shippingCost: "",
    images: [] as string[],
  });
  const [uProduct, setUProduct] = useState({
    name: "",
    description: "",
    price: "",
    craftingTime: "",
    stock: "",
    dimensions: "",
    lowStockThreshold: "",
    isActive: false,
    isFeatured: false,
  });
  const [newProductSheet, setNewProductSheet] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadImages, setUploadImages] = useState<string[] | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [savingData, setSavingData] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const getProductsRes = await getSpecific("products", {
        business_id: session?.user.id,
      });

      //console.log(getProductsRes);

      if (
        getProductsRes.status === "success" &&
        Array.isArray(getProductsRes.data)
      ) {
        const products: Product[] = getProductsRes.data.map((newProduct) => {
          return {
            id: newProduct.pid,
            name: newProduct.name,
            description: newProduct.description,
            price: parseFloat(newProduct.price),
            category: newProduct.category,
            subcategory: newProduct.subcategory,
            images: newProduct.images ?? [],
            isActive: newProduct.is_active,
            isFeatured: newProduct.is_featured,
            stock: parseInt(newProduct.stock),
            lowStockThreshold: parseInt(newProduct.low_stock_threshold),
            salesCount: parseInt(newProduct.sales_count),
            rating: newProduct.rating,
            reviewCount: newProduct.review_count,
            createdDate: newProduct.created_date.toString(),
            lastModified: newProduct.last_modified.toString(),
            tags: newProduct.tags,
            dimensions: newProduct.dimensions,
            weight: newProduct.weight,
            materials: newProduct.materials,
            craftingTime: newProduct.crafting_time,
            isCustomizable: newProduct.is_customizable,
            customizationOptions: newProduct.customization_options,
            views: newProduct.views,
            favorites: newProduct.favorites,
            conversionRate: newProduct.conversion_rate,
            totalRevenue: newProduct.total_revenue,
          };
        });

        console.log(products);

        // Set products and filteredProducts safely
        setProducts(products);
        setFilteredProducts(products); // or filter them if needed
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    if (session?.user?.id) {
      fetchProduct();
    }
  }, [session]);

  // Filter and sort products
  const filterAndSortProducts = () => {
    let filtered = products ?? [];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === categoryFilter
      );
    }

    // Apply status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((product) => product.isActive);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((product) => !product.isActive);
    } else if (statusFilter === "low-stock") {
      filtered = filtered.filter(
        (product) => product.stock <= product.lowStockThreshold
      );
    } else if (statusFilter === "featured") {
      filtered = filtered.filter((product) => product.isFeatured);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
          );
        case "date-asc":
          return (
            new Date(a.lastModified).getTime() -
            new Date(b.lastModified).getTime()
          );
        case "price-desc":
          return b.price - a.price;
        case "price-asc":
          return a.price - b.price;
        case "sales-desc":
          return b.salesCount - a.salesCount;
        case "rating-desc":
          return b.rating - a.rating;
        case "views-desc":
          return b.views - a.views;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  // Call filter function on component mount and when dependencies change
  useEffect(() => {
    filterAndSortProducts();
  }, [searchQuery, categoryFilter, statusFilter, sortBy, products]);

  const handleToggleProductStatus = (productId: string) => {
    setProducts(
      (products ?? []).map((product) =>
        product.id === productId
          ? { ...product, isActive: !product.isActive }
          : product
      )
    );
  };

  const handleToggleFeatured = (productId: string) => {
    setProducts(
      (products ?? []).map((product) =>
        product.id === productId
          ? { ...product, isFeatured: !product.isFeatured }
          : product
      )
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    const productDel = (products ?? []).filter(
      (product) => product.id !== productId
    );

    try {
      const deleteDataRes = await deleteSpecific("products", {
        pid: productDel[0].id,
      });

      if (deleteDataRes.status === "success") {
        toast({
          title: "Product Deleted Successfully!",
          description: `${productDel[0].name} was been removed.`,
        });

        setProducts(
          (products ?? []).filter((product) => product.id !== productId)
        );
      } else {
      }
    } catch (error) {
      toast({
        title: "Product Deletion Failed",
        description:
          "There was an error deleting product. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLoadingFile(true);
      console.log("Selected files:", files);
      // Upload files to Supabase
      const uploadResult = await uploadProductImages(Array.from(files));
      var storeUrl = [];
      if (Array.isArray(uploadResult.results)) {
        for (const result of uploadResult.results) {
          if (result.status === "success") {
            // toast({
            //   title: "Upload Successful",
            //   description: `${result.file} uploaded successfully.`,
            // });
            storeUrl.push(result.publicUrl);
          } else {
            toast({
              title: "Upload Failed",
              description: `Failed to upload ${result.file}: ${result.error}`,
              variant: "destructive",
            });
          }
        }
        setLoadingFile(false);
      } else {
        toast({
          title: "Upload Failed",
          description:
            uploadResult.error || "Unknown error occurred during upload.",
          variant: "destructive",
        });
        setLoadingFile(false);
      }

      setUploadImages(
        storeUrl.filter((url): url is string => typeof url === "string")
      );
    }
  };

  const handleRemoveImage = (url: string) => {
    setUploadImages((prev) => prev?.filter((image) => image !== url) || null);
  };

  const handleCreateProduct = async () => {
    // const requiredFields = [
    //   "name",
    //   "price",
    //   "description",
    //   "category",
    //   "stock",
    // ];

    // const missingFields = requiredFields.filter(
    //   (field) => !newProduct[field as keyof typeof newProduct]
    // );

    // if (missingFields.length > 0) {
    //   toast({
    //     title: "Missing Information",
    //     description: "Please fill in all required fields marked with *",
    //     variant: "destructive",
    //   });
    //   return;
    // }
    setSavingData(true);
    try {
      const product: Product = {
        id: `PROD-${Date.now()}`,
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        images: uploadImages ?? [],
        isActive: true,
        isFeatured: false,
        stock: parseInt(newProduct.stock),
        lowStockThreshold: parseInt(newProduct.lowStockThreshold),
        salesCount: 0,
        rating: 0,
        reviewCount: 0,
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        tags: newProduct.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        dimensions: newProduct.dimensions,
        weight: newProduct.weight,
        materials: newProduct.materials
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m.length > 0),
        craftingTime: newProduct.craftingTime,
        isCustomizable: newProduct.isCustomizable,
        customizationOptions: newProduct.customizationOptions
          ? newProduct.customizationOptions
              .split(",")
              .map((o) => o.trim())
              .filter((o) => o.length > 0)
          : [],
        //shippingCost: parseFloat(newProduct.shippingCost) || 0,
        views: 0,
        favorites: 0,
        conversionRate: 0,
        totalRevenue: 0,
      };

      const addDataRes = await addData("products", {
        pid: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        is_active: product.isActive,
        is_featured: product.isFeatured,
        stock: product.stock,
        low_stock_threshold: product.lowStockThreshold,
        sales_count: product.salesCount,
        rating: product.rating,
        review_count: product.reviewCount,
        tags: product.tags,
        dimensions: product.dimensions,
        weight: product.weight,
        materials: product.materials,
        crafting_time: product.craftingTime,
        is_customizable: product.isCustomizable,
        customization_options: product.customizationOptions,
        views: product.views,
        favorites: product.favorites,
        conversion_rate: product.conversionRate,
        total_revenue: product.totalRevenue,
        business_id: session?.user.id,
        images: product.images,
        nft_verified: false,
      });

      if (addDataRes.status === "success") {
        toast({
          title: "Product Creation Successfully!",
          description: `${product.name} was been listed.`,
        });

        setProducts([product, ...(products ?? [])]);

        // Reset form
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          subcategory: "",
          materials: "",
          craftingTime: "",
          dimensions: "",
          weight: "",
          tags: "",
          isCustomizable: false,
          customizationOptions: "",
          stock: "",
          lowStockThreshold: "",
          //shippingCost: "",
          images: [],
        });

        // Clear images
        setUploadImages([]);
        setImagePreviewUrls([]);
        setNewProductSheet(false);
      }
    } catch (error) {
      toast({
        title: "Product Creation Failed",
        description:
          "There was an error creating product. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setSavingData(false);
    }
  };

  const handleInitUpdate = (product: Product) => {
    setSelectedProduct(product);

    setUProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      craftingTime: product.craftingTime,
      dimensions: product.dimensions ?? "",
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
  };

  const handleUpdateProduct = async () => {
    console.log(222);
    try {
      const data = {
        name: uProduct.name ?? selectedProduct?.name,
        description: uProduct.description ?? selectedProduct?.description,
        price: parseFloat(uProduct.price ?? selectedProduct?.price),
        crafting_time: uProduct.craftingTime ?? selectedProduct?.craftingTime,
        dimensions: uProduct.dimensions ?? selectedProduct?.dimensions,
        stock: parseInt(uProduct.stock ?? selectedProduct?.stock),
        low_stock_threshold: parseInt(
          uProduct.lowStockThreshold ?? selectedProduct?.lowStockThreshold
        ),
        is_active: uProduct.isActive ?? selectedProduct?.isActive,
        is_featured: uProduct.isFeatured ?? selectedProduct?.isFeatured,
        last_modified: new Date().toISOString().split("T")[0],
      };

      const updateDataRes = await updateData(
        "products",
        {
          pid: selectedProduct?.id,
        },
        data
      );

      if (updateDataRes.status === "success") {
        toast({
          title: "Product Updated Successfully!",
          description: `${uProduct.name} was been update.`,
        });

        const parsedProductUpdates = {
          name: uProduct.name,
          description: uProduct.description,
          price: parseFloat(uProduct.price) || 0,
          stock: parseInt(uProduct.stock) || 0,
          craftingTime: uProduct.craftingTime,
          dimensions: uProduct.dimensions,
          lowStockThreshold: parseInt(uProduct.lowStockThreshold) || 0,
          isActive: uProduct.isActive,
          isFeatured: uProduct.isFeatured,
        };

        setProducts((prev) =>
          (prev ?? []).map((p) =>
            p.id === selectedProduct?.id ? { ...p, ...parsedProductUpdates } : p
          )
        );

        setFilteredProducts((prev) =>
          (prev ?? []).map((p) =>
            p.id === selectedProduct?.id ? { ...p, ...parsedProductUpdates } : p
          )
        );
      }

      setSelectedProduct(null);
    } catch (error) {
      toast({
        title: "Product Failed to Update",
        description:
          "There was an error updating product. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const getListingStats = () => {
    const activeProducts = products?.filter((p) => p.isActive).length || 0;
    const totalProducts = products?.length || 0;
    const featuredProducts = products?.filter((p) => p.isFeatured).length || 0;
    const lowStockProducts =
      products?.filter((p) => p.stock <= p.lowStockThreshold).length || 0;
    const totalViews = products?.reduce((sum, p) => sum + p.views, 0) || 0;
    const totalRevenue =
      products?.reduce((sum, p) => sum + p.totalRevenue, 0) || 0;

    const ratings = products?.filter((p) => p.rating > 0) || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, p) => sum + p.rating, 0) / ratings.length
        : 0;

    return {
      activeProducts,
      totalProducts,
      featuredProducts,
      lowStockProducts,
      totalViews,
      totalRevenue,
      avgRating,
    };
  };

  const stats = getListingStats();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold">My Listings</h1>
                  <p className="mt-2 text-emerald-100">
                    Manage your products and showcase your craftsmanship
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {stats.activeProducts}
                      </p>
                      <p className="text-sm text-emerald-100">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {stats.totalViews.toLocaleString()}
                      </p>
                      <p className="text-sm text-emerald-100">Total Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        ₵{stats.totalRevenue.toFixed(0)}
                      </p>
                      <p className="text-sm text-emerald-100">Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-16 -top-8 opacity-20">
              <Package className="h-32 w-32" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">
                      Active Listings
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {stats.activeProducts}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      of {stats.totalProducts} total
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      ${stats.totalRevenue.toFixed(0)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      From all listings
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">
                      Avg Rating
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      {stats.avgRating.toFixed(1)}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Across all products
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">
                      Low Stock Alert
                    </p>
                    <p className="text-3xl font-bold text-orange-900">
                      {stats.lowStockProducts}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Need restocking
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <Sheet open={newProductSheet} onOpenChange={setNewProductSheet}>
              <SheetTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Product
                  </SheetTitle>
                  <SheetDescription>
                    Add a new item to your collection. Fill in all the details
                    to attract more buyers.
                  </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 py-6">
                  {/* Product Images */}
                  <div className="space-y-4">
                    <Label>Product Images *</Label>
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="image-upload"
                          disabled={loadingFile}
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <div className="space-y-2">
                            <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Click to upload product images
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, JPEG up to 10MB each. You can select
                                multiple images.
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {uploadImages != null && uploadImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {uploadImages.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveImage(url)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div className="absolute bottom-2 left-2">
                                <Badge variant="secondary" className="text-xs">
                                  {index === 0 ? "Main" : `${index + 1}`}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        placeholder="e.g., Royal Kente Cloth"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (GHC) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your product, its cultural significance, and crafting process..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) =>
                          setNewProduct({ ...newProduct, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Textiles">Textiles</SelectItem>
                          <SelectItem value="Jewelry">Jewelry</SelectItem>
                          <SelectItem value="Art">Art</SelectItem>
                          <SelectItem value="Home Decor">Home Decor</SelectItem>
                          <SelectItem value="Accessories">
                            Accessories
                          </SelectItem>
                          <SelectItem value="Pottery">Pottery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Input
                        id="subcategory"
                        value={newProduct.subcategory}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            subcategory: e.target.value,
                          })
                        }
                        placeholder="e.g., Traditional Fabrics"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min={1}
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            stock: e.target.value,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min={0}
                        value={newProduct.lowStockThreshold}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            lowStockThreshold: e.target.value,
                          })
                        }
                        placeholder="5"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="shippingCost">Shipping Cost</Label>
                      <Input
                        id="shippingCost"
                        type="number"
                        step="0.01"
                        value={newProduct.shippingCost}
                        onChange={(e) => setNewProduct({...newProduct, shippingCost: e.target.value})}
                        placeholder="15.00"
                      />
                    </div> */}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="materials">Materials</Label>
                      <Input
                        id="materials"
                        value={newProduct.materials}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            materials: e.target.value,
                          })
                        }
                        placeholder="Cotton, Silk, Gold Thread (comma separated)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="craftingTime">Crafting Time</Label>
                      <Input
                        id="craftingTime"
                        value={newProduct.craftingTime}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            craftingTime: e.target.value,
                          })
                        }
                        placeholder="e.g., 3-4 weeks"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={newProduct.dimensions}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            dimensions: e.target.value,
                          })
                        }
                        placeholder="e.g., 72"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={newProduct.weight}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            weight: e.target.value,
                          })
                        }
                        placeholder="e.g., 2.5 lbs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={newProduct.tags}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, tags: e.target.value })
                      }
                      placeholder="Kente, Traditional, Handwoven (comma separated)"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="customizable"
                        checked={newProduct.isCustomizable}
                        onCheckedChange={(checked) =>
                          setNewProduct({
                            ...newProduct,
                            isCustomizable: checked,
                          })
                        }
                      />
                      <Label htmlFor="customizable">Allow customization</Label>
                    </div>

                    {newProduct.isCustomizable && (
                      <div className="space-y-2">
                        <Label htmlFor="customizationOptions">
                          Customization Options
                        </Label>
                        <Input
                          id="customizationOptions"
                          value={newProduct.customizationOptions}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              customizationOptions: e.target.value,
                            })
                          }
                          placeholder="Size, Color Pattern, Border Design (comma separated)"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <SheetFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setNewProductSheet(false)}
                    disabled={savingData}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProduct}
                    disabled={
                      !newProduct.name ||
                      !newProduct.description ||
                      !newProduct.price ||
                      !newProduct.category ||
                      savingData
                    }
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {savingData ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 text-black"></div>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Listings
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter & Search Products
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name, category, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="home decor">Home Decor</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="pottery">Pottery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">
                        Recently Modified
                      </SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="price-desc">Highest Price</SelectItem>
                      <SelectItem value="price-asc">Lowest Price</SelectItem>
                      <SelectItem value="sales-desc">Best Selling</SelectItem>
                      <SelectItem value="rating-desc">Highest Rated</SelectItem>
                      <SelectItem value="views-desc">Most Viewed</SelectItem>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={filterAndSortProducts} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    My Products ({filteredProducts?.length ?? 0})
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Manage your product listings and inventory
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredProducts != null && filteredProducts.length <= 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button
                    onClick={() => setNewProductDialog(true)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Product
                  </Button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts != null &&
                    filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className={`border-2 transition-all duration-200 hover:shadow-xl group overflow-hidden ${
                          product.isActive
                            ? "hover:border-emerald-200"
                            : "border-gray-200 opacity-75"
                        }`}
                      >
                        <div className="relative aspect-[4/3]  flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0  transition-all duration-300" />
                          {product.images.length <= 0 ? (
                            <Imageicon className="h-16 w-16 text-emerald-400 relative z-10" />
                          ) : (
                            <Image
                              width={400}
                              height={400}
                              src={product.images[0] ?? ""}
                              alt={`${product.id}`}
                            />
                          )}

                          {/* Product Badges */}
                          <div className="absolute top-3 left-3 space-y-1">
                            {product.isFeatured && (
                              <Badge className="bg-yellow-500/90 text-white border-yellow-400/50 backdrop-blur">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {product.stock <= product.lowStockThreshold &&
                              product.stock > 0 && (
                                <Badge className="bg-orange-500/90 text-white border-orange-400/50 backdrop-blur">
                                  Low Stock
                                </Badge>
                              )}
                            {product.stock === 0 && (
                              <Badge className="bg-red-500/90 text-white border-red-400/50 backdrop-blur">
                                Out of Stock
                              </Badge>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="flex flex-col gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-white/90 backdrop-blur"
                                    onClick={() =>
                                      handleToggleFeatured(product.id)
                                    }
                                  >
                                    <Star
                                      className={`h-3 w-3 ${
                                        product.isFeatured
                                          ? "fill-current text-yellow-500"
                                          : ""
                                      }`}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {product.isFeatured
                                    ? "Remove from Featured"
                                    : "Add to Featured"}
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 bg-white/90 backdrop-blur"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Preview Product</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>

                          {/* Status Toggle */}
                          <div className="absolute bottom-3 left-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={product.isActive}
                                onCheckedChange={() =>
                                  handleToggleProductStatus(product.id)
                                }
                              />
                              <span
                                className={`text-xs font-medium ${
                                  product.isActive
                                    ? "text-green-700"
                                    : "text-gray-600"
                                }`}
                              >
                                {product.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>

                          {/* Price Badge */}
                          <div className="absolute bottom-3 right-3">
                            <Badge className="bg-white/90 text-gray-800 border-white/50 backdrop-blur font-bold">
                              ₵{product.price.toFixed(2)}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h3 className="font-bold text-lg leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {product.category} • {product.subcategory}
                            </p>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <p className="font-semibold text-blue-600">
                                {product.views}
                              </p>
                              <p className="text-gray-500">Views</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-green-600">
                                {product.salesCount}
                              </p>
                              <p className="text-gray-500">Sales</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-purple-600">
                                {product.rating.toFixed(1)}
                              </p>
                              <p className="text-gray-500">Rating</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3 text-gray-400" />
                              <span
                                className={
                                  product.stock <= product.lowStockThreshold
                                    ? "text-orange-600 font-medium"
                                    : "text-gray-600"
                                }
                              >
                                Stock: {product.stock}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-400" />
                              <span className="text-gray-600">
                                {product.favorites}
                              </span>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex gap-2">
                            <Dialog
                              open={selectedProduct !== null}
                              onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                  setSelectedProduct(null); // Close the dialog
                                }
                              }}
                            >
                              {" "}
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleInitUpdate(product)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Product</DialogTitle>
                                  <DialogDescription>
                                    Update your product details and settings
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedProduct && (
                                  <div className="grid gap-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Product Name</Label>
                                        <Input
                                          value={uProduct.name}
                                          onChange={(e) =>
                                            setUProduct({
                                              ...uProduct,
                                              name: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Price (GHC)</Label>
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={uProduct.price}
                                          onChange={(e) =>
                                            setUProduct({
                                              ...uProduct,
                                              price: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Description</Label>
                                      <Textarea
                                        value={uProduct.description}
                                        onChange={(e) =>
                                          setUProduct({
                                            ...uProduct,
                                            description: e.target.value,
                                          })
                                        }
                                        className="min-h-[100px]"
                                      />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                        <Label>Stock</Label>
                                        <Input
                                          type="number"
                                          value={uProduct.stock}
                                          onChange={(e) =>
                                            setUProduct({
                                              ...uProduct,
                                              stock: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Low Stock Alert</Label>
                                        <Input
                                          type="number"
                                          value={uProduct.lowStockThreshold}
                                          onChange={(e) =>
                                            setUProduct({
                                              ...uProduct,
                                              lowStockThreshold: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      {/* <div className="space-y-2">
                                      <Label>Shipping Cost</Label>
                                      <Input type="number" step="0.01" defaultValue={selectedProduct.shippingCost} />
                                    </div> */}
                                    </div>

                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          checked={uProduct.isActive}
                                          onCheckedChange={(e) =>
                                            setUProduct({
                                              ...uProduct,
                                              isActive: !uProduct.isActive,
                                            })
                                          }
                                        />
                                        <Label>Active</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          checked={uProduct.isFeatured}
                                          onCheckedChange={(e) =>
                                            setUProduct({
                                              ...uProduct,
                                              isFeatured: !uProduct.isFeatured,
                                            })
                                          }
                                        />
                                        <Label>Featured</Label>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedProduct(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleUpdateProduct}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  <BarChart3 className="h-3 w-3 mr-1" />
                                  Stats
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">
                                      Product Analytics
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Performance metrics for "{product.name}"
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500">
                                        Total Views
                                      </p>
                                      <p className="font-semibold text-blue-600">
                                        {product.views.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Favorites</p>
                                      <p className="font-semibold text-red-600">
                                        {product.favorites}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">
                                        Conversion Rate
                                      </p>
                                      <p className="font-semibold text-green-600">
                                        {product.conversionRate}%
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">
                                        Total Revenue
                                      </p>
                                      <p className="font-semibold text-purple-600">
                                        ₵{product.totalRevenue.toFixed(2)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">
                                        Avg Rating
                                      </p>
                                      <p className="font-semibold text-orange-600">
                                        {product.rating.toFixed(1)} ⭐
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Reviews</p>
                                      <p className="font-semibold text-indigo-600">
                                        {product.reviewCount}
                                      </p>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                      Recent Performance
                                    </p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>Views this week</span>
                                        <span className="text-blue-600">
                                          +127
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Sales this month</span>
                                        <span className="text-green-600">
                                          +
                                          {Math.floor(product.salesCount * 0.3)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="flex gap-1 items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="flex-1 p-1"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Preview Product</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="flex-1 p-1"
                                >
                                  <Share2 className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Share Product</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="flex-1 p-1"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Duplicate Product</TooltipContent>
                            </Tooltip>

                            {deleteConfirm === product.id ? (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => {
                                    handleDeleteProduct(product.id);
                                    setDeleteConfirm(null);
                                  }}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => setDeleteConfirm(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="flex-1 p-1 text-red-600 hover:text-red-700"
                                    onClick={() => setDeleteConfirm(product.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Product</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                // List View
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 px-4 py-2 bg-gray-50 rounded-lg">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">Price</div>
                    <div className="col-span-1 text-center">Stock</div>
                    <div className="col-span-1 text-center">Sales</div>
                    <div className="col-span-1 text-center">Rating</div>
                    <div className="col-span-1 text-center">Views</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>

                  {filteredProducts != null &&
                    filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="border hover:border-emerald-200 transition-all duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4 flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                                <Imageicon className="h-6 w-6 text-emerald-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold truncate">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 truncate">
                                  {product.category}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  {product.isFeatured && (
                                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                      Featured
                                    </Badge>
                                  )}
                                  {product.stock <=
                                    product.lowStockThreshold && (
                                    <Badge className="bg-orange-100 text-orange-700 text-xs">
                                      Low Stock
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="col-span-1 text-center">
                              <Switch
                                checked={product.isActive}
                                onCheckedChange={() =>
                                  handleToggleProductStatus(product.id)
                                }
                              />
                            </div>

                            <div className="col-span-1 text-center">
                              <span className="font-semibold text-green-600">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>

                            <div className="col-span-1 text-center">
                              <span
                                className={`font-semibold ${
                                  product.stock <= product.lowStockThreshold
                                    ? "text-orange-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {product.stock}
                              </span>
                            </div>

                            <div className="col-span-1 text-center">
                              <span className="font-semibold text-blue-600">
                                {product.salesCount}
                              </span>
                            </div>

                            <div className="col-span-1 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="font-semibold">
                                  {product.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>

                            <div className="col-span-1 text-center">
                              <span className="font-semibold text-purple-600">
                                {product.views.toLocaleString()}
                              </span>
                            </div>

                            <div className="col-span-2 flex justify-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedProduct(product)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                              </Dialog>

                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <BarChart3 className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                  <div className="space-y-3">
                                    <h4 className="font-medium">Quick Stats</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p className="text-gray-500">Revenue</p>
                                        <p className="font-semibold">
                                          ₵{product.totalRevenue.toFixed(2)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">
                                          Conversion
                                        </p>
                                        <p className="font-semibold">
                                          {product.conversionRate}%
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>

                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>

                              {deleteConfirm === product.id ? (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => {
                                      handleDeleteProduct(product.id);
                                      setDeleteConfirm(null);
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => setDeleteConfirm(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => setDeleteConfirm(product.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          {stats.lowStockProducts > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800">
                Low Stock Alert
              </AlertTitle>
              <AlertDescription className="text-orange-700">
                You have {stats.lowStockProducts} product(s) running low on
                stock. Consider restocking soon to avoid missing sales.
              </AlertDescription>
            </Alert>
          )}

          {/* Bulk Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Bulk Management</CardTitle>
              <CardDescription>
                Manage multiple products at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-16 flex-col space-y-2"
                  onClick={() => {
                    if (products) {
                      setProducts(
                        products.map((p) => ({ ...p, isActive: true }))
                      );
                    }
                  }}
                >
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Activate All</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 flex-col space-y-2"
                  onClick={() => {
                    if (products) {
                      setProducts(
                        products.map((p) => ({ ...p, isActive: false }))
                      );
                    }
                  }}
                >
                  <Archive className="h-6 w-6 text-gray-600" />
                  <span>Deactivate All</span>
                </Button>

                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Download className="h-6 w-6" />
                  <span>Export Products</span>
                </Button>

                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Upload className="h-6 w-6" />
                  <span>Import Products</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
