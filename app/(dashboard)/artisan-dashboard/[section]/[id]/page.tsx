
"use client";
import React from "react";
import { notFound, usePathname } from "next/navigation";
import { ArtisanDashboard } from "@/app/ui/ArtisanDashboard";
import ArtisanListingsPage from "@/app/ui/ArtisanListing";
import 
ArtisanOrdersPage from "@/app/ui/ArtisanOrders";
import { useSession } from "next-auth/react";
import ArtisanProfile from "@/app/ui/ArtisanProfile";
import ArtisanSettings from "@/app/ui/ArtisanSettings";

type Props = {
  params: {
    section: string;
    id: string;
  };
};

const page = ({ params }: Props) => {
  const pathname = usePathname();
  const {data: session} = useSession()
  const { section, id } = params;

  

  return (
    <div>
      {pathname.startsWith("/artisan-dashboard") && section == "dashboard" && (
        <ArtisanDashboard user={{ name: "John Doe" }} />
      )}
      {pathname.startsWith("/artisan-dashboard") && section == "mylistings" && (
        <ArtisanListingsPage session={session} />
      )}
      {pathname.startsWith("/artisan-dashboard") && section == "orders" && (
        <ArtisanOrdersPage />
      )}
      {pathname.startsWith("/artisan-dashboard") && section == "profile" && (
        <ArtisanProfile 
       />
      )}
      {pathname.startsWith("/artisan-dashboard") && section == "settings" && (
        <ArtisanSettings />
      )}
    </div>
  );
};

export default page;
