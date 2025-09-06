"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import parsePhoneNumber from "libphonenumber-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  Globe,
  Shield,
  Users,
  DollarSign,
  Award,
  Upload,
  ArrowRight,
  Star,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  addData,
  dataExistence,
  signUpWithEmail,
  uploadPortfolioImages,
} from "@/app/provider/supabaseProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
// Add this component before the main component
// function ApplicationForm() {
//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Personal Information */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Personal Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="firstName">First Name *</Label>
//             <Input
//               id="firstName"
//               value={formData.firstName}
//               onChange={(e) => handleInputChange("firstName", e.target.value)}
//               placeholder="Enter your first name"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="lastName">Last Name *</Label>
//             <Input
//               id="lastName"
//               value={formData.lastName}
//               onChange={(e) => handleInputChange("lastName", e.target.value)}
//               placeholder="Enter your last name"
//               required
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="email">Email Address *</Label>
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleInputChange("email", e.target.value)}
//               placeholder="your.email@example.com"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="phone">Phone Number *</Label>
//             <Input
//               id="phone"
//               value={formData.phone}
//               onChange={(e) => handleInputChange("phone", e.target.value)}
//               placeholder="+233 XX XXX XXXX"
//               required
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="country">Country *</Label>
//             <Select
//               value={formData.country}
//               onValueChange={(value) => handleInputChange("country", value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select your country" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ghana">Ghana</SelectItem>
//                 <SelectItem value="nigeria">Nigeria</SelectItem>
//                 <SelectItem value="senegal">Senegal</SelectItem>
//                 <SelectItem value="kenya">Kenya</SelectItem>
//                 <SelectItem value="ethiopia">Ethiopia</SelectItem>
//                 <SelectItem value="mali">Mali</SelectItem>
//                 <SelectItem value="other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="city">City *</Label>
//             <Input
//               id="city"
//               value={formData.city}
//               onChange={(e) => handleInputChange("city", e.target.value)}
//               placeholder="Enter your city"
//               required
//             />
//           </div>
//         </div>
//       </div>

//       {/* Craft Information */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Craft Information</h3>
//         <div>
//           <Label htmlFor="craftType">Primary Craft Type *</Label>
//           <Select
//             value={formData.craftType}
//             onValueChange={(value) => handleInputChange("craftType", value)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select your primary craft" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="textiles">
//                 Textiles (Kente, Adinkra, etc.)
//               </SelectItem>
//               <SelectItem value="woodcarving">Wood Carving</SelectItem>
//               <SelectItem value="jewelry">Jewelry & Beadwork</SelectItem>
//               <SelectItem value="pottery">Pottery & Ceramics</SelectItem>
//               <SelectItem value="metalwork">Metalwork & Bronze</SelectItem>
//               <SelectItem value="basketry">Basketry & Weaving</SelectItem>
//               <SelectItem value="leatherwork">Leatherwork</SelectItem>
//               <SelectItem value="other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label htmlFor="experience">Years of Experience *</Label>
//           <Select
//             value={formData.experience}
//             onValueChange={(value) => handleInputChange("experience", value)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select your experience level" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="1-2">1-2 years</SelectItem>
//               <SelectItem value="3-5">3-5 years</SelectItem>
//               <SelectItem value="6-10">6-10 years</SelectItem>
//               <SelectItem value="11-20">11-20 years</SelectItem>
//               <SelectItem value="20+">20+ years</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label htmlFor="craftDescription">Describe Your Craft *</Label>
//           <Textarea
//             id="craftDescription"
//             value={formData.craftDescription}
//             onChange={(e) =>
//               handleInputChange("craftDescription", e.target.value)
//             }
//             placeholder="Tell us about your craft, techniques you use, cultural significance, and what makes your work unique..."
//             rows={4}
//             required
//           />
//         </div>
//       </div>

