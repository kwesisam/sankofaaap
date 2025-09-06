import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8">
                <Image src="/sankofabird.png" alt="Sankofa Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-lg">Sankofa</span>
            </div>
            <p className="text-gray-600 text-sm">
              Connecting African artisans to global markets with blockchain-verified authenticity.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-amber-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-gray-600 hover:text-amber-600">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=textiles" className="text-gray-600 hover:text-amber-600">
                  Textiles
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=jewelry" className="text-gray-600 hover:text-amber-600">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=art" className="text-gray-600 hover:text-amber-600">
                  Art
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=home" className="text-gray-600 hover:text-amber-600">
                  Home Decor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Artisans</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/become-artisan" className="text-gray-600 hover:text-amber-600">
                  Become an Artisan
                </Link>
              </li>
              <li>
                <Link href="/artisan-resources" className="text-gray-600 hover:text-amber-600">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/artisan-faq" className="text-gray-600 hover:text-amber-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/create-listing" className="text-gray-600 hover:text-amber-600">
                  Create a Listing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-amber-600">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-600 hover:text-amber-600">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-amber-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-amber-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-amber-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Sankofa. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-amber-600">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-amber-600">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-amber-600">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
