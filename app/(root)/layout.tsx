
import { Web3Provider } from "@/components/web3-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AppProvider from "../provider/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <AppProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <section className="flex-1">{children}</section>
          <Footer />
        </div>
        <Toaster />
      </AppProvider>
    </main>
  );
}
