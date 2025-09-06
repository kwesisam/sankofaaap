"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Loader2, Star } from "lucide-react"

interface Order {
  id: string
  productId: string
  productTitle: string
  totalPrice: number
  currency: string
  status: string
  escrowId: string
}

interface ConfirmDeliveryButtonProps {
  order: Order
  onConfirmed?: () => void
}

export default function ConfirmDeliveryButton({ order, onConfirmed }: ConfirmDeliveryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const { toast } = useToast()

  const handleConfirmDelivery = async () => {
    setIsLoading(true)

    try {
      // Call API to confirm delivery and release escrow
      const response = await fetch(`/api/orders/${order.id}/confirm-delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to confirm delivery")
      }

      const result = await response.json()

      toast({
        title: "Delivery Confirmed",
        description: "Funds have been released to the artisan. You can now leave a review.",
      })

      // Show review form
      setShowReview(true)
    } catch (error) {
      console.error("Confirm delivery error:", error)
      toast({
        title: "Confirmation Failed",
        description: "There was an error confirming delivery. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Submit review
      const response = await fetch(`/api/orders/${order.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          review: review.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review has been recorded on the blockchain.",
      })

      setIsOpen(false)
      onConfirmed?.()
    } catch (error) {
      console.error("Submit review error:", error)
      toast({
        title: "Review Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const StarRating = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`p-1 rounded ${star <= rating ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  )

  if (order.status !== "shipped") {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          Confirm Delivery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{showReview ? "Leave a Review" : "Confirm Delivery"}</DialogTitle>
          <DialogDescription>
            {showReview
              ? "Share your experience with this product and artisan"
              : "Please confirm that you have received your order in good condition"}
          </DialogDescription>
        </DialogHeader>

        {!showReview ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Order Details</h3>
              <p className="text-sm text-gray-600">Product: {order.productTitle}</p>
              <p className="text-sm text-gray-600">
                Amount: {order.currency} {order.totalPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Order ID: {order.id}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> By confirming delivery, you acknowledge that you have received the item in
                good condition. This action will release the funds from escrow to the artisan and cannot be undone.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Rate your experience</Label>
              <div className="mt-2">
                <StarRating />
              </div>
            </div>

            <div>
              <Label htmlFor="review">Write a review (optional)</Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about the product quality, craftsmanship, and overall experience..."
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Your review will be permanently recorded on the blockchain and linked to this transaction, ensuring
                authenticity and preventing fake reviews.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={showReview ? handleSubmitReview : handleConfirmDelivery}
            disabled={isLoading}
            className={showReview ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {showReview ? "Submitting..." : "Confirming..."}
              </>
            ) : showReview ? (
              "Submit Review"
            ) : (
              "Confirm & Release Funds"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
