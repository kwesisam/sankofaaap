import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Web3Provider } from "@/components/web3-provider";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "./provider/provider";
import 'ethereum-identity-kit/css'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sankofa | African Artisan Marketplace",
  description:
    "Authentic African artistry with blockchain-verified authenticity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Web3Provider>
            <main className="flex-1">{children}</main>
          </Web3Provider>
        </AppProvider>
      </body>
    </html>
  );
}
