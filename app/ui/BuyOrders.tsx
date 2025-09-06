"use client";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { confirmDelivery as conDelivery, getEscrow } from "@/lib/escrow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Image,
  ExternalLink,
  PackageCheck,
  X,
  Shield,
  MapPin,
  Eye,
  Filter,
  Search,
  Calendar,
  DollarSign,
  ArrowUpDown,
  MessageSquare,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getAll, getSpecific, updateData } from "../provider/supabaseProvider";
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";

interface Order {
  id: string;
  productName: string;
  productImage: string;
  artisanName: string;
  artisanAvatar: string;
  price: string;
  priceNumeric: number;
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
  trackingId?: string;
  orderDate: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  nftPreview?: string;
  nftReceived?: string;
  canReview?: boolean;
  progress: number;
  rating?: number;
  category: string;
  escrow_id: string;
}

// Mock orders data

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [cancelReason, setCancelReason] = useState("");
  const [mediationReason, setMediationReason] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [confirmDelivery, setConfirmDelivery] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    const getOrdersRes = await getSpecific("orders", {
      user_id: session?.user.id,
    });

    const getProductsRes = await getAll("products");
    const getArtisansRes = await getAll("artisan");

    if (
      getOrdersRes.status === "success" &&
      Array.isArray(getOrdersRes.data) &&
      getProductsRes.status === "success" &&
      Array.isArray(getProductsRes.data) &&
      getArtisansRes.status === "success" &&
      Array.isArray(getArtisansRes.data)
    ) {
      const rawOrders = getOrdersRes.data;
      const rawProducts = getProductsRes.data;
      const rawArtisans = getArtisansRes.data;

      const transformedOrders: Order[] = rawOrders.map((order: any) => {
        const matchingProduct = rawProducts.find(
          (product: any) => product.pid === order.product_id
        );
        const matchingArtisan = rawArtisans.find(
          (artisan: any) => artisan.business_id === order.artisan_id
        );

        return {
          id: order.oid,
          productName: matchingProduct?.name || "",
          productImage: matchingProduct?.images[0] || "",
          artisanName: matchingArtisan?.business_name || "",
          artisanAvatar: matchingArtisan?.business_image || "",
          price: order.price,
          priceNumeric: parseFloat(order.price),
          status: order.status,
          orderDate: order.created_at.split("T")[0],
          deliveredDate: order.delivered_date,
          estimatedDelivery: order.estimated_delivery,
          nftReceived: order.nft_received,
          nftPreview: order.nft_preview,
          canReview: order.can_review,
          escrow_id: order.escrow_id,
          progress:
            order.status === "in-escrow"
              ? 20
              : order.status == "pending"
              ? 25
              : order.status === "shipped"
              ? 40
              : order.status === "complete"
              ? 60
              : order.status === "in-mediation"
              ? 30
              : 100,
          rating: order.rating,
          category: matchingProduct?.category || "",
        };
      });

      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [session]);

  // Filter and sort orders
  const filterAndSortOrders = () => {
    let filtered = [...orders]; // clone to avoid mutation

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );
        case "date-asc":
          return (
            new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
          );
        case "price-desc":
          return b.priceNumeric - a.priceNumeric;
        case "price-asc":
          return a.priceNumeric - b.priceNumeric;
        case "name-asc":
          return a.productName.localeCompare(b.productName);
        case "name-desc":
          return b.productName.localeCompare(a.productName);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  // Update filters when dependencies change
  // useState(() => {
  //   filterAndSortOrders();
  // });
  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchQuery, statusFilter, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-escrow":
        return <Clock className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "complete":
        return <CheckCircle className="h-4 w-4" />;
      case "in-mediation":
        return <AlertTriangle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-escrow":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "complete":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-mediation":
        return "bg-red-100 text-red-800 border-red-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in-escrow":
        return "Payment Secured";
      case "shipped":
        return "In Transit";
      case "complete":
        return "Delivered";
      case "in-mediation":
        return "Under Review";
      case "cancelled":
        return "Cancelled";
      default:
        return "Processing";
    }
  };

  const handleConfirmDelivery = async (orderId: string, order: Order) => {
    setIsLoading(true);
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to proceed.",
          variant: "destructive",
        });
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner(); // buyer account
      const buyerAddress = await signer.getAddress();

      const txHash = await conDelivery(signer, order.escrow_id);

      const updateDataRes = await updateData(
        "orders",
        {
          oid: order.id,
        },
        {
          status: "confirmed",
        }
      );

      if (updateDataRes.status === "success") {
        toast({
          title: "Order Confirmed Successfully",
          description: `Order has been confirmed`,
          variant: "default",
        });

        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "delivered" as const,
                  progress: 100,
                  deliveredDate: new Date().toISOString().split("T")[0],
                  canReview: true,
                }
              : order
          )
        );
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        title: "Error",
        description: `Could not create escrow: ${
          err?.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestMediation = (orderId: string, reason: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: "in-mediation" as const }
          : order
      )
    );
    setMediationReason("");
  };

  const handleCancelOrder = (orderId: string, reason: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: "cancelled" as const, progress: 0 }
          : order
      )
    );
    setCancelReason("");
  };

  const handleSubmitReview = (
    orderId: string,
    rating: number,
    text: string
  ) => {
    console.log("Submitting review for order:", orderId, { rating, text });
    setReviewText("");
    setReviewRating(5);
    // TODO: Implement review submission
  };

  const getOrderStats = () => {
    const activeOrders = orders.filter((o) =>
      ["in-escrow", "shipped"].includes(o.status)
    ).length;
    const completedOrders = orders.filter(
      (o) => o.status === "delivered"
    ).length;
    const totalSpent = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.priceNumeric, 0);
    const inMediation = orders.filter(
      (o) => o.status === "in-mediation"
    ).length;

    return { activeOrders, completedOrders, totalSpent, inMediation };
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl p-3 sm:p-8 bg-gradient-to-b from-amber-50 to-amber-100 text-black">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">My Orders</h1>
                <p className="mt-2">
                  Track and manage all your African craft purchases
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.activeOrders}</p>
                    <p className="text-sm ">Active Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {stats.completedOrders}
                    </p>
                    <p className="text-sm ">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      ₵{stats.totalSpent.toFixed(2)}
                    </p>
                    <p className="text-sm ">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 p-3 sm:p-8 lg:grid-cols-4">
          <Card className="border-0 shadow-lg ">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className=" text-sm font-medium">Active Orders</p>
                  <p className="text-3xl font-bold ">{stats.activeOrders}</p>
                </div>
                <Package className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold">{stats.completedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className=" text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold ">
                    ₵{stats.totalSpent.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Need Help</p>
                  <p className="text-3xl font-bold">{stats.inMediation}</p>
                </div>
                <AlertTriangle className="h-8 w-8 " />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 m-3 sm:m-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Orders</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by product, artisan, or order ID..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      filterAndSortOrders();
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status Filter</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    filterAndSortOrders();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="in-escrow">In Escrow</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="complete">Completed</SelectItem>
                    <SelectItem value="in-mediation">In Mediation</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    filterAndSortOrders();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="price-desc">Highest Price</SelectItem>
                    <SelectItem value="price-asc">Lowest Price</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={filterAndSortOrders} className="w-full bg-amber-500 hover:bg-amber-600">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="border-0 m-3 sm:m-8 shadow-xl">
          <CardHeader className=" rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Orders ({filteredOrders.length})
                </CardTitle>
                <CardDescription className="">
                  Manage your purchases and track deliveries
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20  hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-2 sm:p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="border-2  transition-all duration-200 sm:hover:shadow-lg"
                  >
                    <CardContent className="p-3 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="h-20 w-20 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                          <Package className="h-8 w-8 " />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-2 sm:space-y-0">
                              <h3 className="font-bold text-lg text-gray-900">
                                {order.productName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Order ID: {order.id}
                              </p>
                            </div>
                            <div className="sm:text-right space-y-2 sm:space-y-1">
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} border px-3 py-1`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="ml-2">
                                  {getStatusText(order.status)}
                                </span>
                              </Badge>
                              <p className="text-lg font-bold text-green-600">
                                GHC {order.price}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-400 text-white text-xs">
                                  {order.artisanName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                by {order.artisanName}
                              </span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <span>Ordered {order.orderDate}</span>
                            {order.estimatedDelivery && (
                              <>
                                <Separator
                                  orientation="vertical"
                                  className="h-4"
                                />
                                <span>
                                  Est. delivery {order.estimatedDelivery}
                                </span>
                              </>
                            )}
                          </div>

                          {order.status !== "cancelled" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  Order Progress
                                </span>
                                <span className="font-medium">
                                  {order.progress}%
                                </span>
                              </div>
                              <Progress
                                value={order.progress}
                                className="h-2"
                              />
                            </div>
                          )}

                          {order.trackingId && (
                            <div className="rounded-lg bg-blue-50 p-3">
                              <p className="text-sm text-blue-800">
                                <Truck className="inline h-4 w-4 mr-2" />
                                Tracking:{" "}
                                <span className="font-mono font-medium">
                                  {order.trackingId}
                                </span>
                              </p>
                            </div>
                          )}

                          {order.nftPreview && (
                            <div className="flex items-center space-x-2 text-sm rounded-lg bg-purple-50 p-3">
                              <Image className="h-4 w-4 text-purple-600" />
                              <span className="text-purple-800 font-medium">
                                NFT Certificate Ready
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex flex-wrap gap-2">
                        {/* Delivery Confirmation Alert for Shipped Orders */}
                        {order.status === "shipped" && (
                          <Alert className="flex-1 border-green-200 bg-green-50">
                            <PackageCheck className="h-5 w-5 text-green-600" />
                            <div className="ml-3 flex-1">
                              <AlertTitle className="text-green-800">
                                Ready to Confirm?
                              </AlertTitle>
                              <AlertDescription className="text-green-700 mb-3">
                                Received your "{order.productName}"? Confirm to
                                release payment and mint your NFT.
                              </AlertDescription>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-300 text-green-700"
                                >
                                  Not Yet
                                </Button>
                                {confirmDelivery === order.id ? (
                                  <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                      Confirm delivery of "{order.productName}"?
                                      This will release funds to the artisan and
                                      complete the order.
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setConfirmDelivery(null)}
                                        disabled={isLoading}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={isLoading}
                                        onClick={() => {
                                          handleConfirmDelivery(
                                            order.id,
                                            order
                                          );
                                          setConfirmDelivery(null);
                                        }}
                                      >
                                        Yes, Confirm
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => setConfirmDelivery(order.id)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      "Confirm Delivery"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Alert>
                        )}

                        <div className="flex gap-2 ml-auto flex-wrap">
                          {/* Cancel Order - Only for in-escrow status */}
                          {order.status === "in-escrow" && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-300 text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Order
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">
                                      Cancel Order
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Please tell us why you want to cancel this
                                      order.
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="cancel-reason">
                                      Reason for cancellation
                                    </Label>
                                    <Textarea
                                      id="cancel-reason"
                                      placeholder="Please provide a reason..."
                                      value={cancelReason}
                                      onChange={(e) =>
                                        setCancelReason(e.target.value)
                                      }
                                      className="min-h-[80px]"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() => setCancelReason("")}
                                    >
                                      Cancel
                                    </Button>
                                    {confirmCancel === order.id ? (
                                      <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                          Are you sure? Funds will be returned
                                          but you won't receive the product or
                                          NFT.
                                        </p>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() =>
                                              setConfirmCancel(null)
                                            }
                                          >
                                            Keep Order
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => {
                                              handleCancelOrder(
                                                order.id,
                                                cancelReason
                                              );
                                              setConfirmCancel(null);
                                              setCancelReason("");
                                            }}
                                          >
                                            Yes, Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="flex-1"
                                        disabled={!cancelReason.trim()}
                                        onClick={() =>
                                          setConfirmCancel(order.id)
                                        }
                                      >
                                        Confirm Cancel
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}

                          {/* Request Mediation - For shipped and in-escrow orders */}
                          {(order.status === "shipped" ||
                            order.status === "in-escrow") && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Get Help
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">
                                      Request Mediation
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Our team will help resolve any issues with
                                      your order.
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="mediation-reason">
                                      Describe the issue
                                    </Label>
                                    <Textarea
                                      id="mediation-reason"
                                      placeholder="What seems to be the problem?"
                                      value={mediationReason}
                                      onChange={(e) =>
                                        setMediationReason(e.target.value)
                                      }
                                      className="min-h-[80px]"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() => setMediationReason("")}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                                      disabled={!mediationReason.trim()}
                                      onClick={() =>
                                        handleRequestMediation(
                                          order.id,
                                          mediationReason
                                        )
                                      }
                                    >
                                      Request Help
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}

                          {/* Track Order - For shipped orders */}
                          {order.trackingId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `https://track.example.com/${order.trackingId}`,
                                  "_blank"
                                )
                              }
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              Track Package
                            </Button>
                          )}

                          {/* Leave Review - For completed orders */}
                          {order.canReview && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                >
                                  <Star className="mr-2 h-4 w-4" />
                                  Leave Review
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">
                                      Rate Your Experience
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Help other buyers by sharing your thoughts
                                      on "{order.productName}".
                                    </p>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <Label>Rating</Label>
                                      <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`h-5 w-5 cursor-pointer transition-colors ${
                                              star <= reviewRating
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                            }`}
                                            onClick={() =>
                                              setReviewRating(star)
                                            }
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="review-text">
                                        Your Review
                                      </Label>
                                      <Textarea
                                        id="review-text"
                                        placeholder="Share your experience with this product and artisan..."
                                        value={reviewText}
                                        onChange={(e) =>
                                          setReviewText(e.target.value)
                                        }
                                        className="min-h-[80px]"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() => {
                                        setReviewText("");
                                        setReviewRating(5);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                                      disabled={!reviewText.trim()}
                                      onClick={() =>
                                        handleSubmitReview(
                                          order.id,
                                          reviewRating,
                                          reviewText
                                        )
                                      }
                                    >
                                      Submit Review
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}

                          {/* Contact Artisan - For active orders */}
                          {(order.status === "in-escrow" ||
                            order.status === "shipped") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message Artisan
                            </Button>
                          )}

                          {/* View Details - Always available */}
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Button>

                          {/* Reorder - For completed orders */}
                          {order.status === "delivered" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reorder
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

        {/* Quick Actions */}
        <Card className="border-0 m-4 sm:m-8 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and helpful resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <Package className="h-6 w-6" />
                <span>Browse Products</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <Download className="h-6 w-6" />
                <span>Export Orders</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span>Contact Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
