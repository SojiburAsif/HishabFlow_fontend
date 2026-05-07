export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SHOP_OWNER: 'SHOP_OWNER',
  STAFF: 'STAFF',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const ROLE_LIST: RoleType[] = [Role.SUPER_ADMIN, Role.SHOP_OWNER, Role.STAFF];

export const ROLE_LABELS: Record<RoleType, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.SHOP_OWNER]: 'Shop Owner',
  [Role.STAFF]: 'Staff',
};

export const ROLE_DASHBOARD_ROUTE: Record<RoleType, string> = {
  [Role.SUPER_ADMIN]: '/dashboard',
  [Role.SHOP_OWNER]: '/dashboard',
  [Role.STAFF]: '/dashboard',
};

export const normalizeRole = (role: unknown): RoleType | null => {
  if (!role) return null;

  const normalized = String(role).toUpperCase();
  if (normalized === Role.SUPER_ADMIN || normalized === 'SUPER-ADMIN' || normalized === 'ADMIN') return Role.SUPER_ADMIN;
  if (normalized === Role.SHOP_OWNER || normalized === 'SHOP-OWNER' || normalized === 'OWNER') return Role.SHOP_OWNER;
  if (normalized === Role.STAFF) return Role.STAFF;
  return null;
};

export const getRoleLabel = (role?: RoleType | string | null) => {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_LABELS[normalized] : 'Guest';
};

export const getDefaultDashboardRoute = (role?: RoleType | string | null) => {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_DASHBOARD_ROUTE[normalized] : '/dashboard';
};

export const getDashboardAliasRole = (pathname: string): RoleType | null => {
  if (pathname.startsWith('/admin/dashboard')) return Role.SUPER_ADMIN;
  if (pathname.startsWith('/staff/dashboard')) return Role.STAFF;
  return null;
};

export const getRouteOwner = (pathname: string): RoleType | null => getDashboardAliasRole(pathname);

export const isAuthRoute = (pathname: string) => pathname === '/login' || pathname === '/register';

export const isDashboardRoute = (pathname: string) => pathname === '/dashboard' || pathname.startsWith('/dashboard/');
