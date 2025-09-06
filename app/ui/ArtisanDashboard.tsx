"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Package,
  Plus,
  Edit,
  Trash2,
  Star,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { getAll, getSpecific } from "../provider/supabaseProvider";

interface ArtisanDashboardProps {
  user: {
    name: string;
    businessName?: string;
    isVerified?: boolean;
    walletAddress?: string;
  };
}

interface Artisan {
  name: string;
  businessName?: string;
  isVerified?: boolean;
  walletAddress?: string;
}
export interface Listing {
  id: string;
  title: string;
  image: string;
  price: string; // keeping as string since you store it with "$"
  stock: number;
  category: string;
  status:
    | "in-escrow"
    | "shipped"
    | "pending"
    | "in-mediation"
    | "cancelled"
    | "delivered"
    | "refunded"
    | "in-progress"
    | "ready";
  views: number;
  likes: number;
}

// Order Interface
export interface Order {
  id: string;
  productName: string;
  buyerName: string;
  buyerAvatar: string;
  price: string; // same reason, "$"
  status:
    | "in-escrow"
    | "shipped"
    | "pending"
    | "in-mediation"
    | "cancelled"
    | "delivered"
    | "refunded"
    | "in-progress"
    | "ready";
  escrowStatus: "held" | "released" | "refunded"; // restrict to escrow states
  orderDate: string;
  trackingId?: string;
  shippingAddress: string;
}

// Mock data - in real app this would come from API
// const mockListings = [
//   {
//     id: "PROD-001",
//     title: "Handwoven Kente Cloth",
//     image: "/african-textiles.png",
//     price: "$89.99",
//     stock: 5,
//     category: "Textiles",
//     status: "active",
//     views: 234,
//     likes: 18,
//   },
//   {
//     id: "PROD-002",
//     title: "Beaded Jewelry Set",
//     image: "/african-jewelry.png",
//     price: "$45.50",
//     stock: 12,
//     category: "Jewelry",
//     status: "active",
//     views: 156,
//     likes: 24,
//   },
//   {
//     id: "PROD-003",
//     title: "Carved Wooden Mask",
//     image: "/african-mask.png",
//     price: "$120.00",
//     stock: 0,
//     category: "Art",
//     status: "out-of-stock",
//     views: 89,
//     likes: 12,
//   },
// ];

// const mockOrders = [
//   {
//     id: "ORD-001",
//     productName: "Handwoven Kente Cloth",
//     buyerName: "John Doe",
//     buyerAvatar: "/diverse-user-avatars.png",
//     price: "$89.99",
//     status: "shipped",
//     escrowStatus: "held",
//     orderDate: "2024-01-15",
//     trackingId: "TRK123456789",
//     shippingAddress: "123 Main St, New York, NY 10001",
//   },
//   {
//     id: "ORD-002",
//     productName: "Beaded Jewelry Set",
//     buyerName: "Sarah Johnson",
//     buyerAvatar: "/diverse-user-avatars.png",
//     price: "$45.50",
//     status: "pending",
//     escrowStatus: "held",
//     orderDate: "2024-01-20",
//     shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
//   },
// ];

const mockReviews = [
  {
    id: "REV-001",
    buyerName: "John Doe",
    buyerAvatar: "/diverse-user-avatars.png",
    productName: "Handwoven Kente Cloth",
    rating: 5,
    comment:
      "Absolutely beautiful craftsmanship! The colors are vibrant and the quality is exceptional.",
    date: "2024-01-16",
  },
  {
    id: "REV-002",
    buyerName: "Maria Garcia",
    buyerAvatar: "/diverse-user-avatars.png",
    productName: "Carved Wooden Mask",
    rating: 4,
    comment:
      "Great attention to detail. Shipping was fast and packaging was secure.",
    date: "2024-01-12",
  },
];

