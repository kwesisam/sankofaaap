"use client";

import React, { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CreditCard,
  Bell,
  Shield,
  Settings,
  Moon,
  Sun,
  Smartphone,
  DollarSign,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MapPin,
  Package,
  Heart,
  Star,
  Filter,
  Wallet,
  Copy,
  ExternalLink,
  Zap,
} from "lucide-react";
import { updateData } from "../provider/supabaseProvider";
import { useSession } from "next-auth/react";

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "mobile_money" | "paypal";
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
}

interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newArtisans: boolean;
  priceDrops: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  emailNewsletter: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

interface PreferenceSettings {
  currency: string;
  language: string;
  theme: "light" | "dark" | "system";
  autoReorder: boolean;
  saveWishlist: boolean;
  showRecommendations: boolean;
}

interface WalletConnection {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
  walletType: "metamask" | "walletconnect" | "coinbase" | null;
}

const BuyerSettings = () => {
  const { data: session } = useSession();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa ending in 1234",
      details: "**** **** **** 1234",
      isDefault: true,
      isVerified: true,
    },
    {
      id: "2",
      type: "mobile_money",
      name: "MTN Mobile Money",
      details: "+233 20 *** 6543",
      isDefault: false,
      isVerified: true,
    },
  ]);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "home",
      name: "Home Address",
      street: "123 Independence Avenue",
      city: "Accra",
      state: "Greater Accra",
      zipCode: "00233",
      country: "Ghana",
      isDefault: true,
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: false,
    newArtisans: true,
    priceDrops: true,
    smsNotifications: true,
    pushNotifications: true,
    emailNewsletter: false,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 60,
  });

  const [preferences, setPreferences] = useState<PreferenceSettings>({
    currency: "GHS",
    language: "en",
    theme: "system",
    autoReorder: false,
    saveWishlist: true,
    showRecommendations: true,
  });

  const [showCardDetails, setShowCardDetails] = useState(false);
  const [wallet, setWallet] = useState<WalletConnection>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: null,
    walletType: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const handleAddPaymentMethod = () => {
    toast({
      title: "Add Payment Method",
      description: "Payment method addition feature will be implemented.",
    });
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.filter((method) => method.id !== methodId)
    );
    toast({
      title: "Payment Method Removed",
      description: "Payment method has been removed successfully.",
    });
  };

  const handleSetDefaultPayment = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
    toast({
      title: "Default Payment Updated",
      description: "Default payment method has been updated.",
    });
  };

  const handleAddAddress = () => {
    toast({
      title: "Add Address",
      description: "Address addition feature will be implemented.",
    });
  };

  const handleRemoveAddress = (addressId: string) => {
    setAddresses((prev) => prev.filter((address) => address.id !== addressId));
    toast({
      title: "Address Removed",
      description: "Address has been removed successfully.",
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses((prev) =>
      prev.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      }))
    );
    toast({
      title: "Default Address Updated",
      description: "Default shipping address has been updated.",
    });
  };

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (
    key: keyof SecuritySettings,
    value: boolean | number
  ) => {
    setSecurity((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (
    key: keyof PreferenceSettings,
    value: string | boolean
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const connectWallet = async (
    walletType: "metamask" | "walletconnect" | "coinbase"
  ) => {
    setIsConnecting(true);
    try {
      if (walletType === "metamask") {
        if (typeof window !== "undefined" && (window as any).ethereum) {
          // const accounts = await (window as any).ethereum.request({
          //   method: 'eth_requestAccounts'
          // })
          // const chainId = await (window as any).ethereum.request({
          //   method: 'eth_chainId'
          // })
          // const balance = await (window as any).ethereum.request({
          //   method: 'eth_getBalance',
          //   params: [accounts[0], 'latest']
          // })

          // setWallet({
          //   address: accounts[0],
          //   isConnected: true,
          //   chainId: parseInt(chainId, 16),
          //   balance: (parseInt(balance, 16) / 1e18).toFixed(4),
          //   walletType: 'metamask'
          // })

          const provider = (window as any).ethereum;

          const megaTestnetChainId = "0x18C6";

          const megaTestnetParams = {
            chainId: megaTestnetChainId,
            chainName: "MEGA Testnet",
            nativeCurrency: {
              name: "MEGA Testnet Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://carrot.megaeth.com/rpc"],
            blockExplorerUrls: ["https://megaexplorer.xyz"],
          };

          try {
            // Attempt to switch to MEGA Testnet
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: megaTestnetChainId }],
            });
          } catch (switchError: any) {
            // If MEGA Testnet is not added, try to add it
            if (switchError.code === 4902) {
              try {
                await provider.request({
                  method: "wallet_addEthereumChain",
                  params: [megaTestnetParams],
                });
              } catch (addError) {
                console.error("Failed to add MEGA Testnet:", addError);
                toast({
                  title: "Network Error",
                  description: "Could not add MEGA Testnet to MetaMask.",
                  variant: "destructive",
                });
                return;
              }
            } else {
              console.error("Error switching network:", switchError);
              return;
            }
          }

          const accounts = await provider.request({
            method: "eth_requestAccounts",
          });
          const chainId = await provider.request({ method: "eth_chainId" });
          const balance = await provider.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          });

 
          const updateAddressRes = await updateData(
            "users",
            {
              uid: session?.user.id,
            },
            {
              address: accounts[0],
            }
          );

          console.log(updateAddressRes);
          setWallet({
            address: accounts[0],
            isConnected: true,
            chainId: parseInt(chainId, 16),
            balance: (parseInt(balance, 16) / 1e18).toFixed(4),
            walletType: "metamask",
          });



          if (updateAddressRes.error) {
            toast({
              title: "Error",
              description: updateAddressRes.error,
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Wallet Connected",
            description: `Connected to MetaMask: ${accounts[0].slice(
              0,
              6
            )}...${accounts[0].slice(-4)}`,
          });
        } else {
          toast({
            title: "MetaMask Not Found",
            description: "Please install MetaMask to connect your wallet.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Coming Soon",
          description: `${walletType} integration will be available soon.`,
        });
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    const updateAddressRes = await updateData(
      "users",
      {
        uid: session?.user.id,
      },
      {
        address: "",
      }
    );
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      balance: null,
      walletType: null,
    });
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  return (
    <div className=" mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences, payment methods, and shopping
          settings
        </p>
      </div>

      <Tabs defaultValue="payment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="payment">Payment & Shipping</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Payment & Shipping Tab */}
        <TabsContent value="payment" className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods for seamless checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {method.type === "card" ? (
                        <CreditCard className="w-5 h-5 text-white" />
                      ) : method.type === "mobile_money" ? (
                        <Smartphone className="w-5 h-5 text-white" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{method.name}</h3>
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        {method.isVerified ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {showCardDetails
                            ? method.details
                            : method.details.replace(/\d(?=\d{4})/g, "*")}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => setShowCardDetails(!showCardDetails)}
                        >
                          {showCardDetails ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultPayment(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Remove Payment Method
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this payment method?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}

              <Button
                onClick={handleAddPaymentMethod}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Addresses
              </CardTitle>
              <CardDescription>
                Manage your delivery addresses for faster checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{address.name}</h3>
                        {address.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.city}, {address.state}{" "}
                        {address.zipCode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultAddress(address.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Address</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this address?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveAddress(address.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}

              <Button
                onClick={handleAddAddress}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          {/* Wallet Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Crypto Wallet
              </CardTitle>
              <CardDescription>
                Connect your crypto wallet to make payments with digital
                currencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!wallet.isConnected ? (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Wallet className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Wallet Connected
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Connect your crypto wallet to enable cryptocurrency
                      payments
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Button
                      onClick={() => connectWallet("metamask")}
                      disabled={isConnecting}
                      className="w-full justify-start h-12"
                      variant="outline"
                    >
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">M</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">MetaMask</div>
                        <div className="text-sm text-muted-foreground">
                          Connect using MetaMask wallet
                        </div>
                      </div>
                      {isConnecting && (
                        <div className="ml-auto animate-spin">⏳</div>
                      )}
                    </Button>

                    <Button
                      onClick={() => connectWallet("walletconnect")}
                      disabled={isConnecting}
                      className="w-full justify-start h-12"
                      variant="outline"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">W</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">WalletConnect</div>
                        <div className="text-sm text-muted-foreground">
                          Connect using WalletConnect protocol
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => connectWallet("coinbase")}
                      disabled={isConnecting}
                      className="w-full justify-start h-12"
                      variant="outline"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Coinbase Wallet</div>
                        <div className="text-sm text-muted-foreground">
                          Connect using Coinbase Wallet
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Connected Wallet Info */}
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-800">
                            Wallet Connected
                          </h3>
                          <p className="text-sm text-green-600 capitalize">
                            {wallet.walletType} Wallet
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Connected
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">
                          Address:
                        </span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-white px-2 py-1 rounded border">
                            {wallet.address?.slice(0, 6)}...
                            {wallet.address?.slice(-4)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyAddress}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {wallet.balance && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">
                            Balance:
                          </span>
                          <span className="text-sm font-mono">
                            {wallet.balance} ETH
                          </span>
                        </div>
                      )}

                      {wallet.chainId && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">
                            Network:
                          </span>
                          <span className="text-sm">
                            {wallet.chainId === 1
                              ? "Ethereum Mainnet"
                              : wallet.chainId === 5
                              ? "Goerli Testnet"
                              : wallet.chainId === 137
                              ? "Polygon"
                              : `Chain ID: ${wallet.chainId}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wallet Actions */}
                  <div className="grid gap-3">
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Block Explorer
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="w-4 h-4 mr-2" />
                      Transaction History
                    </Button>

                    <Separator />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          Disconnect Wallet
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Disconnect Wallet</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to disconnect your wallet?
                            You'll need to reconnect to make crypto payments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={disconnectWallet}>
                            Disconnect
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Crypto Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Crypto Payment Preferences</CardTitle>
              <CardDescription>
                Configure your cryptocurrency payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Auto-approve small transactions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve transactions under ₵50
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Gas fee notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when gas fees are high
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Preferred Gas Speed</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (Lower fees)</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="fast">Fast (Higher fees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about orders, deals, and
                updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Order Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about order confirmations, shipping, and
                    delivery
                  </p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("orderUpdates", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Price Drops & Deals</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when items in your wishlist go on sale
                  </p>
                </div>
                <Switch
                  checked={notifications.priceDrops}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("priceDrops", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Artisans</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new artisans join the marketplace
                  </p>
                </div>
                <Switch
                  checked={notifications.newArtisans}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("newArtisans", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via SMS
                  </p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("smsNotifications", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get browser push notifications for real-time updates
                  </p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("pushNotifications", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Promotional Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional offers and marketplace updates
                  </p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("promotions", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Protect your account with additional security measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      handleSecurityChange("twoFactorAuth", checked)
                    }
                  />
                  {security.twoFactorAuth ? (
                    <Lock className="w-4 h-4 text-green-600" />
                  ) : (
                    <Unlock className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch
                  checked={security.loginAlerts}
                  onCheckedChange={(checked) =>
                    handleSecurityChange("loginAlerts", checked)
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Session Timeout (minutes)
                </Label>
                <Select
                  value={security.sessionTimeout.toString()}
                  onValueChange={(value) =>
                    handleSecurityChange("sessionTimeout", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>
                Manage your password and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Download Recovery Codes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Shopping Preferences
              </CardTitle>
              <CardDescription>
                Customize your shopping experience and interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value: "light" | "dark" | "system") =>
                    handlePreferenceChange("theme", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) =>
                    handlePreferenceChange("language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="tw">Twi</SelectItem>
                    <SelectItem value="ga">Ga</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={preferences.currency}
                  onValueChange={(value) =>
                    handlePreferenceChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GHC">GHC (Ghanaian Cedi)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Save Wishlist</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save items you like to your wishlist
                  </p>
                </div>
                <Switch
                  checked={preferences.saveWishlist}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("saveWishlist", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Recommendations</Label>
                  <p className="text-sm text-muted-foreground">
                    Display personalized product recommendations
                  </p>
                </div>
                <Switch
                  checked={preferences.showRecommendations}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("showRecommendations", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Reorder</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically reorder frequently purchased items
                  </p>
                </div>
                <Switch
                  checked={preferences.autoReorder}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("autoReorder", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Control your privacy settings and data usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data & Privacy</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Cookie Preferences
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Actions</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Deactivate Account
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers.
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerSettings;
