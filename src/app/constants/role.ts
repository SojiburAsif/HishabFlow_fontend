export const Role = {
    SUPER_ADMIN: "SUPER_ADMIN",
    SHOP_OWNER: "SHOP_OWNER",
    STAFF: "STAFF",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const ROLE_LIST: RoleType[] = [Role.SUPER_ADMIN, Role.SHOP_OWNER, Role.STAFF];