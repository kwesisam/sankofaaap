"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Edit3,
  Save,
  X,
  Camera,
  Award,
  ShoppingBag,
  Heart,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
} from "lucide-react";
import { getSpecific } from "../provider/supabaseProvider";
import { useSession } from "next-auth/react";

interface BuyerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  interests: string[];
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  favoriteArtisans: number;
  profileImage?: string;
  isVerified: boolean;
  membershipTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  loyaltyPoints: number;
}

interface Order {
  id: string;
  artisanName: string;
  productName: string;
  amount: number;
  status: "completed" | "pending" | "shipped" | "cancelled";
  date: string;
  image: string;
}

interface FavoriteArtisan {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  totalOrders: number;
}

interface UserProfile {
  id: number;
  uid: string;
  address: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  profile_image: string | null;
  created_at: string;
}

const BuyerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [buyerData, setBuyerData] = useState<BuyerData>({
    id: "1",
    name: "Akosua Mensah",
    email: "akosua.mensah@example.com",
    phone: "+233 20 987 6543",
    location: "Accra, Ghana",
    bio: "Passionate collector of authentic African art and crafts. I love supporting local artisans and discovering unique pieces that tell stories of our rich cultural heritage.",
    interests: [
      "Traditional Crafts",
      "Kente Textiles",
      "Wood Carvings",
      "Jewelry",
      "Home Decor",
    ],
    joinDate: "2021-08-20",
    totalOrders: 24,
    totalSpent: 3450.0,
    favoriteArtisans: 8,
    profileImage: "/artisans2.png",
    isVerified: true,
    membershipTier: "Gold",
    loyaltyPoints: 2450,
  });

  const [editData, setEditData] = useState<BuyerData>(buyerData);

  const [recentOrders] = useState<Order[]>([
    {
      id: "1",
      artisanName: "Kwame Asante",
      productName: "Traditional Kente Cloth",
      amount: 250.0,
      status: "completed",
      date: "2024-01-15",
      image: "/beads.png",
    },
    {
      id: "2",
      artisanName: "Ama Serwaa",
      productName: "Hand-carved Wooden Mask",
      amount: 180.0,
      status: "shipped",
      date: "2024-01-10",
      image: "/bag.png",
    },
    {
      id: "3",
      artisanName: "Kofi Mensah",
      productName: "Beaded Jewelry Set",
      amount: 95.0,
      status: "pending",
      date: "2024-01-08",
      image: "/beads.png",
    },
  ]);

  const [favoriteArtisans] = useState<FavoriteArtisan[]>([
    {
      id: "1",
      name: "Kwame Asante",
      specialty: "Kente Weaving",
      rating: 4.9,
      image: "/artisans1.png",
      totalOrders: 5,
    },
    {
      id: "2",
      name: "Ama Serwaa",
      specialty: "Wood Carving",
      rating: 4.8,
      image: "/artisans2.png",
      totalOrders: 3,
    },
    {
      id: "3",
      name: "Kofi Mensah",
      specialty: "Jewelry Making",
      rating: 4.7,
      image: "/artisans1.png",
      totalOrders: 4,
    },
  ]);

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

   
      }
    };

    fetchData();
  }, [session]);

  const handleEdit = () => {
    setEditData(buyerData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setBuyerData(editData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData(buyerData);
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof BuyerData,
    value: string | string[]
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInterestAdd = (interest: string) => {
    if (interest.trim() && !editData.interests.includes(interest.trim())) {
      setEditData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest.trim()],
      }));
    }
  };

  const handleInterestRemove = (interest: string) => {
    setEditData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "bg-orange-100 text-orange-800";
      case "Silver":
        return "bg-gray-100 text-gray-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header Section */}
      <div className="relative mb-8">
        <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          {!isEditing && (
            <Button
              onClick={handleEdit}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
              variant="outline"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={buyerData.profileImage} alt={buyerData.name} />
              <AvatarFallback className="text-2xl font-bold">
                {buyerData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                variant="secondary"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="pt-20 px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{userData?.full_name}</h1>
                {buyerData.isVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={getTierColor(buyerData.membershipTier)}
                >
                  {buyerData.membershipTier} Member
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{buyerData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Member since{" "}
                    {new Date(buyerData.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{buyerData.loyaltyPoints} points</span>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{buyerData.totalOrders}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Spent
                </p>
                <p className="text-2xl font-bold">
                  ₵{buyerData.totalSpent.toLocaleString()}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Favorite Artisans
                </p>
                <p className="text-2xl font-bold">
                  {buyerData.favoriteArtisans}
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Loyalty Points
                </p>
                <p className="text-2xl font-bold">{buyerData.loyaltyPoints}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="favorites">Favorite Artisans</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={userData?.full_name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{userData?.full_name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={userData?.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{userData?.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{buyerData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{buyerData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    placeholder="Tell artisans about yourself and what kind of crafts you love..."
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm leading-relaxed">{buyerData.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                View your recent purchases and order status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={order.image}
                          alt={order.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{order.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {order.artisanName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₵{order.amount}</p>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(order.status)}
                      >
                        {order.status === "completed" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {order.status === "pending" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {order.status === "shipped" && (
                          <Package className="w-3 h-3 mr-1" />
                        )}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Artisans</CardTitle>
              <CardDescription>
                Artisans you've favorited and frequently purchase from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteArtisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={artisan.image} alt={artisan.name} />
                      <AvatarFallback>
                        {artisan.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{artisan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {artisan.specialty}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{artisan.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {artisan.totalOrders} orders
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Interests</CardTitle>
              <CardDescription>
                Manage your interests to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(isEditing ? editData.interests : buyerData.interests).map(
                    (interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {interest}
                        {isEditing && (
                          <button
                            onClick={() => handleInterestRemove(interest)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    )
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an interest..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleInterestAdd(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        handleInterestAdd(input.value);
                        input.value = "";
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      {isEditing && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuyerProfile;