//       {/* Portfolio - keeping simplified for MVP */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Portfolio</h3>
//         {uploadImages && uploadImages.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {uploadImages.map((url, index) => (
//               <div key={index} className="relative">
//                 <Image
//                   src={url}
//                   alt="Uploaded work sample"
//                   className="object-cover rounded-lg"
//                   layout="responsive"
//                   width={300}
//                   height={300}
//                 />
//                 <Button
//                   variant="destructive"
//                   className="absolute top-2 right-2"
//                   onClick={() => handleRemoveImage(url)}
//                 >
//                   <Trash2 />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div>
//             <Label htmlFor="portfolio">Upload Work Samples *</Label>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
//               <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 mb-2">
//                 Upload 3-5 high-quality images of your work
//               </p>
//               <p className="text-sm text-gray-500">
//                 JPG, PNG or WEBP (max 5MB each)
//               </p>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 multiple
//                 style={{ display: "none" }}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="mt-4 bg-transparent"
//                 onClick={handleUploadButtonClick}
//               >
//                 Choose Files
//               </Button>
//               <p className="text-xs text-amber-600 mt-2">
//                 Note: You can upload portfolio images after profile creation
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Business Information */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Business Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="businessName">Business/Workshop Name</Label>
//             <Input
//               id="businessName"
//               value={formData.businessName}
//               onChange={(e) =>
//                 handleInputChange("businessName", e.target.value)
//               }
//               placeholder="Enter your business name (optional)"
//             />
//           </div>
//           <div>
//             <Label htmlFor="website">Website/Social Media</Label>
//             <Input
//               id="website"
//               value={formData.website}
//               onChange={(e) => handleInputChange("website", e.target.value)}
//               placeholder="https://your-website.com (optional)"
//             />
//           </div>
//         </div>
//         <div>
//           <Label htmlFor="monthlyProduction">Monthly Production Capacity</Label>
//           <Select
//             value={formData.monthlyProduction}
//             onValueChange={(value) =>
//               handleInputChange("monthlyProduction", value)
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="How many items can you produce monthly?" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="1-5">1-5 items</SelectItem>
//               <SelectItem value="6-15">6-15 items</SelectItem>
//               <SelectItem value="16-30">16-30 items</SelectItem>
//               <SelectItem value="31-50">31-50 items</SelectItem>
//               <SelectItem value="50+">50+ items</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Agreements */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Agreements</h3>
//         <div className="space-y-3">
//           <div className="flex  items-center space-x-2">
//             <Checkbox
//               id="terms"
//               checked={formData.terms}
//               onCheckedChange={(checked) =>
//                 handleInputChange("terms", checked as boolean)
//               }
//             />
//             <Label htmlFor="terms" className="text-sm leading-relaxed">
//               I agree to the{" "}
//               <Link href="/terms" className="text-amber-600 hover:underline">
//                 Terms of Service
//               </Link>{" "}
//               and{" "}
//               <Link href="/privacy" className="text-amber-600 hover:underline">
//                 Privacy Policy
//               </Link>
//             </Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="authenticity"
//               checked={formData.authenticity}
//               onCheckedChange={(checked) =>
//                 handleInputChange("authenticity", checked as boolean)
//               }
//             />
//             <Label htmlFor="authenticity" className="text-sm leading-relaxed">
//               I certify that all items I list will be authentic, handmade crafts
//               created by me
//             </Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="quality"
//               checked={formData.quality}
//               onCheckedChange={(checked) =>
//                 handleInputChange("quality", checked as boolean)
//               }
//             />
//             <Label htmlFor="quality" className="text-sm leading-relaxed">
//               I agree to maintain high quality standards and provide accurate
//               descriptions of my items
//             </Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="shipping"
//               checked={formData.shipping}
//               onCheckedChange={(checked) =>
//                 handleInputChange("shipping", checked as boolean)
//               }
//             />
//             <Label htmlFor="shipping" className="text-sm leading-relaxed">
//               I can ship items internationally and will handle orders promptly
//             </Label>
//           </div>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="pt-6">
//         <Button
//           type="submit"
//           size="lg"
//           className="w-full bg-amber-600 hover:bg-amber-700"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               Creating Your Profile...
//             </>
//           ) : (
//             "Create My Artisan Profile"
//           )}
//         </Button>
//         <p className="text-sm text-gray-500 text-center mt-3">
//           Your profile will be created instantly and you can start listing items
//           right away!
//         </p>
//       </div>
//     </form>
//   );
// }

