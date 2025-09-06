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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import Image from "next/image";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Star,
  Heart,
  Share2,
  Copy,
  Printer,
  FileText,
  CreditCard,
  Archive,
  RotateCcw,
  Send,
  Plus,
  Minus,
  ExternalLink,
  Globe,
  Zap,
  Award,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getAll, getSpecific, updateData } from "../provider/supabaseProvider";
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import contractJson from "../../lib/AuthenticityCertificate.json";
interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    customizations?: string[];
  }[];
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
  priority: "low" | "normal" | "high" | "urgent";
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  totalAmount: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  customerNotes?: string;
  estimatedCraftingTime: string;
  actualCraftingTime?: string;
  rating?: number;
  review?: string;
  isRush: boolean;
  isCustom: boolean;
  nftTokenId?: string;
  userAddress?: string;
  communicationHistory: {
    id: string;
    type: "message" | "status_update" | "note";
    content: string;
    timestamp: string;
    sender: "artisan" | "customer" | "system";
  }[];
}

export default function ArtisanOrdersPage() {
  const CERTIFICATE_ABI = contractJson.abi;

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [statusUpdateSheet, setStatusUpdateSheet] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      const getOrdersRes = await getSpecific("orders", {
        artisan_id: session?.user.id,
      });

      const getProductsRes = await getAll("products");
      const getArtisansRes = await getAll("artisan");
      const getUsersRes = await getAll("users");

      if (
        getOrdersRes.status === "success" &&
        Array.isArray(getOrdersRes.data) &&
        getProductsRes.status === "success" &&
        Array.isArray(getProductsRes.data) &&
        getArtisansRes.status === "success" &&
        Array.isArray(getArtisansRes.data) &&
        getUsersRes.status === "success" &&
        Array.isArray(getUsersRes.data)
      ) {
        const rawOrders = getOrdersRes.data;
        const products = getProductsRes.data;
        const artisans = getArtisansRes.data;
        const users = getUsersRes.data;

        const transformedOrders: Order[] = rawOrders.map((rawOrder: any) => {
          const product = products.find(
            (p: any) => p.pid === rawOrder.product_id
          );
          const artisan = artisans.find(
            (a: any) => a.business_id === rawOrder.artisan_id
          );
          const user = users.find((u: any) => u.uid === rawOrder.user_id);

          return {
            id: rawOrder.oid,
            orderNumber: rawOrder.oid,
            customer: {
              id: rawOrder.user_id,
              name: rawOrder.user_name || "",
              email: rawOrder.email || "",
              phone: artisan?.phone || "",
              avatar: "", // You can attach a customer avatar here if available
              address: {
                street: rawOrder.address_line_one,
                city: rawOrder.city,
                state: rawOrder.state,
                zipCode: rawOrder.postal_code,
                country: rawOrder.country,
              },
            },
            items: [
              {
                id: rawOrder.product_id,
                productId: rawOrder.product_id,
                productName: product?.name || "",
                productImage: product?.images?.[0] || "",
                quantity: parseInt(rawOrder.quantity) || 1,
                price: parseFloat(rawOrder.price) || 0,
                customizations: product?.customization_options || [],
              },
            ],
            status: rawOrder.status, // Custom function to map status
            priority: "normal", // You can set this based on logic or leave as default
            orderDate: rawOrder.created_at.split("T")[0],
            expectedDelivery: rawOrder.estimated_delivery || undefined,
            actualDelivery: rawOrder.delivered_date || undefined,
            totalAmount:
              parseFloat(rawOrder.price) * (parseInt(rawOrder.quantity) || 1),
            shippingCost: product?.shipping_cost || 0,
            taxAmount: 0, // Add logic for tax if needed
            discountAmount: 0, // Add logic for discounts if needed
            paymentStatus: "paid", // Adjust based on actual payment status if available
            paymentMethod: "Crypto", // Or "card", etc. if you store this
            shippingMethod: "standard", // Update if you have multiple methods
            trackingNumber: "", // Add if available
            notes: "", // Optional admin notes
            customerNotes: "", // Optional from customer
            estimatedCraftingTime: "N/A",
            actualCraftingTime: product?.crafting_time || "", // Fill when order is done
            rating: rawOrder.rating || undefined,
            review: "", // Fill when review is submitted
            isRush: false, // Based on logic
            isCustom: product?.is_customizable || false,
            communicationHistory: [], // Populate if you track chat/messages
            nftTokenId: product?.nft_token_id || "",
            userAddress: user?.address || "",
          };
        });

        setOrders(transformedOrders);
        setFilteredOrders(transformedOrders);
      }
    };

    fetchOrders();
  }, [session]);

  // Filter and sort orders
  const filterAndSortOrders = () => {
    let filtered = orders;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customer.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((order) => order.priority === priorityFilter);
    }

    // Apply payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === paymentFilter
      );
    }

    // Apply sorting
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
        case "amount-desc":
          return b.totalAmount - a.totalAmount;
        case "amount-asc":
          return a.totalAmount - b.totalAmount;
        case "priority-desc":
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "customer-asc":
          return a.customer.name.localeCompare(b.customer.name);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  // Call filter function on component mount and when dependencies change
  useEffect(() => {
    filterAndSortOrders();
  }, [
    searchQuery,
    statusFilter,
    priorityFilter,
    paymentFilter,
    sortBy,
    orders,
  ]);

  useEffect(() => {
    connectWallet();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const updateDataRes = await updateData(
      "orders",
      {
        oid: orderId,
      },
      {
        status: newStatus,
      }
    );

    if (updateDataRes.status === "success") {
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus as Order["status"],
                communicationHistory: [
                  ...order.communicationHistory,
                  {
                    id: `COMM-${Date.now()}`,
                    type: "status_update",
                    content: `Order status updated to ${newStatus}`,
                    timestamp: new Date().toISOString(),
                    sender: "system",
                  },
                ],
              }
            : order
        )
      );

      toast({
        title: "Order Status Updated Successfully",
        description: `Order status updated to ${newStatus}`,
      });
    }
  };

  const handleSendMessage = (orderId: string, message: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              communicationHistory: [
                ...order.communicationHistory,
                {
                  id: `COMM-${Date.now()}`,
                  type: "message",
                  content: message,
                  timestamp: new Date().toISOString(),
                  sender: "artisan",
                },
              ],
            }
          : order
      )
    );
    setNewMessage("");
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const inProgressOrders = orders.filter(
      (o) => o.status === "pending"
    ).length;
    const completedOrders = orders.filter(
      (o) => o.status === "delivered"
    ).length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const avgOrderValue =
      totalRevenue / orders.filter((o) => o.paymentStatus === "paid").length ||
      0;
    const urgentOrders = orders.filter(
      (o) => o.priority === "urgent" || o.priority === "high"
    ).length;
    const customOrders = orders.filter((o) => o.isCustom).length;

    return {
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalRevenue,
      avgOrderValue,
      urgentOrders,
      customOrders,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Package className="h-4 w-4" />;
      case "ready":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "refunded":
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask");
    const _provider = new ethers.BrowserProvider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const _signer = await _provider.getSigner();
    const contractAddress =
      process.env.NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS;

    if (!contractAddress) return alert("Contract address not set");
    const _contract = new ethers.Contract(
      contractAddress,
      CERTIFICATE_ABI,
      _signer
    );
    setProvider(_provider);
    setSigner(_signer);
    setContract(_contract);
  }

  async function mintCertificate(
    buyer: string,
    craftId: string,
    metadataURI: string
  ): Promise<void> {
    if (!contract || !signer) {
      toast({
        title: "Error",
        description: "Connect wallet first",
      });
      return;
    }

    try {
      // setLoading(true);

      const nextNonce = await provider!.getTransactionCount(
        await signer.getAddress(),
        "pending"
      );

      // Send the transaction
      const tx = await contract.mintCertificate(buyer, craftId, metadataURI, {
        nonce: nextNonce,
      });

      // Wait for it to be mined
      const receipt = await tx.wait();

      // Parse the CertificateMinted event from logs
      const iface = new ethers.Interface(CERTIFICATE_ABI);
      let tokenId: bigint | null = null;

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === "CertificateMinted") {
            tokenId = parsed.args.tokenId as bigint; // ethers v6 returns bigint
            break;
          }
        } catch {
          // Not the event we want
        }
      }

      if (tokenId === null)
        throw new Error("No CertificateMinted event found in logs");

      const updateDataRes = await updateData(
        "orders",
        {
          oid: craftId,
        },
        {
          nft_token_id: tokenId.toString(),
        }
      );

      if (updateDataRes.status === "success") {
        toast({
          title: "Certificate minted",
          description: "Certificate minted successfully",
        });
      }
      //setTokenId(tokenId.toString());
    } catch (err: unknown) {
      console.error("Minting error:", err);
      //alert("Minting failed. See console.");
    } finally {
      // setLoading(false);
    }
  }

  const handleMintDigitalCertificate = async (
    address?: string,
    order?: Order
  ) => {
    if (address === null) {
      toast({
        title: "Customer address not found",
        description: "Customer must add their address.",
        variant: "destructive",
      });
      return;
    }

    console.log(address, order?.id);

    await mintCertificate(address || "", order?.id || "", "https://hellow.com");

    console.log(address);
  };
  const stats = getOrderStats();

  return (
    <TooltipProvider>
      <div className="min-h-screen  p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 p-8">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold">Order Management</h1>
                  <p className="mt-2 text-black">
                    Track and manage your customer orders efficiently
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{stats.totalOrders}</p>
                      <p className="text-sm  text-black">Total Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {stats.inProgressOrders}
                      </p>
                      <p className="text-sm  text-black">In Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        ₵{stats.totalRevenue.toFixed(0)}
                      </p>
                      <p className="text-sm  text-black">Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-16 -top-8 opacity-20">
              <ShoppingCart className="h-32 w-32" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Pending Orders</p>
                    <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                    <p className="text-xs  mt-1">Need attention</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg ">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className=" text-sm font-medium">In Progress</p>
                    <p className="text-3xl font-bold ">
                      {stats.inProgressOrders}
                    </p>
                    <p className="text-xs  mt-1">Being crafted</p>
                  </div>
                  <Package className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg ">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className=" text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold ">
                      {stats.completedOrders}
                    </p>
                    <p className="text-xs  mt-1">Successfully delivered</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg ">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className=" text-sm font-medium">Urgent Orders</p>
                    <p className="text-3xl font-bold ">{stats.urgentOrders}</p>
                    <p className="text-xs mt-1">High priority</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Manual Order
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Orders
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Orders
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Order Analytics
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter & Search Orders
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
              <div className="grid gap-4 md:grid-cols-6">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Orders</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Order #, customer, product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment</Label>
                  <Select
                    value={paymentFilter}
                    onValueChange={setPaymentFilter}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
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
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="amount-desc">
                        Highest Amount
                      </SelectItem>
                      <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                      <SelectItem value="priority-desc">
                        Highest Priority
                      </SelectItem>
                      <SelectItem value="customer-asc">Customer A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Actions</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setPriorityFilter("all");
                        setPaymentFilter("all");
                        setSortBy("date-desc");
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Display */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Orders ({filteredOrders.length})
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                      setPaymentFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    : "space-y-4"
                }
              >
                {filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold tracking-tight w-20 truncate  text-gray-900">
                            {order.orderNumber}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.orderDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${getStatusColor(order.status)} border`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">
                              {order.status.replace("-", " ")}
                            </span>
                          </Badge>
                          <Badge
                            className={`${getPriorityColor(
                              order.priority
                            )} border`}
                          >
                            <span className="capitalize">{order.priority}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Customer Info */}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.customer.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {order.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {order.customer.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {order.customer.email}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send Email</TooltipContent>
                          </Tooltip>
                          {order.customer.phone && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Phone className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Call Customer</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          Order Items
                        </h4>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2 bg-white border rounded-lg"
                          >
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {item.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × ₵{item.price.toFixed(2)}
                              </p>
                              {item.customizations &&
                                item.customizations.length > 0 && (
                                  <div className="mt-1">
                                    {item.customizations.map((custom, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs mr-1"
                                      >
                                        {custom}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Total Amount</p>
                          <p className="font-bold text-lg text-gray-900">
                            ₵{order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment Status</p>
                          <Badge
                            className={
                              order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : order.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-gray-500">Crafting Time</p>
                          <p className="font-medium text-gray-900">
                            {order.actualCraftingTime ||
                              order.estimatedCraftingTime}
                            weeks
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Delivery</p>
                          <p className="font-medium text-gray-900">
                            {order.expectedDelivery
                              ? new Date(
                                  order.expectedDelivery
                                ).toLocaleDateString()
                              : "TBD"}
                          </p>
                        </div>
                      </div>

                      {/* Special Indicators */}
                      <div className="flex gap-2">
                        {order.isRush && (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            <Zap className="h-3 w-3 mr-1" />
                            Rush Order
                          </Badge>
                        )}
                        {order.isCustom && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                            <Star className="h-3 w-3 mr-1" />
                            Custom
                          </Badge>
                        )}
                        {order.rating && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            {order.rating}/5
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                console.log(2222);
                                console.log(order);
                                setSelectedOrder(order);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle className="flex flex-col gap-2">
                                <Package className="h-5 w-5" />
                                Order Details-{selectedOrder?.orderNumber}
                              </SheetTitle>
                              <SheetDescription>
                                Complete order information and communication
                                history
                              </SheetDescription>
                            </SheetHeader>

                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Order Overview */}
                                <div className="grid gap-6">
                                  <Card>
                                    <CardContent className="flex justify-center items-center">
                                      <Image
                                        src={
                                          selectedOrder?.items[0]
                                            .productImage || ""
                                        }
                                        alt={
                                          selectedOrder?.items[0].productName ||
                                          ""
                                        }
                                        width={300}
                                        height={250}
                                        className="mt-5 rounded-md"
                                      />
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Customer Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                          <AvatarImage
                                            src={selectedOrder.customer.avatar}
                                          />
                                          <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {selectedOrder.customer.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium text-gray-900 max-w-44 truncate">
                                            {selectedOrder.customer.name}
                                          </p>
                                          <p className="text-sm text-gray-500 max-w-44 truncate">
                                            {selectedOrder.customer.email}
                                          </p>
                                          {selectedOrder.customer.phone && (
                                            <p className="text-sm text-gray-500">
                                              {selectedOrder.customer.phone}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <Separator />

                                      <div>
                                        <h4 className="font-medium text-gray-900 mb-2">
                                          Shipping Address
                                        </h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                          <p>
                                            {
                                              selectedOrder.customer.address
                                                .street
                                            }
                                          </p>
                                          <p>
                                            {
                                              selectedOrder.customer.address
                                                .city
                                            }
                                            ,{" "}
                                            {
                                              selectedOrder.customer.address
                                                .state
                                            }{" "}
                                            {
                                              selectedOrder.customer.address
                                                .zipCode
                                            }
                                          </p>
                                          <p>
                                            {
                                              selectedOrder.customer.address
                                                .country
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Order Summary
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-gray-500">
                                            Order Date
                                          </p>
                                          <p className="font-medium">
                                            {new Date(
                                              selectedOrder.orderDate
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">
                                            Status
                                          </p>
                                          <Badge
                                            className={`${getStatusColor(
                                              selectedOrder.status
                                            )} border`}
                                          >
                                            {getStatusIcon(
                                              selectedOrder.status
                                            )}
                                            <span className="ml-1 capitalize">
                                              {selectedOrder.status.replace(
                                                "-",
                                                " "
                                              )}
                                            </span>
                                          </Badge>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">
                                            Priority
                                          </p>
                                          <Badge
                                            className={`${getPriorityColor(
                                              selectedOrder.priority
                                            )} border`}
                                          >
                                            <span className="capitalize">
                                              {selectedOrder.priority}
                                            </span>
                                          </Badge>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">
                                            Payment
                                          </p>
                                          <Badge
                                            className={
                                              selectedOrder.paymentStatus ===
                                              "paid"
                                                ? "bg-green-100 text-green-800 border-green-200"
                                                : selectedOrder.paymentStatus ===
                                                  "pending"
                                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                : "bg-red-100 text-red-800 border-red-200"
                                            }
                                          >
                                            {selectedOrder.paymentStatus}
                                          </Badge>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">
                                            Payment Method
                                          </p>
                                          <p className="font-medium">
                                            {selectedOrder.paymentMethod}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">
                                            Shipping Method
                                          </p>
                                          <p className="font-medium">
                                            {selectedOrder.shippingMethod}
                                          </p>
                                        </div>
                                      </div>

                                      {selectedOrder.trackingNumber && (
                                        <div>
                                          <p className="text-gray-500 text-sm">
                                            Tracking Number
                                          </p>
                                          <div className="flex items-center gap-2">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                              {selectedOrder.trackingNumber}
                                            </code>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0"
                                            >
                                              <Copy className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Order Items Detail */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Order Items
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedOrder.items.map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex items-start gap-4 p-4 border rounded-lg"
                                        >
                                          <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Package className="h-8 w-8 text-gray-400" />
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                              {item.productName}
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                              Quantity: {item.quantity} × ₵
                                              {item.price.toFixed(2)} = ₵
                                              {(
                                                item.quantity * item.price
                                              ).toFixed(2)}
                                            </p>
                                            {item.customizations &&
                                              item.customizations.length >
                                                0 && (
                                                <div className="mt-2">
                                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                                    Customizations:
                                                  </p>
                                                  <div className="flex flex-wrap gap-1">
                                                    {item.customizations.map(
                                                      (custom, idx) => (
                                                        <Badge
                                                          key={idx}
                                                          variant="outline"
                                                          className="text-xs"
                                                        >
                                                          {custom}
                                                        </Badge>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    <Separator className="my-4" />

                                    {/* Order Totals */}
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>
                                          ₵
                                          {(
                                            selectedOrder.totalAmount -
                                            selectedOrder.shippingCost -
                                            selectedOrder.taxAmount +
                                            selectedOrder.discountAmount
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Shipping:</span>
                                        <span>
                                          ₵
                                          {selectedOrder.shippingCost.toFixed(
                                            2
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Tax:</span>
                                        <span>
                                          ₵{selectedOrder.taxAmount.toFixed(2)}
                                        </span>
                                      </div>
                                      {selectedOrder.discountAmount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                          <span>Discount:</span>
                                          <span>
                                            -₵
                                            {selectedOrder.discountAmount.toFixed(
                                              2
                                            )}
                                          </span>
                                        </div>
                                      )}
                                      <Separator />
                                      <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>
                                          ₵
                                          {selectedOrder.totalAmount.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Communication History */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <MessageSquare className="h-5 w-5" />
                                      Communication History
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4 max-h-64 overflow-y-auto">
                                      {selectedOrder.communicationHistory.map(
                                        (comm) => (
                                          <div
                                            key={comm.id}
                                            className="flex gap-3"
                                          >
                                            <div className="flex-shrink-0">
                                              <div
                                                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                                  comm.sender === "artisan"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : comm.sender === "customer"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                              >
                                                {comm.sender === "artisan"
                                                  ? "A"
                                                  : comm.sender === "customer"
                                                  ? "C"
                                                  : "S"}
                                              </div>
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium capitalize">
                                                  {comm.sender}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                  {new Date(
                                                    comm.timestamp
                                                  ).toLocaleString()}
                                                </span>
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {comm.type.replace("_", " ")}
                                                </Badge>
                                              </div>
                                              <p className="text-sm text-gray-700">
                                                {comm.content}
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>

                                    <Separator className="my-4" />

                                    {/* Send New Message */}
                                    <div className="space-y-3">
                                      <Label htmlFor="new-message">
                                        Send Message to Customer
                                      </Label>
                                      <Textarea
                                        id="new-message"
                                        placeholder="Type your message here..."
                                        value={newMessage}
                                        onChange={(e) =>
                                          setNewMessage(e.target.value)
                                        }
                                        rows={3}
                                      />
                                      <Button
                                        onClick={() => {
                                          if (newMessage.trim()) {
                                            handleSendMessage(
                                              selectedOrder.id,
                                              newMessage
                                            );
                                          }
                                        }}
                                        disabled={!newMessage.trim()}
                                        className="w-full"
                                      >
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Message
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Order Notes */}
                                {(selectedOrder.notes ||
                                  selectedOrder.customerNotes) && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Notes
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {selectedOrder.customerNotes && (
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">
                                            Customer Notes
                                          </h4>
                                          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                            {selectedOrder.customerNotes}
                                          </p>
                                        </div>
                                      )}
                                      {selectedOrder.notes && (
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">
                                            Internal Notes
                                          </h4>
                                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            {selectedOrder.notes}
                                          </p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Customer Review */}
                                {selectedOrder.review && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        Customer Review
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={star}
                                              className={`h-4 w-4 ${
                                                star <=
                                                (selectedOrder.rating || 0)
                                                  ? "text-yellow-500 fill-current"
                                                  : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                          {selectedOrder.rating}/5 stars
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                                        {selectedOrder.review}
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            )}

                            <SheetFooter className="gap-2">
                              {selectedOrder?.nftTokenId == null && (
                                <Button
                                  onClick={() =>
                                    handleMintDigitalCertificate(
                                      selectedOrder?.userAddress,
                                      selectedOrder || undefined
                                    )
                                  }
                                  variant="outline"
                                  className="mt-4 border-amber-500"
                                >
                                  Mint Digital Certificate
                                </Button>
                              )}

                              <Sheet
                                open={statusUpdateSheet}
                                onOpenChange={setStatusUpdateSheet}
                              >
                                <SheetTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="mt-4 border-amber-500"
                                  >
                                    Update Status
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="w-[400px]">
                                  <SheetHeader>
                                    <SheetTitle>Update Order Status</SheetTitle>
                                    <SheetDescription>
                                      Change the status of order{" "}
                                      {selectedOrder?.orderNumber}
                                    </SheetDescription>
                                  </SheetHeader>
                                  <div className="py-6">
                                    <div className="space-y-4">
                                      <Label htmlFor="status-select">
                                        New Status
                                      </Label>
                                      <Select
                                        value={newStatus}
                                        onValueChange={setNewStatus}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">
                                            Pending
                                          </SelectItem>
                                          <SelectItem value="in-progress">
                                            In Progress
                                          </SelectItem>
                                          <SelectItem value="ready">
                                            Ready
                                          </SelectItem>
                                          <SelectItem value="shipped">
                                            Shipped
                                          </SelectItem>
                                          <SelectItem value="delivered">
                                            Delivered
                                          </SelectItem>
                                          <SelectItem value="cancelled">
                                            Cancelled
                                          </SelectItem>
                                          <SelectItem value="refunded">
                                            Refunded
                                          </SelectItem>
                                          <SelectItem value="in-escrow">
                                            In Escrow
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <SheetFooter className="gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setStatusUpdateSheet(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        if (selectedOrder && newStatus) {
                                          handleStatusUpdate(
                                            selectedOrder.id,
                                            newStatus
                                          );
                                          setNewStatus("");
                                          setStatusUpdateSheet(false);
                                        }
                                      }}
                                      disabled={!newStatus}
                                      className="bg-amber-500 hover:bg-amber-600"
                                    >
                                      Update Status
                                    </Button>
                                  </SheetFooter>
                                </SheetContent>
                              </Sheet>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Quick Actions
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48">
                            <div className="space-y-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => {
                                  const nextStatus =
                                    order.status === "pending"
                                      ? "confirmed"
                                      : order.status === "delivered"
                                      ? "in-progress"
                                      : order.status === "in-progress"
                                      ? "ready"
                                      : order.status === "ready"
                                      ? "shipped"
                                      : order.status === "shipped"
                                      ? "delivered"
                                      : order.status;
                                  if (nextStatus !== order.status) {
                                    handleStatusUpdate(order.id, nextStatus);
                                  }
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Advance Status
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Email Customer
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <Printer className="h-4 w-4 mr-2" />
                                Print Label
                              </Button>
                              <Separator />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Order
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
