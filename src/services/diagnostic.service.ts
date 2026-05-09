import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

export interface AccountStatus {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  role: string;
  hasShopOwnerProfile: boolean;
  hasShop: boolean;
  hasStaffProfile: boolean;
  hasSuperAdminProfile: boolean;
  shopName?: string;
  shopStatus?: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const requestJson = async <T>(
  url: string,
  init?: RequestInit
): Promise<ServiceResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data: data?.data,
      message: data?.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Get detailed account status to diagnose setup issues
 */
export const getAccountStatus = async (): Promise<ServiceResponse<AccountStatus>> => {
  return requestJson<AccountStatus>(
    `${API_BASE_URL}/users/me/status`,
    { method: "GET" }
  );
};

/**
 * Provide user-friendly error message based on account status
 */
export const getAccountSetupGuidance = async (): Promise<{
  status: "ok" | "email-not-verified" | "no-shop-owner-profile" | "no-shop" | "error";
  message: string;
  actionUrl?: string;
  actionLabel?: string;
}> => {
  const result = await getAccountStatus();

  if (!result.success) {
    return {
      status: "error",
      message: result.error || "Unable to check account status",
    };
  }

  const accountStatus = result.data;
  if (!accountStatus) {
    return {
      status: "error",
      message: "Account information not available",
    };
  }

  // Check each condition
  if (!accountStatus.emailVerified) {
    return {
      status: "email-not-verified",
      message: "Please verify your email address to access all features.",
      actionLabel: "Resend verification email",
    };
  }

  if (!accountStatus.hasShopOwnerProfile) {
    return {
      status: "no-shop-owner-profile",
      message: "Your shop owner profile is not set up. Please contact support.",
    };
  }

  if (!accountStatus.hasShop) {
    return {
      status: "no-shop",
      message: "You need to create a shop first. You can purchase a subscription plan to get started.",
      actionLabel: "View subscription plans",
      actionUrl: "/subscriptions",
    };
  }

  return {
    status: "ok",
    message: "Your account is properly set up!",
  };
};

export const diagnosticService = {
  getAccountStatus,
  getAccountSetupGuidance,
};
