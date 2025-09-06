
"use client";
import React from "react";
import { notFound, usePathname } from "next/navigation";
import BuyerDashboard from "@/app/ui/BuyerDashboard";
import BuyerOrdersPage from "@/app/ui/BuyOrders";
import BuyerNFTs from "@/app/ui/BuyerNFTs";
import BuyerSettings from "@/app/ui/BuyerSettings";
import BuyerProfile from "@/app/ui/BuyerProfile";

type Props = {
  params: {
    section: string;
    id: string;
  };
};

const page = ({ params }: Props) => {
  const pathname = usePathname();
  const { section, id } = params;

  return (
    <div>
      {pathname.startsWith("/user-dashboard") && section == "dashboard" && (
        <BuyerDashboard  />
      )}
      {pathname.startsWith("/user-dashboard") && section == "myorders" && (
        <BuyerOrdersPage />
      )}
      {pathname.startsWith("/user-dashboard") && section == "mynfts" && (
        <BuyerNFTs />
      )}
      {pathname.startsWith("/user-dashboard") && section == "profile" && (
        <BuyerProfile />
      )}
      {pathname.startsWith("/user-dashboard") && section == "settings" && (
        <BuyerSettings />
      )}
    </div>
  );
};

export default page;
