"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import Blockies from "react-blockies";
import { useEnsAvatar, useEnsName } from "wagmi";

export function DashboardUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();

  const address: `0x${string}` | undefined = session?.user?.id?.startsWith("0x")
    ? (session.user.id as `0x${string}`)
    : undefined;

  const { data: ensName } = useEnsName({
    address,
    chainId: 1,
  });

  const { data: avatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: 1,
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
                         <SidebarMenuButton
               size="lg"
               className="sidebar-user data-[state=open]:active"
             >
              {address == undefined ? (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : ensName && avatar ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={avatar}
                    alt={session?.user?.name || "User"}
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

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-gray-900">{user.name}</span>
                <span className="truncate text-xs text-gray-600">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight max-w-48 overflow-clip">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
