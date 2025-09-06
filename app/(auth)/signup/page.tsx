
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  addData,
  dataExistence,
  signUpWithEmail,
} from "@/app/provider/supabaseProvider";
import { form } from "wagmi/chains";
const SignupPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

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
      const requiredFields = ["fullname", "email", "password"];
      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData]
      );

      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields marked with *",
          variant: "destructive",
        });
        return;
      }

      if (formData.fullname.trim().split(" ").length < 2) {
        toast({
          title: "Invalid Name",
          description: "Please enter your full name.",
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

      const checkUserRes = await dataExistence("users", {
        email: formData.email,
      });

      if (checkUserRes.status === "success" && checkUserRes.data === true) {
        toast({
          title: "Profile Creation Failed",
          description: "User already exists",
          variant: "destructive",
        });
        return;
      }

      const res = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.fullname,
        "user"
      );
      if (res?.error) {
        toast({
          title: "Account Creation Failed",
          description: res.error,
          variant: "destructive",
        });
      } else {
        const addDataRes = await addData("users", {
          full_name: formData.fullname,
          email: formData.email,
          uid: res.data?.user?.id,
        });

        if (addDataRes.status === "success") {
          toast({
            title: "Account Created",
            description:
              "Your account has been created successfully. Please check your email to verify your account.",
            variant: "default",
          });

          setFormData({
            fullname: "",
            email: "",
            password: "",
          });
        } else {
          console.log(addDataRes.error);
        }
      }
    } catch (error) {
      console.error("Creating an account failed", error);
      toast({
        title: "Account Creation Failed",
        description:
          "There was an error creating your profile. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
        <div className="max-w-md mx-auto px-6 sm:px-10  space-y-4 relative top-[20%]">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <Label htmlFor="fullname">Full name *</Label>
            <Input
              type="text"
              id="fullname"
              placeholder="Full name"
              value={formData.fullname}
              onChange={(e) => handleInputChange("fullname", e.target.value)}
            />
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
            <Button
              size="lg"
              className="w-full bg-amber-600 hover:bg-amber-700"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="text-sm leading-relaxed flex items-center justify-center gap-1">
            <div>Already having an account? </div>
            <Link
              href="/signin"
              className="underline underline-offset-4 font-medium text-amber-600 decoration-amber-600"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div className="col-span-4 hidden sm:flex"></div>
    </section>
  );
};

export default SignupPage;
