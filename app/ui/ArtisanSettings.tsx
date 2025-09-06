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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Building,
  DollarSign,
  Package,
  Truck,
} from "lucide-react";

export default function ArtisanSettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = () => {
    // TODO: Implement password change
    console.log("Changing password:", formData);
    setIsEditing(false);
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Business Settings
          </h1>
          <p className="text-gray-700 mt-1">
            Manage your business preferences and security settings
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Settings className="mr-2 h-4 w-4" />
              Edit Settings
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
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security Settings */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="h-5 w-5 text-amber-600" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    disabled={!isEditing}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={!isEditing}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      placeholder="Enter new password"
                      disabled={!isEditing}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={!isEditing}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm new password"
                      disabled={!isEditing}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={!isEditing}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Password Requirements:</p>
                      <ul className="space-y-1 text-amber-700">
                        <li>• At least 8 characters long</li>
                        <li>• Contains uppercase and lowercase letters</li>
                        <li>• Includes numbers and special characters</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Preferences */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Building className="h-5 w-5 text-amber-600" />
                Business Preferences
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure your business operations and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-600" />
                  Product Management
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="auto-approve"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="auto-approve" className="text-sm text-gray-700">
                      Auto-approve new products
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="low-stock-alerts"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="low-stock-alerts" className="text-sm text-gray-700">
                      Low stock notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="inventory-tracking"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="inventory-tracking" className="text-sm text-gray-700">
                      Automatic inventory tracking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="product-analytics"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="product-analytics" className="text-sm text-gray-700">
                      Product performance analytics
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-amber-600" />
                  Shipping & Fulfillment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shipping-notifications"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="shipping-notifications" className="text-sm text-gray-700">
                      Shipping status updates
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="delivery-confirmations"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="delivery-confirmations" className="text-sm text-gray-700">
                      Delivery confirmations
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="return-management"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="return-management" className="text-sm text-gray-700">
                      Return management system
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shipping-insurance"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="shipping-insurance" className="text-sm text-gray-700">
                      Shipping insurance options
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  Payment & Pricing
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="payment-notifications"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="payment-notifications" className="text-sm text-gray-700">
                      Payment received alerts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="price-change-alerts"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="price-change-alerts" className="text-sm text-gray-700">
                      Price change notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="tax-calculation"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="tax-calculation" className="text-sm text-gray-700">
                      Automatic tax calculation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="currency-conversion"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="currency-conversion" className="text-sm text-gray-700">
                      Multi-currency support
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Bell className="h-5 w-5 text-amber-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-600" />
                  Email Notifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="email-orders"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="email-orders" className="text-sm text-gray-700">
                      New order notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="email-customers"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="email-customers" className="text-sm text-gray-700">
                      Customer inquiries
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="email-marketing"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="email-marketing" className="text-sm text-gray-700">
                      Marketing promotions
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="email-support"
                      defaultChecked
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="email-support" className="text-sm text-gray-700">
                      Support updates
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-amber-600" />
                  SMS Notifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="sms-orders"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="sms-orders" className="text-sm text-gray-700">
                      New order alerts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="sms-shipping"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="sms-shipping" className="text-sm text-gray-700">
                      Shipping updates
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Lock className="h-5 w-5 text-amber-600" />
                Privacy Settings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Business Profile Visibility</h4>
                    <p className="text-sm text-gray-600">
                      Control who can see your business information
                    </p>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="public">Public</option>
                    <option value="customers">Customers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Order History</h4>
                    <p className="text-sm text-gray-600">
                      Allow customers to see your completed orders
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="order-history"
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Analytics Sharing</h4>
                    <p className="text-sm text-gray-600">
                      Help improve our service with anonymous usage data
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="analytics"
                    defaultChecked
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Customer Reviews</h4>
                    <p className="text-sm text-gray-600">
                      Display customer reviews on your profile
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="customer-reviews"
                    defaultChecked
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Theme</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="light-theme"
                    name="theme"
                    value="light"
                    defaultChecked
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <Label htmlFor="light-theme" className="flex items-center gap-2 text-sm text-gray-700">
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="dark-theme"
                    name="theme"
                    value="dark"
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <Label htmlFor="dark-theme" className="flex items-center gap-2 text-sm text-gray-700">
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="auto-theme"
                    name="theme"
                    value="auto"
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <Label htmlFor="auto-theme" className="flex items-center gap-2 text-sm text-gray-700">
                    <Globe className="h-4 w-4" />
                    Auto (System)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Language</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="ar">العربية</option>
                <option value="sw">Kiswahili</option>
                <option value="yo">Yorùbá</option>
                <option value="ig">Igbo</option>
                <option value="ha">Hausa</option>
              </select>
            </CardContent>
          </Card>

          {/* Business Tools */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Business Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing & Subscription
              </Button>
              <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
                <Building className="mr-2 h-4 w-4" />
                Business Analytics
              </Button>
              <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
                <Package className="mr-2 h-4 w-4" />
                Inventory Management
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="text-gray-900">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
                <Shield className="mr-2 h-4 w-4" />
                Verification Status
              </Button>
              <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                Deactivate Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
