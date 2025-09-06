"use client";

import { useEffect, useRef, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Wallet,
  Copy,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  Upload,
  FileText,
  Award,
  Star,
} from "lucide-react";
import VerificationPage from "./ArtisanVerification";
import { useSession } from "next-auth/react";
import {
  getSpecific,
  updateData,
  uploadBusinessCoverImage,
  uploadBusinessProfileImages,
  uploadProductImages,
} from "../provider/supabaseProvider";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
interface Artisan {
  name: string;
  businessName?: string;
  email: string;
  phone?: string;
  location?: string;
  joinDate: string;
  walletAddress?: string;
  isVerified: boolean;
  avatar?: string;
  businessDescription?: string;
  category?: string;
  coverImage?: string;
}

export default function ArtisanProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    location: "",
    businessDescription: "",
    category: "",
  });
  const { data: session } = useSession();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openCover, setOpenCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputCoverRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLoadingFile(true);
      console.log("Selected files:", files);
      // Upload files to Supabase
      const uploadResult = await uploadBusinessProfileImages(Array.from(files));
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

      let avatar = uploadResult.results[0].publicUrl;

      const updateResult = await updateData(
        "artisan",
        { business_id: session?.user.id },
        { business_image: avatar }
      );

      if (updateResult.status === "success") {
        setArtisan((prev) => (prev ? { ...prev, avatar } : prev));
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been updated successfully.",
        });
        setOpen(false);
      }
    }
  };

  const handleCoverFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLoadingFile(true);
      console.log("Selected files:", files);
      // Upload files to Supabase
      const uploadResult = await uploadBusinessCoverImage(Array.from(files));
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

      let coverImage = uploadResult.results[0].publicUrl;

      const updateResult = await updateData(
        "artisan",
        { business_id: session?.user.id },
        { cover_image: coverImage }
      );

      if (updateResult.status === "success") {
        setArtisan((prev) => (prev ? { ...prev, coverImage } : prev));
        toast({
          title: "Business Cover Image Updated",
          description: "Your cover image has been updated successfully.",
        });
        setOpenCover(false);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCoverUploadClick = () => {
    fileInputCoverRef.current?.click();
  };

  const fetchArtisans = async () => {
    try {
      const resData: any = await getSpecific("artisan", {
        business_id: session?.user.id,
      });

      if (resData.status === "success" && Array.isArray(resData.data)) {
        const rawArtisans = resData.data;

        const a = rawArtisans[0];

        const transformedArtisan: Artisan = {
          name: `${a.first_name} ${a.last_name}`.trim(),
          businessName: a.business_name || "",
          email: a.email,
          phone: a.phone || "",
          location: a.city || "Unknown",
          joinDate: a.created_at,
          walletAddress: a.wallet_address || "",
          isVerified: a.is_verified,
          avatar: a.business_image || "/placeholder.svg",
          businessDescription: a.description || "",
          category: a.craft || "",
          coverImage: a.cover_image || "/basicover.jpg",
        };

        setArtisan(transformedArtisan);

        setFormData({
          businessName: transformedArtisan.businessName || "",
          email: transformedArtisan.email || "",
          phone: transformedArtisan.phone || "",
          location: transformedArtisan.location || "",
          businessDescription: transformedArtisan.businessDescription || "",
          category: transformedArtisan.category || "",
        });
      } else {
        throw new Error("Failed to fetch artisan data");
      }
    } catch (err) {
      console.error("Error fetching artisans:", err);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, [session?.user.id]);

  const copyWalletAddress = () => {
    if (artisan?.walletAddress) {
      navigator.clipboard.writeText(artisan.walletAddress);
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];

        const updateDataRes = await updateData(
          "artisan",
          { business_id: session?.user.id },
          { wallet_address: walletAddress }
        );

        if (updateDataRes.status === "success") {
          setArtisan((prev) => (prev ? { ...prev, walletAddress } : prev));
          setOpen(false);

          toast({
            title: "Wallet Connected",
            description: "Your wallet has been connected successfully.",
          });
        }
      } else {
        alert("No Ethereum wallet found. Please install MetaMask.");
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const disconnectWallet = async () => {
    try {
      const updateDataRes = await updateData(
        "artisan",
        {
          business_id: session?.user.id,
        },
        { wallet_address: "" }
      );

      if (updateDataRes.status === "success") {
        setArtisan((prev) => (prev ? { ...prev, walletAddress: "" } : prev));
        toast({
          title: "Wallet Disconnected",
          description: "Wallet has been disconnected successfully.",
        });
      }
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    }
  };

  const handleSave = () => {
    // TODO: Implement profile update
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      businessName: artisan?.businessName || "",
      email: artisan?.email || "",
      phone: artisan?.phone || "",
      location: artisan?.location || "",
      businessDescription: artisan?.businessDescription || "",
      category: artisan?.category || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-60 border relative">
          <Image
            src={artisan?.coverImage || "/basicover.jpg"}
            alt="Cover Image"
            fill
            className="object-cover"
          />
          <Dialog open={openCover} onOpenChange={setOpenCover}>
            <DialogTrigger asChild>
              <Edit className="mr-2 h-6 w-6 absolute bg-amber-500 z-10 text-white border border-white rounded-lg p-1 bottom-8 right-0 cursor-pointer" />
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <div className="p-4">
                <Button
                  variant="outline"
                  onClick={handleCoverUploadClick}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to select cover image
                  </span>
                </Button>

                <input
                  ref={fileInputCoverRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col -top-4 lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 shadow-lg ">
                <AvatarImage
                  src={artisan?.avatar || "/placeholder.svg"}
                  alt={artisan?.name || ""}
                />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-2xl font-bold">
                  {(artisan?.name || "").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Edit className="mr-2 h-6 w-6 absolute bg-amber-500 z-10 text-white border border-white rounded-lg p-1 bottom-0 right-0 cursor-pointer" />
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <div className="p-4">
                    <Button
                      variant="outline"
                      onClick={handleUploadClick}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Click to select profile image
                      </span>
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {artisan?.businessName || `${artisan?.name || ""}'s Shop`}
                </h1>
                {artisan?.isVerified ? (
                  <Badge className="bg-amber-600 text-white w-fit">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    VIP1 Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-600 text-amber-600 w-fit"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Verification
                  </Badge>
                )}
              </div>
              <p className="text-gray-700 mt-1">
                Member since {artisan?.joinDate.slice(0, 10)}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Building className="h-5 w-5 text-amber-600" />
                Business Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Business Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessName: e.target.value,
                        })
                      }
                      placeholder="Enter business name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {artisan?.businessName || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Email Address</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {artisan?.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {artisan?.phone || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Location</Label>
                  {isEditing ? (
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Enter location"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {artisan?.location || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Product Category</Label>
                  {isEditing ? (
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select category</option>
                      <option value="textiles">Textiles & Fabrics</option>
                      <option value="jewelry">Jewelry & Accessories</option>
                      <option value="art">Art & Crafts</option>
                      <option value="home">Home Decor</option>
                      <option value="fashion">Fashion & Clothing</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {artisan?.category || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Business Description</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.businessDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessDescription: e.target.value,
                      })
                    }
                    placeholder="Tell customers about your craft and story..."
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-gray-900">
                    {artisan?.businessDescription || "No description provided"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Documents */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="h-5 w-5 text-amber-600" />
                Verification Documents
              </CardTitle>
              <CardDescription className="text-gray-600">
                Can to verify your identity
              </CardDescription>
            </CardHeader>

            <VerificationPage />
          </Card>

          {/* Wallet Connection */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Wallet className="h-5 w-5 text-amber-600" />
                Wallet Connection
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your blockchain wallet for payments and NFTs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {artisan?.walletAddress ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">
                        Connected Wallet
                      </p>
                      <p className="font-mono text-sm text-gray-800 mt-1">
                        {artisan?.walletAddress.slice(0, 6)}...
                        {artisan?.walletAddress.slice(-4)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyWalletAddress}
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copiedWallet ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security Settings
                    </Button>
                    <Button
                      variant="outline"
                      onClick={disconnectWallet}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Wallet Connected
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Connect your wallet to receive payments and manage NFTs
                  </p>
                  <Button
                    onClick={connectWallet}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Business Stats */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Business Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">4.5</p>
                <p className="text-sm text-green-600">Average Rating</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-800">12</p>
                <p className="text-sm text-purple-600">Products Listed</p>
              </div>
            </CardContent>
          </Card>

          {/* Verification Benefits */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">
                Verification Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Priority customer support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Featured in search results</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Lower transaction fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Early access to new features</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button
                variant="outline"
                className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                <Upload className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
              <Button
                variant="outline"
                className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button
                variant="outline"
                className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
