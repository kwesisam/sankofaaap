"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardCardLoadingProps {
  showHeader?: boolean;
  showIcon?: boolean;
  showDescription?: boolean;
  className?: string;
}

export default function DashboardCardLoading({
  showHeader = true,
  showIcon = true,
  showDescription = true,
  className = "",
}: DashboardCardLoadingProps) {
  return (
    <Card className={`border-0 shadow-lg bg-white ${className}`}>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-200" />
            {showDescription && <Skeleton className="h-3 w-32 bg-gray-200" />}
          </div>
          {showIcon && <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />}
        </CardHeader>
      )}
      <CardContent>
        <Skeleton className="h-8 w-20 bg-gray-200 mb-2" />
        <Skeleton className="h-3 w-16 bg-gray-200" />
      </CardContent>
    </Card>
  );
}
