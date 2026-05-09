import React from "react";
import { cookies } from "next/headers";
import { ROLE_LABELS, Role, normalizeRole } from "@/app/constants/role";
import { AppSidebar } from "@/components/shared/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { buildDashboardUser, getUserInfoFromApi, type DashboardUser } from "@/lib/authUtils";
import { getServerEnv } from "@/lib/env";

const getCurrentDashboardUser = async (): Promise<DashboardUser | null> => {
  try {
    const serverEnv = getServerEnv();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const cookieParts: string[] = [];
    if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
    if (sessionToken) cookieParts.push(`better-auth.session_token=${sessionToken}`);

    const userInfo = await getUserInfoFromApi(serverEnv.BASE_API_URL ?? "", {
      cookieHeader: cookieParts.length ? cookieParts.join("; ") : undefined,
      accessToken,
      sessionToken,
    });

    const user = buildDashboardUser(userInfo, accessToken);
    if (user) return user;

    const fallbackRole = normalizeRole(sessionToken ? Role.SHOP_OWNER : null) ?? Role.SHOP_OWNER;
    return {
      role: fallbackRole,
      shortName: ROLE_LABELS[fallbackRole].split(" ")[0],
    };
  } catch {
    return null;
  }
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentDashboardUser();

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar user={user ?? { role: Role.SHOP_OWNER }} />
      <SidebarInset className="bg-slate-50 dark:bg-zinc-950">
        <main className="min-h-svh p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
