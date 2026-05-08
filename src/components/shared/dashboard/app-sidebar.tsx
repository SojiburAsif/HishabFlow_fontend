"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import type { Route } from "@/types/Router.type";
import { Role, type RoleType } from "@/app/constants/role";
import { AdminRouters } from "@/Routers/superAdminRouter";
import { ShopOwnerRouters } from "@/Routers/shopOwnerRoute";
import { StaffRouters } from "@/Routers/stuffRouter";
import Logo from "@/components/shared/logo/logo";
import { authService } from "@/services/auth.service";

function cn(...inputs: (string | boolean | undefined | null | number)[]) {
  return inputs.filter(Boolean).join(" ");
}

type SidebarUser = {
  role: RoleType;
  name?: string;
  email?: string;
  avatar?: string;
  shortName?: string;
};

const getRoutesByRole = (role: RoleType): Route[] => {
  switch (role) {
    case Role.SUPER_ADMIN:
      return AdminRouters;
    case Role.SHOP_OWNER:
      return ShopOwnerRouters;
    case Role.STAFF:
      return StaffRouters;
    default:
      return ShopOwnerRouters;
  }
};

export function AppSidebar({
  user,
  ...props
}: {
  user: SidebarUser;
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const routes = getRoutesByRole(user.role);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setIsLoggingOut(false);
      router.refresh();
      router.replace("/login");
    }
  };

  return (
    <Sidebar
      {...props}
      className="border-r border-zinc-200 bg-white text-zinc-950 transition-colors duration-300 dark:border-zinc-900 dark:bg-black dark:text-white"
    >
      <SidebarContent className="flex h-full flex-col justify-between bg-white text-zinc-950 dark:bg-black dark:text-white">
        <div>
          <div className="px-6 py-8">
            <Link href="/" className="group flex items-center gap-3 transition-transform active:scale-95">
              <Logo />
            </Link>
          </div>

          <div className="space-y-4">
            {routes.map((group) => (
              <SidebarGroup key={group.title} className="px-4">
                <SidebarGroupLabel className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                  {group.title}
                </SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu className="gap-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.url;
                      const Icon = item.icon || LayoutDashboard;

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.url}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl px-4 py-4 font-bold transition-all duration-200 group",
                                isActive
                                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                                  : "text-zinc-600 hover:bg-zinc-100 hover:text-purple-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-purple-400"
                              )}
                            >
                              <Icon
                                size={18}
                                className={cn(
                                  "transition-transform group-hover:scale-110",
                                  isActive ? "text-white" : "text-zinc-500 group-hover:text-purple-600 dark:text-zinc-500 dark:group-hover:text-purple-400"
                                )}
                              />
                              <span className="text-sm tracking-wide">{item.title}</span>

                              {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </div>
        </div>

        <div className="px-4 pb-8">
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 font-bold text-purple-600 transition-all duration-200 hover:border-purple-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-transparent dark:bg-transparent dark:text-purple-300 dark:hover:border-purple-500 dark:hover:bg-zinc-900"
            >
              {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
              <span className="text-sm">{isLoggingOut ? "Logging out..." : "Logout Session"}</span>
            </button>
          </div>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
