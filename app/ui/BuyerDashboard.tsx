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
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Image,
  ExternalLink,
  PackageCheck,
  Copy,
  Wallet,
  TrendingUp,
  Award,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getSpecific } from "../provider/supabaseProvider";

interface UserProfile {
  id: number;
  uid: string;
  address: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  profile_image: string | null;
  created_at: string; // ISO timestamp
}

interface Order {
  id: string; // e.g. rawOrder.oid
  productId: string;
  productName: string;
  productImage?: string;
  artisanId: string;
  artisanName: string;
  customerName: string;
  customerWallet: string;
  price: number;
  quantity: number;
  status: "pending" | "in-escrow" | "shipped" | "complete" | "cancelled";
  orderDate: string; // YYYY-MM-DD
  estimatedDelivery?: string;
  deliveredDate?: string;
  nftTokenId: string;
  trackingId?: string;
  progress?: number; // % progress if you want to show
  rating?: number;
  review?: string;
}

// Mock data - in real app this would come from API

export default function BuyerDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserProfile | null>();
  const [orderData, setOrderData] = useState<Order[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      const getUserRes = await getSpecific("users", {
        uid: session?.user.id,
      });

      const getOrdersRes = await getSpecific("orders", {
        user_id: session?.user.id,
      });

      if (
        getOrdersRes.status === "success" &&
        Array.isArray(getOrdersRes.data) &&
        getUserRes.status === "success" &&
        Array.isArray(getUserRes.data)
      ) {
        const rawOrders = getOrdersRes.data;
        const user = getUserRes.data[0];

        console.log(user, rawOrders);
        setUserData(user);

        const transformedOrders: Order[] = rawOrders.map((rawOrder: any) => {
          return {
            id: rawOrder.oid,
            productId: rawOrder.product_id,
            productName: rawOrder.product_name || "",
            productImage: rawOrder.product_image || "", // adjust field if available
            artisanId: rawOrder.artisan_id,
            artisanName: rawOrder.artisan_name,
            customerName: rawOrder.user_name,
            customerWallet: rawOrder.user_id,
            price: parseFloat(rawOrder.price) || 0,
            quantity: parseInt(rawOrder.quantity) || 1,
            status: (rawOrder.status as Order["status"]) || "pending",
            orderDate: rawOrder.created_at?.split("T")[0] || "",
            estimatedDelivery: rawOrder.estimated_delivery || undefined,
            deliveredDate: rawOrder.delivered_date || undefined,
            nftTokenId: rawOrder.nft_token_id,
            trackingId: rawOrder.tracking_number || "",
            progress: rawOrder.progress || 0,
            rating: rawOrder.rating || undefined,
            review: rawOrder.review || "",
          };
        });

        setOrderData(transformedOrders);

        // const transformedOrders: Order[] = rawOrders.map((rawOrder: any) => {
        //   const product = products.find(
        //     (p: any) => p.pid === rawOrder.product_id
        //   );
        //   const artisan = artisans.find(
        //     (a: any) => a.business_id === rawOrder.artisan_id
        //   );
        //   const user = users.find((u: any) => u.uid === rawOrder.user_id);

        //   return {
        //     id: rawOrder.oid,
        //     orderNumber: rawOrder.oid,
        //     customer: {
        //       id: rawOrder.user_id,
        //       name: rawOrder.user_name || "",
        //       email: rawOrder.email || "",
        //       phone: artisan?.phone || "",
        //       avatar: "", // You can attach a customer avatar here if available
        //       address: {
        //         street: rawOrder.address_line_one,
        //         city: rawOrder.city,
        //         state: rawOrder.state,
        //         zipCode: rawOrder.postal_code,
        //         country: rawOrder.country,
        //       },
        //     },
        //     items: [
        //       {
        //         id: rawOrder.product_id,
        //         productId: rawOrder.product_id,
        //         productName: product?.name || "",
        //         productImage: product?.images?.[0] || "",
        //         quantity: parseInt(rawOrder.quantity) || 1,
        //         price: parseFloat(rawOrder.price) || 0,
        //         customizations: product?.customization_options || [],
        //       },
        //     ],
        //     status: rawOrder.status, // Custom function to map status
        //     priority: "normal", // You can set this based on logic or leave as default
        //     orderDate: rawOrder.created_at.split("T")[0],
        //     expectedDelivery: rawOrder.estimated_delivery || undefined,
        //     actualDelivery: rawOrder.delivered_date || undefined,
        //     totalAmount:
        //       parseFloat(rawOrder.price) * (parseInt(rawOrder.quantity) || 1),
        //     shippingCost: product?.shipping_cost || 0,
        //     taxAmount: 0, // Add logic for tax if needed
        //     discountAmount: 0, // Add logic for discounts if needed
        //     paymentStatus: "paid", // Adjust based on actual payment status if available
        //     paymentMethod: "Crypto", // Or "card", etc. if you store this
        //     shippingMethod: "standard", // Update if you have multiple methods
        //     trackingNumber: "", // Add if available
        //     notes: "", // Optional admin notes
        //     customerNotes: "", // Optional from customer
        //     estimatedCraftingTime: "N/A",
        //     actualCraftingTime: product?.crafting_time || "", // Fill when order is done
        //     rating: rawOrder.rating || undefined,
        //     review: "", // Fill when review is submitted
        //     isRush: false, // Based on logic
        //     isCustom: product?.is_customizable || false,
        //     communicationHistory: [], // Populate if you track chat/messages
        //     nftTokenId: product?.nft_token_id || "",
        //     userAddress: user?.address || "",
        //   };
        // });

        // setOrders(transformedOrders);
        // setFilteredOrders(transformedOrders);
      }
    };

    fetchData();
  }, [session]);

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
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-escrow":
        return "secondary";
      case "shipped":
        return "default";
      case "complete":
        return "default";
      case "in-mediation":
        return "destructive";
      default:
        return "secondary";
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
      default:
        return "Processing";
    }
  };

  const handleConfirmDelivery = (orderId: string) => {
    console.log("Confirming delivery for order:", orderId);
    // TODO: Implement delivery confirmation
  };

  const handleRequestMediation = (orderId: string) => {
    console.log("Requesting mediation for order:", orderId);
    // TODO: Implement mediation request
  };

  // const copyWalletAddress = () => {
  //   if (user.walletAddress) {
  //     navigator.clipboard.writeText(user.walletAddress);
  //     setCopiedWallet(true);
  //     setTimeout(() => setCopiedWallet(false), 2000);
  //   }
  // };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "Rare":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Epic":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Legendary":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-none space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 p-4 sm:p-6 lg:p-8 text-gray-900">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Welcome back 
                </h1>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">
                  Discover authentic African craftsmanship and build your NFT
                  collection
                </p>
              </div>
              <div className="block lg:hidden">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Total Portfolio Value
                    </p>
                    <p className="text-xl font-bold text-gray-900">₵286.74</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Total Portfolio Value
                    </p>
                    <p className="text-2xl font-bold text-gray-900">₵286.74</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 sm:-right-16 -top-8 opacity-20">
            <Package className="h-24 w-24 sm:h-32 sm:w-32 text-amber-600" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Active Orders
              </CardTitle>
              <div className="rounded-full p-2 bg-amber-100">
                <Package className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {orderData.length}
              </div>
              <p className="text-xs flex items-center mt-1 text-gray-600">
                <TrendingUp className="h-3 w-3 mr-1 text-amber-600" />
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                NFTs Collected
              </CardTitle>
              <div className="rounded-full p-2 bg-amber-100">
                <Image className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {orderData &&
                  orderData.filter((a) => a.nftTokenId !== "").length}
              </div>
              <p className="text-xs text-gray-600">Authenticity certificates</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Total Spent
              </CardTitle>
              <div className="rounded-full p-2 bg-amber-100 text-amber-600 text-sm font-bold">
                ₵
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">₵255.49</div>
              <p className="text-xs text-gray-600">Across 3 orders</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Reviews Given
              </CardTitle>
              <div className="rounded-full p-2 bg-amber-100">
                <Star className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">1</div>
              <p className="text-xs text-gray-600">Help artisans grow</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex bg-white shadow rounded-xl p-1">
            <TabsTrigger
              value="orders"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white"
            >
              My Orders
            </TabsTrigger>
            \
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gray-50 text-gray-900 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Package className="h-5 w-5 text-amber-600" />
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Track your purchases and manage deliveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-baseline">
                {orderData &&
                  orderData.map((order) => (
                    <Card
                      key={order.id}
                      className="border-2  transition-all duration-200 hover:shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden shadow flex-shrink-0">
                            <Package className="h-8 w-8 text-amber-600" />
                          </div>

                          <div className="flex-1 space-y-3 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-lg text-gray-900">
                                {order.productName}
                              </h3>
                              <Badge
                                variant={getStatusColor(order.status) as any}
                                className="px-3 py-1"
                              >
                                {getStatusIcon(order.status)}
                                <span className="ml-2">
                                  {getStatusText(order.status)}
                                </span>
                              </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-xs">
                                    {order.artisanName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  by {order.artisanName}
                                </span>
                              </div>
                              <div className="hidden sm:block">
                                <Separator
                                  orientation="vertical"
                                  className="h-4"
                                />
                              </div>
                              <span className="font-bold text-green-600">
                                {order.price}
                              </span>
                              <div className="hidden sm:block">
                                <Separator
                                  orientation="vertical"
                                  className="h-4"
                                />
                              </div>
                              <span>Ordered {order.orderDate}</span>
                            </div>

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

                            {/* {order.nftPreview && (
                              <div className="flex items-center space-x-2 text-sm rounded-lg bg-purple-50 p-3">
                                <Image className="h-4 w-4 text-purple-600" />
                                <span className="text-purple-800 font-medium">
                                  NFT Certificate Ready
                                </span>
                              </div>
                            )} */}
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-col gap-3">
                          {order.status === "shipped" && (
                            <Alert className="w-full border-green-200 bg-green-50">
                              <PackageCheck className="h-5 w-5 text-green-600" />
                              <div className="ml-3 flex-1">
                                <AlertTitle className="text-green-800">
                                  Ready to Confirm?
                                </AlertTitle>
                                <AlertDescription className="text-green-700 mb-3">
                                  Received your "{order.productName}"? Confirm
                                  to release payment and mint your NFT.
                                </AlertDescription>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-300 text-green-700"
                                  >
                                    Not Yet
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() =>
                                      handleConfirmDelivery(order.id)
                                    }
                                  >
                                    Confirm Delivery
                                  </Button>
                                </div>
                              </div>
                            </Alert>
                          )}

                          <div className="flex flex-col sm:flex-row gap-2">
                            {(order.status === "shipped" ||
                              order.status === "in-escrow") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRequestMediation(order.id)}
                                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Request Help
                              </Button>
                            )}

                            {/* {order.canReview && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                              >
                                <Star className="mr-2 h-4 w-4" />
                                Leave Review
                              </Button>
                            )} */}

                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
