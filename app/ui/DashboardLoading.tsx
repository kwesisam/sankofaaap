"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-none space-y-6 sm:space-y-8">
        {/* Loading Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <Skeleton className="h-8 sm:h-10 lg:h-12 w-64 bg-amber-200" />
              <Skeleton className="h-4 sm:h-5 w-96 bg-amber-200" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-32 bg-amber-200" />
                <Skeleton className="h-6 w-24 bg-amber-200" />
              </div>
              <Skeleton className="h-6 w-6 rounded-full bg-amber-200" />
            </div>
          </div>
          <div className="absolute -right-8 sm:-right-16 -top-8 opacity-20">
            <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-amber-200" />
          </div>
        </div>

        {/* Loading Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-lg bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 bg-gray-200 mb-2" />
                <Skeleton className="h-3 w-16 bg-gray-200" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Tabs */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex bg-white shadow rounded-xl p-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>

          {/* Loading Content */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32 bg-gray-200" />
                  <Skeleton className="h-4 w-48 bg-gray-200" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg bg-amber-200" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Loading Items */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <Skeleton className="h-20 w-20 rounded-xl bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Skeleton className="h-6 w-48 bg-gray-200" />
                      <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                      <Skeleton className="h-4 w-32 bg-gray-200" />
                      <Skeleton className="h-4 w-28 bg-gray-200" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <Skeleton className="h-4 w-20 bg-gray-200" />
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Skeleton className="h-9 w-24 rounded-lg bg-gray-200" />
                      <Skeleton className="h-9 w-24 rounded-lg bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
