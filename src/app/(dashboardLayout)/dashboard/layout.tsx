import { Role, type RoleType } from "@/app/constants/role";
import { AppSidebar } from "@/components/shared/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";


export default async function DashboardLayout({
  admin,
  shopOwner,
  client,
  children,
}: {
  admin: React.ReactNode;
  shopOwner: React.ReactNode;
  client: React.ReactNode;
  children?: React.ReactNode;
}) {
  const user: { role: RoleType } = { role: Role.SUPER_ADMIN };
  const activeContentMap = {
    [Role.SUPER_ADMIN]: admin,
    [Role.SHOP_OWNER]: shopOwner,
    [Role.STAFF]: client,
  } as const;

  const activeContent = activeContentMap[user.role] ?? children;

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar user={user} />
      <SidebarInset className="bg-slate-50 dark:bg-zinc-950">
        <main className="min-h-svh p-4 md:p-6">
          {activeContent}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}