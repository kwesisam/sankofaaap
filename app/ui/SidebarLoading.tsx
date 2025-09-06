"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarLoading() {
  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo/Brand Loading */}
      <div className="flex items-center gap-3 pl-5 pt-5 pb-6">
        <Skeleton className="h-8 w-8 rounded-lg bg-amber-200" />
        <Skeleton className="h-6 w-24 bg-amber-200" />
      </div>

      {/* Navigation Menu Loading */}
      <div className="flex-1 px-3 space-y-2">
        {/* Menu Groups */}
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            {/* Group Header */}
            <div className="px-2 py-1">
              <Skeleton className="h-4 w-20 bg-gray-200" />
            </div>
            
            {/* Menu Items */}
            {Array.from({ length: groupIndex === 0 ? 4 : groupIndex === 1 ? 3 : 2 }).map((_, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                <Skeleton className="h-5 w-5 rounded bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-200" />
              </div>
            ))}
            
            {groupIndex < 2 && <div className="h-px bg-gray-200 mx-3" />}
          </div>
        ))}
      </div>

      {/* User Section Loading */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-3 p-3 rounded-lg">
          <Skeleton className="h-8 w-8 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-20 bg-gray-200" />
            <Skeleton className="h-3 w-24 bg-gray-200" />
          </div>
          <Skeleton className="h-4 w-4 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
