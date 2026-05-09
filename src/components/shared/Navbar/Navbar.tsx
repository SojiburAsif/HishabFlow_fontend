/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { cookies } from 'next/headers';
import { getServerEnv } from '@/lib/env';
import { jwtUtils } from '@/lib/jwtUtils';
import ClientNavbar from './ClientNavbar';

type NavbarUser = {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  shortName?: string;
  emailVerified?: boolean;
} | null;

const readUserImage = (source: any) => source?.image || undefined;

async function getNavbarUser(): Promise<NavbarUser> {
  try {
    const serverEnv = getServerEnv();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;
    const cookieParts: string[] = [];

    if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
    if (sessionToken) cookieParts.push(`better-auth.session_token=${sessionToken}`);

    if (cookieParts.length) {
      try {
        const profileRes = await fetch(`${serverEnv.BASE_API_URL}/users/me/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieParts.join('; '),
            ...(sessionToken ? { 'x-session-token': sessionToken } : {}),
            ...(!sessionToken && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          cache: 'no-store',
        });

        if (profileRes.ok) {
          const payload = await profileRes.json();
          const data = payload?.data;
          if (data) {
            const userData = data.user ?? data;
            const email = userData.email ?? data.email ?? '';
            const name = userData.name ?? data.name ?? data.fullName ?? email;
            const role = userData.role ?? data.role ?? 'SHOP_OWNER';

            return {
              name,
              email,
              role,
              shortName: (name || email || 'User').split(' ')[0],
              avatar: readUserImage(userData) || readUserImage(data),
              emailVerified: userData.emailVerified ?? data.emailVerified,
            };
          }
        }
      } catch {
        // Ignore profile fetch errors and continue to auth fallback.
      }
    }

    if (cookieParts.length) {
      try {
        const res = await fetch(`${serverEnv.BASE_API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieParts.join('; '),
            ...(sessionToken ? { 'x-session-token': sessionToken } : {}),
            ...(!sessionToken && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          cache: 'no-store',
        });

        if (res.ok) {
          const payload = await res.json();
          const data = payload?.data;
          if (data) {
            const userData = data.user ?? data;
            const email = userData.email ?? data.email ?? '';
            const name = userData.name ?? data.name ?? data.fullName ?? email;
            const role = userData.role ?? data.role ?? 'SHOP_OWNER';

            return {
              name,
              email,
              role,
              shortName: (name || email || 'User').split(' ')[0],
              avatar: readUserImage(userData) || readUserImage(data),
              emailVerified: userData.emailVerified ?? data.emailVerified,
            };
          }
        }
      } catch {
        // API call failed, attempting token fallback
      }
    }

    if (accessToken) {
      try {
        const decoded = jwtUtils.decodedToken(accessToken);

        if (decoded && typeof decoded === 'object') {
          const authUser = decoded as any;
          const email = authUser.email || '';
          const name = authUser.name || authUser.fullName || email;
          const role = authUser.role || 'SHOP_OWNER';

          return {
            name,
            email,
            role,
            shortName: (name || email || 'User').split(' ')[0],
            avatar: authUser.image || authUser.user?.image || undefined,
            emailVerified: authUser.emailVerified,
          };
        }
      } catch {
        // Token fallback error
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default async function Navbar() {
  const user = await getNavbarUser();
  return <ClientNavbar user={user} />;
}
