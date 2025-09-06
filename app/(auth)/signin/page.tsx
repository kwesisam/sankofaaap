
"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { config } from "@/app/provider/provider";
import { useConfig } from "wagmi";
import { getAccount } from "@wagmi/core";
import { redirect } from "next/dist/server/api-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { form } from "wagmi/chains";
const SignIn = () => {
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount({ config });
  const { chains } = useConfig();
  const { connect } = useConnect();
  const account = getAccount(config);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    try {
      const csrfToken = await getCsrfToken();
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: Number(account?.chainId),
        nonce: csrfToken,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      const result = await signIn("ethereum", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });

      console.log(result)
      if (result?.ok) {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          variant: "default",
        });
        window.location.href = "/";
      } else {
        toast({
          title: "Login Failed",
          description: result?.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
      // window.alert(error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const Fields = ["email", "password"];
      const missingFields = Fields.filter(
        (field) => !formData[field as keyof typeof formData]
      );

      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all  fields marked with *",
          variant: "destructive",
        });
        return;
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return;
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result) {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          variant: "default",
        });
        window.location.href = "/";
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sign in failed", error);
      toast({
        title: "Sign in Failed",
        description:
          "There was an error signing in. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isConnected && account.chainId) {
      //handleLogin();
    } else {
      console.log("Waiting for wallet connection and chain info...");
    }
  }, [isConnected, account.chainId]);

  const handleGoogleSignIn = async () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleEthSignIn = () => {
    if (!isConnected) {
      connect({ connector: injected() });
      toast({
        title: "Connect wallet",
        description: "Connect wallet and try it again.",
        variant: "default",
      });
    } else {
      handleLogin();
    }
  };

  return (
    <section className="grid sm:grid-cols-7 h-screen">
      <div className="col-span-3 sm:border flex-1  h-full ">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 pt-4"
        >
          <div className="relative h-8 w-8">
            <Image
              src="/sankofabird.png"
              alt="Sankofa Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden md:inline-block font-bold text-lg">
            Sankofa
          </span>
        </Link>
        <div className="max-w-md mx-auto px-6 sm:px-10  space-y-4 relative top-[15%]">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                size="lg"
                type="button"
                className="w-full border bg-white text-black hover:bg-white flex items-center  border-amber-600 hover:border-amber-700"
                onClick={handleGoogleSignIn}
              >
                <Image
                  src="/google-icon-logo.svg"
                  alt="Google Icon"
                  width={20}
                  height={20}
                />
                Continue with Google
              </Button>
              <Button
                size="lg"
                type="button"
                className="w-full border bg-white text-black flex items-center hover:bg-white border-amber-600 hover:border-amber-700"
                disabled={!mounted}
                onClick={handleEthSignIn}
              >
                <Image
                  src="/ethereum-logo.svg"
                  alt="MetaMask Icon"
                  width={16}
                  height={14}
                  className="mr-2"
                />
                {mounted && isConnected
                  ? "Continue with Ethereum"
                  : "Connect Wallet"}
              </Button>
            </div>

            <div className="flex items-center gap-4 my-1">
              <span className="flex-grow h-px bg-gray-300"></span>
              <span className="text-gray-500 text-sm">or</span>
              <span className="flex-grow h-px bg-gray-300"></span>
            </div>

            <Label htmlFor="email">Email Address *</Label>
            <Input
              type="text"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <Label htmlFor="password">Password *</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <div className="flex  items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  // checked={formData.terms}
                  // nCheckedChange={(checked) {
                  //   // handleInputChange("terms", checked as boolean)
                  // }}
                />
                <Label htmlFor="remember" className="text-sm leading-relaxed">
                  <Link href="" className="hover:underline">
                    Remeber me
                  </Link>
                </Label>
              </div>
              <Link href="" className="hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>
            <Button
              size="lg"
              className="w-full bg-amber-600 hover:bg-amber-700"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-sm leading-relaxed flex items-center justify-center gap-1">
            <div>Don't have an account? </div>
            <Link
              href="/signup"
              className="underline underline-offset-4 font-medium text-amber-600 decoration-amber-600"
            >
              Sign up
            </Link>
          </div>

          {/* {!isConnected ? (
            <button onClick={() => connect({ connector: injected() })}>
              Connect MetaMask
            </button>
          ) : (
            <div>
              Connected: {address} on chain {account.chain?.name} on{" "}
              {account.chainId}
            </div>
          )} */}
        </div>
      </div>

      <div className="col-span-4 hidden sm:flex">
        {/* <Image
          src="/authimage.png"
          alt="Sign In Image"
          width={500}
          height={500}
          className="object-cover w-full"
          priority
        /> */}
      </div>
    </section>
  );
};

export default SignIn;
