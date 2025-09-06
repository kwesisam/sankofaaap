
"use client";

import AppProvider from "../provider/provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <AppProvider>{children}</AppProvider>
      <Toaster />
    </main>
  );
}
