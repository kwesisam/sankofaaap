import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, User, ShoppingBag, Camera, ArrowRight, Wallet, Globe } from "lucide-react"

export const metadata = {
  title: "Profile Created | Sankofa",
  description: "Your artisan profile has been successfully created",
}

export default function ProfileCreatedPage() {
  return (
    <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Sankofa!</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your artisan profile has been created successfully. You're now part of our global community of African
          craftspeople!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <User className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold">Your Profile is Live!</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Artisan profile created and verified</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Blockchain wallet generated</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Ready to accept global payments</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Access to NFT certificate creation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Your Wallet Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Wallet Address:</p>
                <p className="font-mono text-xs bg-gray-50 p-2 rounded border break-all">
                  0x742d35Cc6634C0532925a3b8D4C9db...
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Secure:</strong> Your wallet is protected by enterprise-grade encryption. We handle all
                  blockchain interactions for you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Next Steps to Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <div className="mb-4">
              <Camera className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Add Portfolio Images</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload high-quality photos of your work to showcase your craftsmanship.
              </p>
            </div>
            <Button variant="outline" className="bg-transparent border-amber-600 text-amber-600 hover:bg-amber-50">
              Upload Photos
            </Button>
          </div>

          <div className="text-center">
            <div className="bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <div className="mb-4">
              <ShoppingBag className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Create Your First Listing</h3>
              <p className="text-sm text-gray-600 mb-4">
                List your first handcrafted item and start connecting with global customers.
              </p>
            </div>
            <Link href="/create-listing">
              <Button className="bg-amber-600 hover:bg-amber-700">Create Listing</Button>
            </Link>
          </div>

          <div className="text-center">
            <div className="bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <div className="mb-4">
              <Globe className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Explore the Community</h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect with other artisans and see what's trending in the marketplace.
              </p>
            </div>
            <Link href="/artisans">
              <Button variant="outline" className="bg-transparent border-amber-600 text-amber-600 hover:bg-amber-50">
                Meet Artisans
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Getting Started Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use natural lighting for the best product photos</li>
              <li>• Write detailed descriptions highlighting cultural significance</li>
              <li>• Set competitive prices based on materials and time invested</li>
              <li>• Consider creating NFT certificates for premium items</li>
              <li>• Respond promptly to customer inquiries</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Support & Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Access our artisan resource center</li>
              <li>• Join our community forum for tips and advice</li>
              <li>• Get help with photography and product descriptions</li>
              <li>• Learn about blockchain and NFT certificates</li>
              <li>• Contact our support team anytime</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-gray-600 mb-6">
          You're all set! Start by creating your first listing or exploring what other artisans are creating.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create-listing">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Create First Listing
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button size="lg" variant="outline" className="bg-transparent">
              <ArrowRight className="h-4 w-4 mr-2" />
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
