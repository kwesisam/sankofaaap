"use client";

import { useState } from "react";
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
  TrendingUp,
  Award,
} from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    joinDate: string;
    walletAddress?: string;
    isVerified: boolean;
    avatar?: string;
  };
}

export default function UserProfile({
  user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
    walletAddress: "0x742d35Cc6634C0532925a3b8D404A3d72b1A9876",
    isVerified: true,
    avatar: "/diverse-user-avatars.png",
  },
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",
  });

  const copyWalletAddress = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  const handleSave = () => {
    // TODO: Implement profile update
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      location: user.location || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-20 w-20 shadow-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user.name}
              </h1>
              {user.isVerified && (
                <Badge className="bg-amber-600 text-white w-fit">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified Buyer
                </Badge>
              )}
            </div>
            <p className="text-gray-700 mt-1">
              Member since {user.joinDate}
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
              <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <User className="h-5 w-5 text-amber-600" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.name}</p>
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
                    <p className="text-gray-900 font-medium">{user.email}</p>
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
                      {user.phone || "Not provided"}
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
                      {user.location || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label className="text-gray-700">Bio</Label>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallet Connection */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Wallet className="h-5 w-5 text-amber-600" />
                Wallet Connection
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your blockchain wallet connection
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {user.walletAddress ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">
                        Connected Wallet
                      </p>
                      <p className="font-mono text-sm text-gray-800 mt-1">
                        {user.walletAddress.slice(0, 6)}...
                        {user.walletAddress.slice(-4)}
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
                    <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Settings
                    </Button>
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
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
                    Connect your wallet to start trading and collecting NFTs
                  </p>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Account Stats */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Account Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">4.8</p>
                <p className="text-sm text-green-600">Buyer Rating</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-800">3</p>
                <p className="text-sm text-purple-600">Orders Completed</p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Email Notifications</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-notifications" defaultChecked className="rounded" />
                  <Label htmlFor="email-notifications" className="text-sm text-gray-600">
                    Receive order updates and promotions
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">SMS Notifications</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sms-notifications" className="rounded" />
                  <Label htmlFor="sms-notifications" className="text-sm text-gray-600">
                    Receive shipping updates via SMS
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
