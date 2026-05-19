/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/env';
import { jwtUtils, type VerifyResult } from '@/lib/jwtUtils';
import {
  Role,
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isDashboardRoute,
  normalizeRole,
  type RoleType,
} from '@/app/constants/role';
import { getUserInfoFromApi, readNeedPasswordChange, type AuthUserInfo } from '@/lib/authUtils';

const getVerifiedTokenPayload = (verifiedToken: VerifyResult) => {
  return verifiedToken.success ? verifiedToken.data : null;
};

const getUserRole = (decodedToken: any, userInfo: AuthUserInfo | null, fallbackRole?: RoleType | null): RoleType | null => {
  const roleToNormalize = decodedToken?.role ?? userInfo?.role ?? fallbackRole ?? null;
  return normalizeRole(roleToNormalize);
};

const getAuthStatus = (verifiedToken: VerifyResult, sessionToken?: string | null, userInfo: AuthUserInfo | null = null) => {
  return verifiedToken.success || Boolean(sessionToken) || userInfo !== null;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const serverEnv = getServerEnv();
    const accessTokenSecret = serverEnv.ACCESS_TOKEN_SECRET ?? serverEnv.JWT_ACCESS_SECRET;
    const accessToken = request.cookies.get('accessToken')?.value;
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;

    const verifiedAccessToken: VerifyResult = accessToken && accessTokenSecret
      ? jwtUtils.verifyToken(accessToken, accessTokenSecret)
      : { success: false, message: 'Missing access token', error: null };

    const verifiedPayload = getVerifiedTokenPayload(verifiedAccessToken);
    const cookieParts: string[] = [];
    if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
    if (sessionToken) cookieParts.push(`better-auth.session_token=${sessionToken}`);

    const userInfo = await getUserInfoFromApi(serverEnv.BASE_API_URL ?? '', {
      cookieHeader: cookieParts.length ? cookieParts.join('; ') : undefined,
      accessToken,
      sessionToken,
    });

    const isAuthenticated = getAuthStatus(verifiedAccessToken, sessionToken, userInfo);
    const userRole = getUserRole(verifiedPayload, userInfo, sessionToken ? Role.SHOP_OWNER : null);
    const needsPasswordChange = readNeedPasswordChange(userInfo);
    const routeOwner = getRouteOwner(pathname);

    if (isAuthRoute(pathname)) {
      if (isAuthenticated) {
        const redirectTo = needsPasswordChange ? '/change-password' : getDefaultDashboardRoute(userRole);
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }

      return NextResponse.next();
    }

    if (pathname === '/change-password') {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (!needsPasswordChange) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
      }

      return NextResponse.next();
    }

    if (pathname === '/verify-email') {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (verifiedPayload?.emailVerified === false || userInfo?.emailVerified === false) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
    }

    const isAdminDashboardRoute = pathname === '/dashboard/admin' || pathname.startsWith('/dashboard/admin/');
    const isOwnerSubscriptionsRoute = pathname === '/dashboard/subscriptions' || pathname.startsWith('/dashboard/subscriptions/');

    if (isAdminDashboardRoute) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (userRole !== Role.SUPER_ADMIN) {
        return NextResponse.redirect(new URL('/dashboard/subscriptions', request.url));
      }

      return NextResponse.next();
    }

    if (isOwnerSubscriptionsRoute) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (userRole === Role.SUPER_ADMIN) {
        return NextResponse.redirect(new URL('/dashboard/admin/subscriptions', request.url));
      }

      return NextResponse.next();
    }

    if (routeOwner) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (!userRole || routeOwner !== userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
      }

      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isDashboardRoute(pathname)) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (needsPasswordChange) {
        return NextResponse.redirect(new URL('/change-password', request.url));
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)'],
};