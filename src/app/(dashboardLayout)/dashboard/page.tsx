import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/app/constants/role";
import { buildDashboardUser, getUserInfoFromApi } from "@/lib/authUtils";
import { getServerEnv } from "@/lib/env";

const resolveDashboardPath = async () => {
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
  if (user?.role === Role.SUPER_ADMIN) return "/dashboard/admin";
  if (user?.role === Role.STAFF) return "/dashboard/staff";
  return "/dashboard/shop-owner";
};

export default async function DashboardRouterPage() {
  redirect(await resolveDashboardPath());
}
