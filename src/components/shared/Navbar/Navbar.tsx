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
} | null;

async function getNavbarUser(): Promise<NavbarUser> {
  try {
    const serverEnv = getServerEnv();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;

    // Try to get user info from API first
    const cookieParts: string[] = [];
    if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
    if (sessionToken) cookieParts.push(`better-auth.session_token=${sessionToken}`);

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
            const email = data.email ?? '';
            const name = data.name ?? data.fullName ?? email;
            const role = data.role ?? 'SHOP_OWNER';

            return {
              name,
              email,
              role,
              shortName: (name || email || 'User').split(' ')[0],
              avatar: data.avatarUrl ?? data.image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email || 'user')}`,
            };
          }
        }
      } catch (error) {
        // API call failed, attempting token fallback
      }
    }

    // Fallback: Extract user info from JWT token if API fails
    if (accessToken) {
      try {
        const decoded = jwtUtils.decodedToken(accessToken);
        
        if (decoded && typeof decoded === 'object') {
          const email = (decoded as any).email || '';
          const name = (decoded as any).name || (decoded as any).fullName || email;
          const role = (decoded as any).role || 'SHOP_OWNER';

          return {
            name,
            email,
            role,
            shortName: (name || email || 'User').split(' ')[0],
            avatar: (decoded as any).avatarUrl || (decoded as any).image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email || 'user')}`,
          };
        }
      } catch (error) {
        // Token fallback error
      }
    }

    return null;
  } catch (error) {
    // Error in navbar user fetching
    return null;
  }
}

export default async function Navbar() {
  const user = await getNavbarUser();
  return <ClientNavbar user={user} />;
}
