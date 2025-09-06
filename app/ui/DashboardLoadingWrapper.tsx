"use client";

import SidebarLoading from "./SidebarLoading";
import DashboardLoading from "./DashboardLoading";

export default function DashboardLoadingWrapper() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Loading */}
      <SidebarLoading />
      
      {/* Main Content Loading */}
      <div className="flex-1 overflow-auto">
        <DashboardLoading />
      </div>
    </div>
  );
}
