import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Application Submitted | Sankofa",
  description: "Your artisan application has been successfully submitted",
};

export default function ApplicationSubmittedPage() {
  return (
    <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Thank you for your interest in joining the Sankofa community. We're
          excited to learn more about your craft!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">What Happens Next?</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <div className="bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  1
                </div>
                <span>
                  We'll review your application within 3-5 business days
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  2
                </div>
                <span>
                  Our team will evaluate your portfolio and experience
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  3
                </div>
                <span>You'll receive an email with our decision</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  4
                </div>
                <span>
                  If approved, we'll help you set up your artisan profile
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Check Your Email</h3>
            </div>
            <p className="text-gray-600 mb-4">
              We've sent a confirmation email with your application details and
              reference number. Please check your inbox and spam folder.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Application Reference:</strong>
              </p>
              <p className="font-mono text-sm bg-white p-2 rounded border">
                APP-{Date.now()}-{Math.random().toString(36).substr(2, 9)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          While You Wait...
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Explore Our Marketplace</h3>
            <p className="text-sm text-gray-600 mb-4">
              See what other artisans are creating and get inspired for your own
              listings.
            </p>
            <Link href="/marketplace">
              <Button
                variant="outline"
                className="bg-transparent border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                Browse Products
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Meet Our Artisans</h3>
            <p className="text-sm text-gray-600 mb-4">
              Learn about the talented craftspeople already part of our
              community.
            </p>
            <Link href="/artisans">
              <Button
                variant="outline"
                className="bg-transparent border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                View Artisans
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Learn About Sankofa</h3>
            <p className="text-sm text-gray-600 mb-4">
              Discover our mission and how we're supporting African artisans
              worldwide.
            </p>
            <Link href="/about">
              <Button
                variant="outline"
                className="bg-transparent border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          Questions About Your Application?
        </h2>
        <p className="text-gray-600 mb-6">
          If you have any questions or need to update your application, please
          don't hesitate to contact us.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button variant="outline" className="bg-transparent">
              Contact Support
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <ArrowRight className="h-4 w-4 mr-2" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