export default function BecomeArtisanClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadImages, setUploadImages] = useState<string[] | null>(null);
  const [isPasswordDialogOpen, setIPasswordsDialogOpen] = useState(false);
  const applicationForm = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [savingData, setSavingData] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    craftType: "",
    experience: "",
    craftDescription: "",
    businessName: "",
    website: "",
    monthlyProduction: "",
    terms: false,
    authenticity: false,
    quality: false,
    shipping: false,
  });
  const defaultFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    craftType: "",
    experience: "",
    craftDescription: "",
    businessName: "",
    website: "",
    monthlyProduction: "",
    terms: false,
    authenticity: false,
    quality: false,
    shipping: false,
  };

  const { toast } = useToast();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLoadingFile(true);
      console.log("Selected files:", files);
      // Upload files to Supabase
      const uploadResult = await uploadPortfolioImages(Array.from(files));
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
      }

      setUploadImages(
        storeUrl.filter((url): url is string => typeof url === "string")
      );
    }
  };

  const handleRemoveImage = (url: string) => {
    setUploadImages((prev) => prev?.filter((image) => image !== url) || null);
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
    console.log(2222);

    try {
      // Validate required fields
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "country",
        "city",
        "craftType",
        "experience",
        "craftDescription",
      ];
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

      // Validate agreements
      if (
        !formData.terms ||
        !formData.authenticity ||
        !formData.quality ||
        !formData.shipping
      ) {
        toast({
          title: "Agreements Required",
          description:
            "Please accept all agreements to proceed with your application.",
          variant: "destructive",
        });
        return;
      }

      if (uploadImages == null || uploadImages.length === 0) {
        toast({
          title: "No Images Uploaded",
          description: "Please upload at least one image for your portfolio.",
          variant: "destructive",
        });
        return;
      }

      if (uploadImages.length < 3) {
        toast({
          title: "Insufficient Images",
          description: "Please upload at least 3 images for your portfolio.",
          variant: "destructive",
        });
        return;
      }

      if (!/^[A-Za-z]+$/.test(formData.firstName)) {
        toast({
          title: "Invalid Name",
          description: "First name should only contain letters.",
          variant: "destructive",
        });
        return;
      }

      if (!/^[A-Za-z]+$/.test(formData.lastName)) {
        toast({
          title: "Invalid Name",
          description: "Last name should only contain letters.",
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

      const phoneNumber = parsePhoneNumber(formData.phone, "GH");

      if (!phoneNumber || !phoneNumber.isValid()) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number.",
          variant: "destructive",
        });
        return;
      }

      if (
        formData.businessName.trim() !== "" &&
        /[^a-zA-Z0-9\s]/.test(formData.businessName)
      ) {
        toast({
          title: "Invalid Business Name",
          description:
            "Business name should only contain letters, numbers, and spaces.",
          variant: "destructive",
        });
        return;
      }

      if (
        formData.website.trim() !== "" &&
        !/^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}\/?/.test(formData.website)
      ) {
        toast({
          title: "Invalid Website URL",
          description: "Please enter a valid website URL.",
          variant: "destructive",
        });
        return;
      }

      // Submit to API
      // const response = await fetch("/api/artisan-applications", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to create profile");
      // }

      // const result = await response.json();
      setIPasswordsDialogOpen(true)


      // Reset form
      // setFormData({
      //   firstName: "",
      //   lastName: "",
      //   email: "",
      //   phone: "",
      //   country: "",
      //   city: "",
      //   craftType: "",
      //   experience: "",
      //   craftDescription: "",
      //   businessName: "",
      //   website: "",
      //   monthlyProduction: "",
      //   terms: false,
      //   authenticity: false,
      //   quality: false,
      //   shipping: false,
      // });

      // Redirect to the new artisan profile after 2 seconds
      // setTimeout(() => {
      //   router.push(
      //     `/profile-created?artisanId=${result.artisanId}&userId=${result.userId}`
      //   );
      // }, 2000);
    } catch (error) {
      console.error("Profile creation error:", error);
      toast({
        title: "Profile Creation Failed",
        description:
          "There was an error creating your profile. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password should be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setSavingData(true);
    try {
      const checkUserRes = await dataExistence("artisan", {
        email: formData.email,
      });

      if (checkUserRes.status === "success" && checkUserRes.data === true) {
        toast({
          title: "Profile Creation Failed",
          description: "Business already exists",
          variant: "destructive",
        });
        return;
      }

      const res = await signUpWithEmail(
        formData.email,
        password,
        formData.firstName + " " + formData.lastName,
        "artisan"
      );
      if (res.status === "error") {
        toast({
          title: "Profile Creation Failed",
          description: res.error,
          variant: "destructive",
        });
        return;
      }

      const addDataRes = await addData("artisan", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        craft: formData.craftType,
        experience_years: formData.experience,
        description: formData.craftDescription,
        portfolio_image: uploadImages,
        business_name: formData.businessName,
        social_media: formData.website,
        capacity: formData.monthlyProduction,
        business_id: res.data?.user?.id,
      });

      if (addDataRes.status === "success") {
        toast({
          title: "Profile Created Successfully!",
          description: `Welcome to Sankofa, ${formData.firstName}! Your artisan profile is now live and you can start listing your crafts. Check your email for verification.`,
        });

        setPassword("");
        setConfirmPassword("");
        setFormData(defaultFormData);
        setUploadImages([])
        setIPasswordsDialogOpen(false)
      }
    } catch (error) {
      toast({
        title: "Profile Creation Failed",
        description:
          "There was an error creating your profile. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setSavingData(false);
    }
  };

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Access customers worldwide and expand your market beyond local boundaries.",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "Get paid safely with our blockchain-powered escrow system protecting every transaction.",
    },
    {
      icon: Award,
      title: "Authenticity Verification",
      description:
        "Each of your creations gets a blockchain certificate proving its authenticity and origin.",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Join a supportive community of fellow artisans and receive guidance on growing your craft business.",
    },
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description:
        "Set your own prices and keep 97.5% of each sale (only 2.5% platform fee).",
    },
    {
      icon: CheckCircle,
      title: "Easy Setup",
      description:
        "Simple onboarding process with no upfront costs or monthly fees.",
    },
  ];

  const requirements = [
    "Must be 18 years or older",
    "Create authentic, handmade African crafts",
    "Provide proof of craftsmanship (photos/videos of work process)",
    "Agree to our quality standards and community guidelines",
    "Have the ability to ship items internationally",
  ];

  const steps = [
    {
      number: 1,
      title: "Submit Application",
      description:
        "Fill out our application form with your details and craft specialization.",
    },
    {
      number: 2,
      title: "Instant Approval",
      description:
        "Your profile is created immediately - no waiting period required!",
    },
    {
      number: 3,
      title: "Setup Your Shop",
      description: "Add portfolio images and customize your artisan profile.",
    },
    {
      number: 4,
      title: "Start Selling",
      description:
        "Create your first listing and start connecting with global customers.",
    },
  ];

  const testimonials = [
    {
      name: "Amara Diop",
      location: "Dakar, Senegal",
      craft: "Wood Carving",
      quote:
        "Sankofa has transformed my business. I now sell my masks to collectors in over 20 countries!",
      rating: 5,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Kwame Nkrumah",
      location: "Accra, Ghana",
      craft: "Kente Weaving",
      quote:
        "The blockchain certificates give my customers confidence in authenticity. Sales have tripled!",
      rating: 5,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Zainab Osei",
      location: "Kumasi, Ghana",
      craft: "Beadwork",
      quote:
        "The community support is amazing. Fellow artisans share tips and help each other grow.",
      rating: 5,
      image: "/placeholder.svg?height=80&width=80",
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Share Your Craft with the{" "}
            <span className="text-amber-600">World</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of African artisans who are preserving cultural
            heritage while building sustainable businesses through our
            blockchain-powered marketplace.
          </p>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl mx-auto max-w-4xl mb-8">
            <Image
              src="/home1.jpg"
              alt="African artisans working on traditional crafts"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
            >
              <a href="#application-form">Create Profile Now</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent w-full sm:w-auto"
            >
              <a href="#learn-more">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="learn-more" className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Join Sankofa?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="text-center border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How to Join
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-1/2 transform translate-x-8">
                  <ArrowRight className="h-6 w-6 text-amber-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Requirements
            </h2>
            <p className="text-gray-600 mb-6">
              To maintain the quality and authenticity of our marketplace, we
              have a few simple requirements for our artisans:
            </p>
            <ul className="space-y-3">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/home2.jpg"
              alt="Artisan crafting traditional item"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Artisans Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-amber-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.craft} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* Application Form */}
      <section id="application-form" className="mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Join?
            </h2>
            <p className="text-gray-600">
              Fill out the form below and your artisan profile will be created
              instantly!
            </p>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Create Your Artisan Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                ref={applicationForm}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+233 XX XXX XXXX"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleInputChange("country", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ghana">Ghana</SelectItem>
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          <SelectItem value="senegal">Senegal</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="ethiopia">Ethiopia</SelectItem>
                          <SelectItem value="mali">Mali</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Craft Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Craft Information</h3>
                  <div>
                    <Label htmlFor="craftType">Primary Craft Type *</Label>
                    <Select
                      value={formData.craftType}
                      onValueChange={(value) =>
                        handleInputChange("craftType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary craft" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="textiles">
                          Textiles (Kente, Adinkra, etc.)
                        </SelectItem>
                        <SelectItem value="woodcarving">
                          Wood Carving
                        </SelectItem>
                        <SelectItem value="jewelry">
                          Jewelry & Beadwork
                        </SelectItem>
                        <SelectItem value="pottery">
                          Pottery & Ceramics
                        </SelectItem>
                        <SelectItem value="metalwork">
                          Metalwork & Bronze
                        </SelectItem>
                        <SelectItem value="basketry">
                          Basketry & Weaving
                        </SelectItem>
                        <SelectItem value="leatherwork">Leatherwork</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) =>
                        handleInputChange("experience", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="11-20">11-20 years</SelectItem>
                        <SelectItem value="20+">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="craftDescription">
                      Describe Your Craft *
                    </Label>
                    <Textarea
                      id="craftDescription"
                      value={formData.craftDescription}
                      onChange={(e) =>
                        handleInputChange("craftDescription", e.target.value)
                      }
                      placeholder="Tell us about your craft, techniques you use, cultural significance, and what makes your work unique..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* Portfolio - keeping simplified for MVP */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Portfolio</h3>
                  {uploadImages && uploadImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadImages.map((url, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={url}
                            alt="Uploaded work sample"
                            className="object-cover rounded-lg"
                            layout="responsive"
                            width={300}
                            height={300}
                          />
                          <Button
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveImage(url)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="portfolio">Upload Work Samples *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Upload 3-5 high-quality images of your work
                        </p>
                        <p className="text-sm text-gray-500">
                          JPG, PNG or WEBP (max 5MB each)
                        </p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          multiple
                          style={{ display: "none" }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 bg-transparent"
                          onClick={handleUploadButtonClick}
                          disabled={loadingFile}
                        >
                          {loadingFile ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 text-black"></div>
                            </>
                          ) : (
                            "Choose Files"
                          )}
                        </Button>
                        <p className="text-xs text-amber-600 mt-2">
                          Note: You can upload portfolio images after profile
                          creation
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">
                        Business/Workshop Name
                      </Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) =>
                          handleInputChange("businessName", e.target.value)
                        }
                        placeholder="Enter your business name (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website/Social Media</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        placeholder="https://your-website.com (optional)"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="monthlyProduction">
                      Monthly Production Capacity
                    </Label>
                    <Select
                      value={formData.monthlyProduction}
                      onValueChange={(value) =>
                        handleInputChange("monthlyProduction", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How many items can you produce monthly?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 items</SelectItem>
                        <SelectItem value="6-15">6-15 items</SelectItem>
                        <SelectItem value="16-30">16-30 items</SelectItem>
                        <SelectItem value="31-50">31-50 items</SelectItem>
                        <SelectItem value="50+">50+ items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Agreements</h3>
                  <div className="space-y-3">
                    <div className="flex  items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.terms}
                        className="data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600"
                        onCheckedChange={(checked) =>
                          handleInputChange("terms", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-amber-600 hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-amber-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="authenticity"
                        checked={formData.authenticity}
                        className="data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600"
                        onCheckedChange={(checked) =>
                          handleInputChange("authenticity", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="authenticity"
                        className="text-sm leading-relaxed"
                      >
                        I certify that all items I list will be authentic,
                        handmade crafts created by me
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="quality"
                        checked={formData.quality}
                        className="data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600"
                        onCheckedChange={(checked) =>
                          handleInputChange("quality", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="quality"
                        className="text-sm leading-relaxed"
                      >
                        I agree to maintain high quality standards and provide
                        accurate descriptions of my items
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shipping"
                        className="data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600"
                        checked={formData.shipping}
                        onCheckedChange={(checked) =>
                          handleInputChange("shipping", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="shipping"
                        className="text-sm leading-relaxed"
                      >
                        I can ship items internationally and will handle orders
                        promptly
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Your Profile...
                      </>
                    ) : (
                      "Create My Artisan Profile"
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Your profile will be created instantly and you can start
                    listing items right away!
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">
                How much does it cost to join Sankofa?
              </h3>
              <p className="text-gray-600">
                Joining Sankofa is completely free! There are no setup fees,
                monthly fees, or listing fees. We only charge a 2.5% transaction
                fee when you make a sale.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">
                How long does it take to create my profile?
              </h3>
              <p className="text-gray-600">
                Your profile is created instantly! Once you submit the form,
                you'll immediately have access to your artisan dashboard where
                you can start listing your crafts.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">
                Do I need to know about blockchain or NFTs?
              </h3>
              <p className="text-gray-600">
                Not at all! We handle all the technical aspects for you. When
                you choose to create an NFT certificate for an item, we take
                care of the blockchain interaction automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">How do I get paid?</h3>
              <p className="text-gray-600">
                Payments are processed through our secure escrow system. Once a
                buyer confirms they've received their item, funds are
                automatically released to your wallet. We support various
                payment methods including bank transfers and mobile money.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center bg-amber-600 text-white rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Share Your Craft?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of artisans who are building sustainable businesses
          while preserving African cultural heritage.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-amber-600 hover:bg-gray-100"
        >
          <a href="#application-form">Create Your Profile Now</a>
        </Button>
      </section>

      {/**Password input dialog */}

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIPasswordsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIPasswordsDialogOpen(true)} className="hidden" variant="outline">
            Change Password
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set New Password</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end">
            <Button
              size="lg"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent w-full sm:w-auto"
              onClick={() => {
              
                setPassword("");
                setConfirmPassword("");
                setIPasswordsDialogOpen(false)
              }}
              disabled={savingData}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              className="w-full bg-amber-600 hover:bg-amber-700  sm:w-auto"
              onClick={handleSave}
              disabled={savingData}
            >
              {savingData ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 text-black"></div>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
