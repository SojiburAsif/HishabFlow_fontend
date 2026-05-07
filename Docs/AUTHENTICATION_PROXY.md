# Authentication & Proxy — Overview

- **Purpose:** Concise documentation for the app's authentication flow, proxy middleware behavior, JWT handling, and helper utilities.
- **Primary files:** [src/proxy.ts](src/proxy.ts), [src/lib/jwtUtils.ts](src/lib/jwtUtils.ts), [src/lib/tokenUtils.ts](src/lib/tokenUtils.ts), [src/lib/env.ts](src/lib/env.ts), [src/lib/authUtils.ts](src/lib/authUtils.ts), [src/lib/cookieUtils.ts](src/lib/cookieUtils.ts)

## Proxy (middleware)

- **File:** [src/proxy.ts](src/proxy.ts)
- **Role:** Central Next.js middleware that runs on protected routes. It enforces access control and redirects based on authentication state and user role.
- **What it checks:**
  - **Cookies:** `accessToken` and `better-auth.session_token`.
  - **Access token verification:** uses `jwtUtils.verifyToken(token, secret)` with `JWT_ACCESS_SECRET` from `getServerEnv()`.
    - **Secret compatibility:** `ACCESS_TOKEN_SECRET` is accepted as a backend-compatible alias and is preferred when present.
  - **Fallback:** if token is missing or invalid, calls backend `/auth/me` via `getUserInfoFromApi(...)` using cookies, bearer token, or session token.
  - **Role resolution:** `normalizeRole(...)` + `getRouteOwner(pathname)` to decide which routes require which role.
  - **Special routes:** `/verify-email` and `/change-password` have dedicated logic for `emailVerified` and `needPasswordChange`.
- **Outcome actions:**
  - `NextResponse.next()` to continue.
  - `NextResponse.redirect(new URL('/login', request.url))` when unauthenticated for protected routes.
  - Redirect logged-in users away from auth pages into their dashboard.

## JWT utils

- **File:** [src/lib/jwtUtils.ts](src/lib/jwtUtils.ts)
- **Functions:**
  - `verifyToken(token, secret)` verifies JWT signature with `jsonwebtoken.verify` and returns `{ success: true, data }` or `{ success: false, message, error }`.
  - `decodedToken(token)` uses `jsonwebtoken.decode` to read payload without verifying the signature.
- **Usage in project:** `proxy.ts` uses `verifyToken` first for secure auth checks, and `decodedToken` only for non-critical payload inspection.

## Token utilities

- **File:** [src/lib/tokenUtils.ts](src/lib/tokenUtils.ts)
- **Functions:**
  - `getTokenSecondsRemaining(token)` reads JWT `exp` and computes remaining lifetime. Returns `0` for opaque or invalid tokens.
  - `setTokenInCookies(name, token, fallbackMaxAgeInSeconds)` aligns cookie `maxAge` with JWT expiry and falls back when no `exp` is present.

## Auth helpers

- **File:** [src/lib/authUtils.ts](src/lib/authUtils.ts)
- **Functions:**
  - `getUserInfoFromApi(baseApiUrl, tokens)` fetches `/auth/me` using cookie, bearer, or session-token auth.
  - `readNeedPasswordChange(userInfo)` resolves password-change state across backend payload variations.
  - `buildDashboardUser(userInfo, accessToken)` prepares a dashboard/sidebar user object with name, role, avatar, and short name.

## Environment variables

- `JWT_ACCESS_SECRET` is used by `jwtUtils.verifyToken`; `ACCESS_TOKEN_SECRET` is supported as a compatibility alias.
- `BASE_API_URL` is used by `getUserInfoFromApi` to contact the auth API.

## Common cookie names

- `accessToken` stores the JWT access token.
- `better-auth.session_token` stores the session token used for backend lookup.

## Typical request flow

1. Request arrives to Next.js and `proxy` runs.
2. Middleware reads `accessToken` and `better-auth.session_token` from cookies.
3. If `accessToken` exists, `jwtUtils.verifyToken` checks it with the configured access-token secret.
4. If the token is missing or invalid, middleware calls backend `/auth/me` with available auth headers.
5. Based on `getRouteOwner(pathname)` and the resolved role, middleware chooses `next()` or redirects to `/login`, `/dashboard`, or `/change-password`.

## Best practices

- Prefer verifying JWTs server-side with the configured access-token secret (`ACCESS_TOKEN_SECRET` or `JWT_ACCESS_SECRET`).
- Use `setTokenInCookies` so cookie lifetime matches token lifetime.
- Do not use `jwt.decode` for security-critical decisions.
- Keep dashboard role resolution based on backend role values: `SUPER_ADMIN`, `SHOP_OWNER`, and `STAFF`.