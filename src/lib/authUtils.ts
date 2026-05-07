import { getServerEnv } from '@/lib/env';
import { jwtUtils } from '@/lib/jwtUtils';
import { Role, normalizeRole, type RoleType } from '@/app/constants/role';

export type AuthUserInfo = {
  email: string;
  needPasswordChange?: boolean;
  emailVerified?: boolean;
  role?: string;
  name?: string;
  image?: string;
  avatarUrl?: string;
  fullName?: string;
};

export type AuthRequestTokens = {
  cookieHeader?: string | null;
  accessToken?: string | null;
  sessionToken?: string | null;
};

export type DashboardUser = {
  name?: string;
  email?: string;
  role: RoleType;
  avatar?: string;
  shortName?: string;
};

const readNeedPasswordChangeValue = (userInfo: AuthUserInfo | null): boolean => {
  if (!userInfo) return false;

  const infoAny = userInfo as Record<string, unknown>;
  const direct = infoAny.needPasswordChange ?? infoAny.needPasswordchange;
  if (direct !== undefined) return Boolean(direct);

  const key = Object.keys(infoAny).find((candidate) => candidate.toLowerCase() === 'needpasswordchange');
  return key ? Boolean(infoAny[key]) : false;
};

export const readNeedPasswordChange = readNeedPasswordChangeValue;

export const getUserInfoFromApi = async (
  baseApiUrl: string,
  { cookieHeader, accessToken, sessionToken }: AuthRequestTokens
): Promise<AuthUserInfo | null> => {
  if (!baseApiUrl) {
    return null;
  }

  if (!accessToken && !sessionToken && !cookieHeader) {
    return null;
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    if (sessionToken) {
      headers['x-session-token'] = sessionToken;
    }

    const response = await fetch(`${baseApiUrl}/auth/me`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.data ?? null;
  } catch {
    return null;
  }
};

const getRoleFromToken = (accessToken: string | null | undefined, secret?: string | null): RoleType | null => {
  if (!accessToken || !secret) return null;

  const verified = jwtUtils.verifyToken(accessToken, secret);
  if (!verified.success) return null;

  return normalizeRole(verified.data.role);
};

export const buildDashboardUser = (
  userInfo: AuthUserInfo | null,
  accessToken?: string | null
): DashboardUser | null => {
  const serverEnv = getServerEnv();
  const accessTokenSecret = serverEnv.ACCESS_TOKEN_SECRET ?? serverEnv.JWT_ACCESS_SECRET;
  const role = normalizeRole(userInfo?.role) ?? getRoleFromToken(accessToken, accessTokenSecret) ?? Role.SHOP_OWNER;

  if (!userInfo && !accessToken) {
    return null;
  }

  const email = userInfo?.email ?? '';
  const name = userInfo?.name ?? userInfo?.fullName ?? email;

  return {
    name,
    email,
    role,
    shortName: (name || email || role).split(' ')[0],
    avatar: userInfo?.avatarUrl ?? userInfo?.image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email || role)}`,
  };
};