export function ArtisanDashboard({ user }: ArtisanDashboardProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [trackingIds, setTrackingIds] = useState<Record<string, string>>({});
  const [selectedDeleting, seSelectedDeleting] = useState<String | null>(null);
  const { data: session } = useSession();
  const [artisan, setArtisan] = useState<Artisan[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getOrdersRes = await getSpecific("orders", {
          artisan_id: session?.user.id,
        });
        const getProductsRes = await getSpecific("products", {
          business_id: session?.user.id,
        });
        const getArtisanRes = await getSpecific("artisan", {
          business_id: session?.user.id,
        });

        if (
          getOrdersRes.status === "success" &&
          Array.isArray(getOrdersRes.data)
        ) {
          const rawOrders = getOrdersRes.data;
          const transformedOrders: Order[] = rawOrders.map((rawOrder: any) => ({
            id: rawOrder.oid,
            productName: rawOrder.product_name,
            buyerName: rawOrder.user_name,
            buyerAvatar: "/diverse-user-avatars.png",
            price: `$${rawOrder.price}`,
            status: rawOrder.status,
            escrowStatus: rawOrder.escrow_status || "held",
            orderDate: rawOrder.created_at.split("T")[0],
            trackingId: rawOrder.tracking_id || undefined,
            shippingAddress: [
              rawOrder.address_line_one,
              rawOrder.address_line_two,
              rawOrder.city,
              rawOrder.state,
              rawOrder.postal_code,
              rawOrder.country,
            ]
              .filter(Boolean)
              .join(", "),
          }));
          setOrders(transformedOrders);
        }

        if (
          getProductsRes.status === "success" &&
          Array.isArray(getProductsRes.data)
        ) {
          const rawProducts = getProductsRes.data;
          const transformedListings: Listing[] = rawProducts.map(
            (product: any) => ({
              id: product.pid,
              title: product.name,
              image: product.images?.[0] || "/placeholder.svg",
              price: `$${product.price}`,
              stock: product.stock || 0,
              category: product.category || "Uncategorized",
              status: product.status || "ready",
              views: product.views || 0,
              likes: product.likes || 0,
            })
          );
          setListings(transformedListings);
        }

        if (
          getArtisanRes.status === "success" &&
          Array.isArray(getArtisanRes.data)
        ) {
          const rawArtisans = getArtisanRes.data;
          const transformedArtisans: Artisan[] = rawArtisans.map((a: any) => ({
            name: a.business_name || `${a.first_name} ${a.last_name}`,
            businessName: a.business_name || "",
            isVerified: a.is_verified || false,
            walletAddress: a.wallet_address || "",
          }));
          setArtisan(transformedArtisans);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsAddingProduct(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log("Deleting product:", productId);
    // TODO: Implement product deletion
  };

  const handleMarkAsShipped = (orderId: string) => {
    const trackingId = trackingIds[orderId];
    if (trackingId) {
      console.log(
        "Marking order as shipped:",
        orderId,
        "with tracking:",
        trackingId
      );
      // TODO: Implement mark as shipped
    }
  };

  const handleUpdateTracking = (orderId: string, trackingId: string) => {
    setTrackingIds((prev) => ({ ...prev, [orderId]: trackingId }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "out-of-stock":
        return "secondary";
      case "pending":
        return "secondary";
      case "shipped":
        return "default";
      default:
        return "secondary";
    }
  };

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case "held":
        return "secondary";
      case "released":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header with Verification Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl gap-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold ">
              {artisan && artisan[0]?.name
                ? `${artisan[0].name}'s Shop`
                : "Shop"}
            </h1>
            {user.isVerified && (
              <Badge className="bg-amber-600 w-fit">
                <CheckCircle className="mr-1 h-3 w-3" />
                VIP1 Verified
              </Badge>
            )}
          </div>
          <p className=" mt-1 sm:mt-0">
            {user.isVerified
              ? "You are now VIP1"
              : "Complete your profile to get verified"}
          </p>
        </div>

        {!user.isVerified && (
          <div className="text-left sm:text-right">
            <Badge
              variant="outline"
              className="mb-2 border-amber-600 text-amber-600 w-fit"
            >
              <Clock className="mr-1 h-3 w-3" />
              Pending Verification
            </Badge>
            <p className="text-sm text-gray-600">Upload documents to verify</p>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Active Listings
            </CardTitle>
            <div className="rounded-full p-2 bg-amber-100">
              <Package className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {listings && listings.filter((l) => l.stock > 0).length}
            </div>
            <p className="text-xs text-gray-600">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Total Orders
            </CardTitle>
            <div className="rounded-full p-2 bg-amber-100">
              <Users className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {orders && orders.length}
            </div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Revenue
            </CardTitle>
            <div className="rounded-full p-2 bg-amber-100">
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₵135.49</div>
            <p className="text-xs text-gray-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Avg Rating
            </CardTitle>
            <div className="rounded-full p-2 bg-amber-100">
              <Star className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">4.5</div>
            <p className="text-xs text-gray-600">
              From {mockReviews.length} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList className="grid w-full sm:w-[500px] grid-cols-2 sm:grid-cols-3 bg-white shadow rounded-xl p-1">
          <TabsTrigger
            value="listings"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white"
          >
            My Listings
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white"
          >
            Orders Received
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white"
          >
            Feedback
          </TabsTrigger>
        </TabsList>

        {/* Listings Tab */}
        <TabsContent value="listings" className="space-y-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 rounded-t-lg">
              <div>
                <CardTitle className="text-gray-900">
                  Product Listings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your products and inventory
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listings &&
                listings.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-col gap-4 rounded-lg border border-gray-200 p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-16 w-16 rounded-lg bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {product.title}
                        </h3>
                        <Badge
                          variant={getStatusColor(product.status) as any}
                          className="w-fit"
                        >
                          {product.stock > 0 ? "Active" : "Out of Stock"}
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {product.price}
                        </span>
                        <span>Stock: {product.stock}</span>
                        <span>Category: {product.category}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                        <span>{product.views} views</span>
                        <span>{product.likes} likes</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="border-amber-600 text-amber-600 hover:bg-amber-50"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => seSelectedDeleting(product.id)}
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mt-1 text-destructive" />
                      </Button>
                    </div>
                    {selectedDeleting && selectedDeleting === product.id && (
                      <Alert
                        variant="destructive"
                        className="flex items-start gap-4"
                      >
                        <Trash2 className="h-4 w-4 mt-1 text-destructive" />
                        <div>
                          <AlertTitle>Delete Product</AlertTitle>
                          <AlertDescription>
                            Are you sure you want to delete "
                            <strong>{product.title}</strong>"? This action
                            cannot be undone.
                          </AlertDescription>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => seSelectedDeleting(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Alert>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Orders Received</CardTitle>
              <CardDescription className="text-gray-600">
                Manage customer orders and shipping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orders &&
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={order.buyerAvatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {order.buyerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{order.productName}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {order.buyerName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.price}</p>
                        <p className="text-sm text-muted-foreground">
                          Order {order.id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">
                          Shipping Status
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          {order.status === "shipped" ? (
                            <Truck className="h-4 w-4 text-primary" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Escrow Status
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={
                              getEscrowStatusColor(order.escrowStatus) as any
                            }
                          >
                            {order.escrowStatus === "held"
                              ? "Payment Held"
                              : "Payment Released"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">
                        Shipping Address
                      </Label>
                      <p className="text-sm mt-1">{order.shippingAddress}</p>
                    </div>

                    {/* {order.status === "pending" && (
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter tracking ID"
                        value={trackingIds[order.id] || ""}
                        onChange={(e) =>
                          handleUpdateTracking(order.id, e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleMarkAsShipped(order.id)}
                        disabled={!trackingIds[order.id]}
                      >
                        Mark as Shipped
                      </Button>
                    </div>
                  )} */}

                    {/* {order.trackingId && (
                    <div>
                      <Label className="text-muted-foreground">
                        Tracking ID
                      </Label>
                      <p className="text-sm font-mono mt-1">
                        {order.trackingId}
                      </p>
                    </div>
                  )} */}
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Customer Reviews</CardTitle>
              <CardDescription className="text-gray-600">
                See what customers are saying about your products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={review.buyerAvatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {review.buyerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.buyerName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {review.productName}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Product Form Component for Add/Edit Sheet
function ProductForm({
  product,
  onClose,
}: {
  product?: any;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: product?.title || "",
    price: product?.price || "",
    stock: product?.stock || 0,
    category: product?.category || "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving product:", formData);
    // TODO: Implement product save
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label>Product Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="₵0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Stock Quantity</Label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({
                ...formData,
                stock: Number.parseInt(e.target.value),
              })
            }
            min="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="textiles">Textiles & Fabrics</SelectItem>
            <SelectItem value="jewelry">Jewelry & Accessories</SelectItem>
            <SelectItem value="art">Art & Crafts</SelectItem>
            <SelectItem value="home">Home Decor</SelectItem>
            <SelectItem value="fashion">Fashion & Clothing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe your product..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Product Images</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Upload product photos
          </p>
          <Button type="button" variant="outline" size="sm">
            Choose Images
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-amber-600 hover:bg-amber-700"
        >
          {product ? "Update Product" : "Add Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-amber-600 text-amber-600 hover:bg-amber-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
