import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Heart, Shield, Users, Zap, Award } from "lucide-react"

export const metadata = {
  title: "About | Sankofa",
  description:
    "Learn about Sankofa's mission to connect African artisans with global markets through blockchain technology",
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Desmond Dadzie",
      role: "Project Lead",
      bio: "Passionate about preserving African cultural heritage through technology.",
      image: "https://placehold.net/avatar.svg",
    },
    {
      name: "Florence Anarfi",
      role: "Head of Artisan Relations",
      bio: "Connecting with artisans across Africa to build our community.",
      image: "https://placehold.net/avatar.svg",
    },
    {
      name: "Samuel Mensah",
      role: "Smart Contract Developer",
      bio: "Writing the smart contracts that power our marketplace.",
      image: "https://placehold.net/avatar.svg",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Cultural Preservation",
      description:
        "We believe in preserving and celebrating African cultural heritage through authentic craftsmanship.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our artisans are at the heart of everything we do. We prioritize their success and well-being.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Blockchain technology ensures every transaction is secure, transparent, and verifiable.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Connecting local artisans to global markets while maintaining fair trade practices.",
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About <span className="text-amber-600">Sankofa</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Sankofa, meaning "go back and get it" in Akan, represents our mission to honor traditional African
          craftsmanship while embracing modern technology to connect artisans with the global marketplace.
        </p>
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl mx-auto max-w-4xl">
          <Image
            src="/artisans1.png?height=800&width=1100"
            alt="African artisans at work"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We're on a mission to empower African artisans by providing them with direct access to global markets
              while ensuring the authenticity and provenance of their work through blockchain technology.
            </p>
            <p className="text-gray-600 mb-6">
              Every purchase on Sankofa directly supports artisan communities, preserves traditional crafting
              techniques, and celebrates the rich cultural heritage of Africa.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">500+</div>
                <div className="text-sm text-gray-600">Artisans Supported</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">15</div>
                <div className="text-sm text-gray-600">Countries Reached</div>
              </div>
            </div>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/artisans2.png?height=600&width=600"
              alt="Artisan working on traditional craft"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center border-gray-200">
              <CardContent className="p-6">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How Sankofa Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Artisan Creates</h3>
            <p className="text-gray-600 text-sm">
              Talented artisans craft authentic pieces using traditional techniques passed down through generations.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Blockchain Verification</h3>
            <p className="text-gray-600 text-sm">
              Each item receives a digital certificate of authenticity stored on the blockchain, ensuring provenance.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Global Marketplace</h3>
            <p className="text-gray-600 text-sm">
              Buyers worldwide can discover and purchase authentic African crafts with confidence and security.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center border-gray-200">
              <CardContent className="p-6">
                <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-amber-600 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/blockchain.png?height=600&width=600"
              alt="Blockchain technology visualization"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Powered by Blockchain</h2>
            <p className="text-gray-600 mb-4">
              Our platform leverages cutting-edge blockchain technology to ensure every transaction is secure,
              transparent, and verifiable. Each artisan creation comes with a digital certificate of authenticity that
              cannot be forged or duplicated.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Secure Escrow System</h4>
                  <p className="text-sm text-gray-600">Funds are held securely until delivery is confirmed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">NFT Certificates</h4>
                  <p className="text-sm text-gray-600">Digital certificates prove authenticity and ownership</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Fast Transactions</h4>
                  <p className="text-sm text-gray-600">Built on efficient blockchain networks for quick processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-amber-600 text-white rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Join the Sankofa Community</h2>
        <p className="text-xl mb-8 opacity-90">
          Whether you're an artisan looking to share your craft or a buyer seeking authentic African art, we welcome you
          to our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/become-artisan">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-amber-600 hover:bg-gray-100 w-full sm:w-auto"
            >
              Become an Artisan
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-amber-600 bg-transparent w-full sm:w-auto"
            >
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
