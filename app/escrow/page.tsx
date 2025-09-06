"use client";

import { useEffect, useState } from "react";
import { Wallet, JsonRpcProvider } from "ethers";
import { createEscrow, confirmDelivery } from "@/lib/escrow";
import {
  useFollowButton,
  TransactionProvider,
  fetchAllFollowersYouKnow,
  FullWidthProfile,
  TransactionModal ,
  Avatar,
  FollowersAndFollowing,
} from "ethereum-identity-kit";
import { useAccount } from "wagmi";
import { FollowerTag } from "ethereum-identity-kit";
import FollowButton from "ethereum-identity-kit";
import "ethereum-identity-kit/css";

// Sepolia RPC and buyer private key from environment variables
const SEPOLIA_RPC = process.env.NEXT_PUBLIC_RPC_URL!;
const BUYER_PRIVATE_KEY = process.env.ESCROW_PRIVATE_KEY!;

export default function EscrowPage() {
  const [escrowId, setEscrowId] = useState("");
  const [seller, setSeller] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [followers, setFollowers] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Custom Follow Button Component
      useEffect(() => {
      setIsClient(true);
    },[])
  function CustomFollowButton({ lookupAddress }: { lookupAddress: `0x${string}` }) {
    const { address: connectedAddress } = useAccount();



    const buttonProps = useFollowButton({
      lookupAddress: lookupAddress, // Use the prop instead of hardcoded value
      connectedAddress,
    });



    const handleClick = async () => {
      console.log("Follow button clicked!", buttonProps);
      
      // Check if wallet is connected
      if (!connectedAddress) {
        console.error("Wallet not connected");
        setMessage("Please connect your wallet first");
        return;
      }

      // Check if handleAction exists and is a function
      if (!buttonProps.handleAction || typeof buttonProps.handleAction !== 'function') {
        console.error("handleAction is not available or not a function");
        setMessage("Follow action not available");
        return;
      }

      try {
        await buttonProps.handleAction();
        console.log("Follow action completed");
        setMessage("Follow/unfollow completed successfully!");
      } catch (err) {
        console.error("Error during follow:", err);
        setMessage(`Follow error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    // Show connection status
    if (!connectedAddress) {
      return (
        <div className="bg-gray-100 p-2 w-full text-center">
          <p className="text-gray-600">Please connect wallet to follow</p>
        </div>
      );
    }

    return (
      <button
        onClick={buttonProps.handleAction}
        disabled={buttonProps.isDisabled}
        aria-label={buttonProps.ariaLabel}
        aria-pressed={buttonProps.ariaPressed}
        className={`p-2 w-full ${
          buttonProps.isDisabled 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-purple-500 hover:bg-purple-600'
        } text-white`}
      >
        {buttonProps.isLoading ? "Processing..." : buttonProps.buttonText}
      </button>
    );
  }

  // Static signer using private key + Alchemy RPC
  function getSigner() {
    const provider = new JsonRpcProvider(SEPOLIA_RPC);
    return new Wallet(BUYER_PRIVATE_KEY, provider);
  }

  const handleCreate = async () => {
    try {
      setMessage("Creating escrow...");
      const signer = getSigner();
      const txHash = await createEscrow(signer, escrowId, seller, amount);
      setMessage(`Escrow created! Tx: ${txHash}`);
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err?.reason || err?.message || "Unknown error"}`);
    }
  };

  const handleConfirm = async () => {
    try {
      setMessage("Confirming delivery...");
      const signer = getSigner();
      const txHash = await confirmDelivery(signer, escrowId);
      setMessage(`Delivery confirmed! Tx: ${txHash}`);
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err?.reason || err?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Escrow & Follow Demo</h1>
      
      {/* Escrow Section */}
      <div className="space-y-4 border-b pb-4">
        <h2 className="text-lg font-semibold">Escrow Management</h2>
        <input
          placeholder="Escrow ID"
          value={escrowId}
          onChange={(e) => setEscrowId(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Seller Address"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white p-2 w-full hover:bg-blue-600"
        >
          Create Escrow
        </button>

        <button
          onClick={handleConfirm}
          className="bg-green-500 text-white p-2 w-full hover:bg-green-600"
        >
          Confirm Delivery
        </button>
      </div>

      {/* Follow Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Follow Management</h2>
        
        {isClient == true ? (
          <TransactionProvider>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Custom Follow Button:</p>
              <CustomFollowButton lookupAddress="0x66e2755d2Ad79eDD8506Dd55fA72A4D9eF9660Be" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Follower Tags:</p>
              <FollowerTag
                lookupAddressOrName="0x66e2755d2Ad79eDD8506Dd55fA72A4D9eF9660Be"
                connectedAddress="0xf5EB53dB21A49F7d52BdD2e1D7A0a789019Ce69B"
                showLoading={true}
              />

              {/* <FollowerTag
                lookupAddressOrName="0x983110309620d911731ac0932219af06091b6744"
                connectedAddress="0xc983ebc9db969782d994627bdffec0ae6efee1b3"
                showLoading={true}
              /> */}
            </div>

            <FullWidthProfile addressOrName="0xf5EB53dB21A49F7d52BdD2e1D7A0a789019Ce69B" />
            <Avatar address="0xf5EB53dB21A49F7d52BdD2e1D7A0a789019Ce69B"  />
            <FollowersAndFollowing user="vitalik.eth" defaultTab="followers" connectedAddress="0xf5EB53dB21A49F7d52BdD2e1D7A0a789019Ce69B" />
          </TransactionProvider>
        ) : (
          <div className="p-4 bg-gray-100 rounded text-center">
            <p className="text-gray-600">Loading follow components...</p>
          </div>
        )}
      </div>

      {/* Status Message */}
      {message && (
        <div className="p-3 bg-gray-100 rounded">
          <p className="text-gray-700">{message}</p>
        </div>
      )}
    </div>
  );
}