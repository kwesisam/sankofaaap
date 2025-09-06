
"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../ui/AppSidebar";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import DashboardLoadingWrapper from "../ui/DashboardLoadingWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const session = useSession();

  // Show loading state while session is loading
  if (session.status === "loading") {
    return <DashboardLoadingWrapper />;
  }

  return (
    <main className="min-h-screen">
      <SidebarProvider>
        <AppSidebar pathname={pathname} />
        <section className="flex-1 transition-all duration-300 ease-in-out">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
              <SidebarTrigger className="sidebar-trigger" />
            </div>
            <div className="w-full">
              {children}
            </div>
          </div>
        </section>
      </SidebarProvider>
      <Toaster />
    </main>
  );
}
