"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { addData, updateData } from "@/app/provider/supabaseProvider";

import { ethers } from "ethers";
import { config } from "@/lib/config";
import { confirmDelivery, createEscrow } from "@/lib/contracts";

interface ProductAttribute {
  name: string;
  value: string;
}

interface Artisan {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  artisan: Artisan;
  attributes: ProductAttribute[];
  hasNFT: boolean;
  nftAddress: string;
  inStock: boolean;
  stock: number;
  wallet_address: string;
}
interface CheckoutButtonProps {
  product: Product;
}

export default function CheckoutButton({ product }: CheckoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  console.log("wallet_address",product.wallet_address);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    quantity: "1",
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };





  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Connect to MetaMask
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
      console.log("Connected buyer account:", buyerAddress);

      // Generate unique escrow ID
      const uniqueEscrowId = `UIQNE-${Date.now()}`;

      // Validate shipping info
      if (
        !shippingAddress.name ||
        !shippingAddress.addressLine1 ||
        !shippingAddress.city ||
        !shippingAddress.country
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required shipping fields.",
          variant: "destructive",
        });
        return;
      }

      // Create the escrow on-chain
      const txHash = await createEscrow(
        signer,
        uniqueEscrowId,
        "0x41A4b0f01b0cA002486EFfBB2C6785dD30Cedc42",
        "0.002"
      );

      // Wait for the transaction to be mined

      const shippingInfo = {
        oid: `ORD-${Date.now()}`,
        product_id: product.id,
        artisan_id: product.artisan.id,
        product_name: product.title,
        artisan_name: product.artisan.name,
        price: product.price,
        quantity: shippingAddress.quantity,
        receiver: shippingAddress.name,
        email: session?.user?.email,
        user_name: session?.user?.name,
        user_id: session?.user?.id,
        address_line_one: shippingAddress.addressLine1,
        address_line_two: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.country,
        status: "in-escrow",
        is_cancelled: false,
        is_completed: false,
        is_delivered: false,
        escrow_id: uniqueEscrowId,
      };

      const resData = await addData("orders", shippingInfo);

      console.log(resData);

      if (resData.status === "success") {
        const updateStock = await updateData(
          "products",
          {
            pid: product.id,
          },
          { stock: product.stock - parseInt(shippingAddress.quantity) }
        );

        if (updateStock.status === "success") {
          toast({
            title: "Order Created",
            description: `Order has been created. Redirecting to payment...`,
          });
        } else {
          console.log("Failed to update stock");
        }
      }

      console.log("Escrow created successfully, shipping info:", shippingInfo);

      toast({
        title: "Escrow Created",
        description: `Transaction hash: ${txHash}`,
        variant: "default",
      });
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
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full bg-amber-600 hover:bg-amber-700"
          disabled={!product?.inStock || product.wallet_address == ""}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {product.inStock
            ? `Buy Now - ${product.currency} ${product.price.toFixed(2)}`
            : "Out of Stock"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your purchase of "{product.title}"
          </DialogDescription>
        </DialogHeader>

        {!session ? (
          // Show login prompt inside dialog
          <div className="p-4 text-center">
            <p className="mb-4 text-gray-600">
              You need to log in to purchase this product.
            </p>
            <Button
              onClick={() => (window.location.href = "/signin")}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{product.title}</span>
                <span className="font-bold">
                  {product.currency} {product.price.toFixed(2)} ||{" "}
                  {product.stock} in stock
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Shipping Address</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={shippingAddress.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={(e) =>
                      handleInputChange("addressLine1", e.target.value)
                    }
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) =>
                      handleInputChange("addressLine2", e.target.value)
                    }
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  defaultValue={1}
                  min={1}
                  max={product.stock}
                  value={shippingAddress.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  placeholder="Qty"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Accra"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Country *</Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Ghana"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {session && (
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Complete Purchase - ${product.currency} ${(
                  product.price * parseInt(shippingAddress.quantity)
                ).toFixed(2)}`
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// if (confirmRes.ok) {
//   console.log("Delivery confirmed:", confirmData);
// } else {
//   console.error("Failed to confirm delivery:", confirmData);
// }

// const escrow = await escrowRes.json();
// console.log("Escrow:", escrow);

// const shippingInfo = {
//   oid: `ORD-${Date.now()}`,
//   product_id: product.id,
//   artisan_id: product.artisan.id,
//   product_name: product.title,
//   artisan_name: product.artisan.name,
//   price: product.price,
//   quantity: shippingAddress.quantity,
//   receiver: shippingAddress.name,
//   email: session?.user?.email,
//   user_name: session?.user?.name,
//   user_id: session?.user?.id,
//   address_line_one: shippingAddress.addressLine1,
//   address_line_two: shippingAddress.addressLine2,
//   city: shippingAddress.city,
//   state: shippingAddress.state,
//   postal_code: shippingAddress.postalCode,
//   country: shippingAddress.country,
//   status: "in-escrow",
//   is_cancelled: false,
//   is_completed: false,
//   is_delivered: false,
//   escrow_address: "",
// };

// console.log("Shipping Address:", shippingInfo);

// const resData = await addData("orders", shippingInfo);

// console.log(resData);

// if (resData.status === "success") {
//   const updateStock = await updateData(
//     "products",
//     {
//       pid: product.id,
//     },
//     { stock: product.stock - parseInt(shippingAddress.quantity) }
//   );

//   if (updateStock.status === "success") {
//     toast({
//       title: "Order Created",
//       description: `Order has been created. Redirecting to payment...`,
//     });
//   } else {
//     console.log("Failed to update stock");
//   }
// }

// // Create order
// // const response = await fetch("/api/orders", {
// //   method: "POST",
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// //   body: JSON.stringify({
// //     productId: product.id,
// //     quantity: 1,
// //     shippingAddress,
// //   }),
// // });

// // if (!response.ok) {
// //   throw new Error("Failed to create order");
// // }

// // const order = await response.json();

// // // In a real implementation, this would redirect to payment processing
// // // For MVP, we'll simulate the escrow creation
// // toast({
// //   title: "Order Created",
// //   description: `Order ${order.orderId} has been created. Redirecting to payment...`,
// // });

// // Simulate redirect to payment
// setTimeout(() => {
//   setIsOpen(false);
//   // In real app: router.push(`/checkout/${order.orderId}`)
// }, 2000);

// const provider = new ethers.JsonRpcProvider(
//   "https://ethereum-sepolia-rpc.publicnode.com"
// );
// const balance = await provider.getBalance(
//   "0x82c34003D0AA7bCd6bbA4187aEAe410563eE26fA"
// );
// console.log(
//   "Escrow contract balance:",
//   ethers.formatEther(balance),
//   "ETH"
// );

// try {
//   // --- Create escrow ---
//   const escrowRes = await fetch("/api/escrow/create", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       escrowId: "samescrow10",
//       sellerAddress: "0x82c34003D0AA7bCd6bbA4187aEAe410563eE26fA",
//       amount: "0.002",
//     }),
//   });

//   const escrowData = await escrowRes.json();
//   console.log("Create escrow response:", escrowData);

//   if (!escrowData.success) {
//     console.error("Failed to create escrow:", escrowData.error);
//     return;
//   }

//   // --- Fetch escrow details from chain ---
//   const details = await getEscrowDetails("samescrow9");
//   console.log("Escrow details from chain:", details);
// } catch (error) {
//   console.error("Error creating or fetching escrow:", error);
// }

// Call the function
