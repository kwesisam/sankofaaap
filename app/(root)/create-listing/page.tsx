import type { Metadata } from "next"
import CreateListingForm from "@/components/create-listing-form"

export const metadata: Metadata = {
  title: "Create Listing | Sankofa",
  description: "List your handcrafted item on the Sankofa marketplace",
}

export default function CreateListingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Listing</h1>
      <CreateListingForm />
    </div>
  )
}
