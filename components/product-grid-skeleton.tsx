import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden border-gray-200">
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-5 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-6 w-1/4" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
