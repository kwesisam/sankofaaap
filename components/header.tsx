"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Menu, X, ShoppingBag } from "lucide-react";
import { useWeb3 } from "@/hooks/use-web3";
import { signOut, useSession } from "next-auth/react";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import Blockies from "react-blockies";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const address: `0x${string}` | undefined = session?.user?.id?.startsWith("0x")
    ? (session.user.id as `0x${string}`)
    : undefined;

  console.log(address);

  const { data: ensName } = useEnsName({
    address,
    chainId: 1,
  });

  const { data: avatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: 1,
  });

  console.log(ensName, avatar);
  const isActive = (path: string) => pathname === path;

  console.log(session);

  const goToSignIn = () => {
    window.location.href = "/signin";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mr-6">
          <div className="relative h-8 w-8">
            <Image
              src="/sankofabird.png"
              alt="Sankofa Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden md:inline-block font-bold text-lg">
            Sankofa
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-1">
          <Link
            href="/marketplace"
            className={`transition-colors hover:text-amber-600 ${
              isActive("/marketplace") ? "text-amber-600" : ""
            }`}
          >
            Marketplace
          </Link>
          <Link
            href="/artisans"
            className={`transition-colors hover:text-amber-600 ${
              isActive("/artisans") ? "text-amber-600" : ""
            }`}
          >
            Artisans
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-amber-600 ${
              isActive("/about") ? "text-amber-600" : ""
            }`}
          >
            About
          </Link>
        </nav>

        {/* Desktop Search and Actions */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <form className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-8 bg-background"
            />
          </form>

          {session && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
          )}

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {address == undefined ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`${session.user.image}`}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {(session.user?.name && session.user.name.charAt(0)) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : ensName && avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={avatar}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {ensName ?? address.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Blockies
                      seed={address?.toLowerCase() || "default"}
                      size={10}
                      scale={3}
                      className="rounded-full"
                    />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href={`${
                      session.user.type == "artisan"
                        ? `/artisan-dashboard/dashboard/${session.user.id}`
                        : `/user-dashboard/dashboard/${session.user.id}`
                    }`}
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {session.user.type == "user" && (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/user-dashboard/myorders/${session.user.id}`}>
                      Orders
                    </Link>
                  </DropdownMenuItem>
                )}

                {session.user.type == "artisan" && (
                  <DropdownMenuItem asChild>
                    <Link href="/create-listing">Create Listing</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    signOut({
                      callbackUrl: "/",
                    });
                  }}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={goToSignIn}
              variant="default"
              className="bg-amber-600 hover:bg-amber-700"
            >
              Sign in
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden ml-auto gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden p-4 border-b">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-8 bg-background"
            />
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b">
          <nav className="flex flex-col p-4 gap-4 text-sm font-medium">
            <Link
              href="/marketplace"
              className={`transition-colors hover:text-amber-600 ${
                isActive("/marketplace") ? "text-amber-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/artisans"
              className={`transition-colors hover:text-amber-600 ${
                isActive("/artisans") ? "text-amber-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Artisans
            </Link>
            <Link
              href="/about"
              className={`transition-colors hover:text-amber-600 ${
                isActive("/about") ? "text-amber-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {session ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`${session.user.image}`}
                      alt={session.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {(session.user?.name && session.user.name.charAt(0)) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user?.email || ""}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-amber-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="transition-colors hover:text-amber-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                {session.user?.type == "artisan" && (
                  <Link
                    href="/create-listing"
                    className="transition-colors hover:text-amber-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Listing
                  </Link>
                )}
                <Button variant="outline" className="mt-2 bg-transparent">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={goToSignIn}
                className="bg-amber-600 hover:bg-amber-700 mt-2"
              >
                Sign in
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
