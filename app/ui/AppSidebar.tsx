import {
  Calendar,
  CreditCard,
  Home,
  Inbox,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardUser } from "./DashboardUser";
import { DashboardSF } from "./DashboardSF";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEnsAvatar, useEnsName } from "wagmi";
import Image from "next/image";
// Menu items.
let items = [
  {
    title: "Dashboard",
    url: "/artisan-dashboard/dashboard/",
    icon: Home,
    type: "artisan",
  },
  {
    title: "Dashboard",
    url: "/user-dashboard/dashboard/",
    icon: Home,
    type: "user",
  },
  {
    title: "My Orders",
    url: "/user-dashboard/myorders/",
    icon: Inbox,
    type: "user",
  },
  {
    title: "My NFTs",
    url: "/user-dashboard/mynfts/",
    icon: Calendar,
    type: "user",
  },
  {
    title: "My Listings",
    url: "/artisan-dashboard/mylistings/",
    icon: Calendar,
    type: "artisan",
  },
  {
    title: "Orders Received",
    url: "/artisan-dashboard/orders/",
    icon: Calendar,
    type: "artisan",
  },
  {
    title: "Home",
    url: "/",
    icon: Home,
    type: "guests",
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Home,
    type: "guests",
  },
];

interface AppSidebarProps {
  pathname: string;
}

export function AppSidebar({ pathname }: AppSidebarProps) {
  let content = null;
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

  const resetMultipleUrls = (conditions: any, newUrl: any) => {
    return items.map((item) =>
      conditions.some(
        (condition: any) =>
          item.title === condition.title && item.type === condition.type
      )
        ? { ...item, url: newUrl }
        : item
    );
  };

  if (pathname.startsWith("/artisan-dashboard")) {
    content = "artisan";
    if (session?.user?.id) {
      // Reset URL for artisan dashboard
      items = resetMultipleUrls(
        [{ title: "Dashboard", type: "artisan" }],
        `/artisan-dashboard/dashboard/${session.user.id}`
      );

      items = resetMultipleUrls(
        [{ title: "My Listings", type: "artisan" }],
        `/artisan-dashboard/mylistings/${session.user.id}`
      );

      items = resetMultipleUrls(
        [{ title: "Orders Received", type: "artisan" }],
        `/artisan-dashboard/orders/${session.user.id}`
      );
    }
  } else if (pathname.startsWith("/user-dashboard")) {
    content = "user";
    if (session?.user?.id) {
      items = resetMultipleUrls(
        [{ title: "Dashboard", type: "user" }],
        `/user-dashboard/dashboard/${session.user.id}`
      );

      items = resetMultipleUrls(
        [{ title: "My Orders", type: "user" }],
        `/user-dashboard/myorders/${session.user.id}`
      );

      items = resetMultipleUrls(
        [{ title: "My NFTs", type: "user" }],
        `/user-dashboard/mynfts/${session.user.id}`
      );
    }
  } else {
    content = "guest";
  }

  const filteredItems = items.filter((item) => {
    return item.type === content;
  });

  return (
    <Sidebar>
      <SidebarContent className="sidebar-content">
        <Link href="/" className="flex items-center gap-3 pl-5 pt-5">
          <div className="relative h-8 w-8">
            <Image
              src="/sankofabird.png"
              alt="Sankofa Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden md:inline-block font-bold text-lg text-gray-900">
            Sankofa
          </span>
        </Link>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.url}
                        className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
                      >
                        <item.icon className="icon" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <DashboardSF
          items={[
            {
              title: "Profile",
              url:
                content === "artisan"
                  ? `/artisan-dashboard/profile/${session?.user.id}`
                  : content === "user"
                  ? `/user-dashboard/profile/${session?.user.id}`
                  : "#",
              icon: User,
            },
            {
              title: "Settings",
              url:
                content === "artisan"
                  ? `/artisan-dashboard/settings/${session?.user.id}`
                  : content === "user"
                  ? `/user-dashboard/settings/${session?.user.id}`
                  : "#",
              icon: Settings,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter className="sidebar-footer">
        <DashboardUser
          user={{
            name:
              address === undefined
                ? session?.user.name ?? ""
                : ensName ?? session?.user.name ?? "",
            email: session?.user.email ?? "",
            avatar:
              address === undefined
                ? session?.user.image ?? ""
                : avatar ?? session?.user.id ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
