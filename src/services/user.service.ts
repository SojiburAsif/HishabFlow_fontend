/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

export type CurrentUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  image?: string;
  fullName?: string;
};

export interface UpdateProfilePayload {
  name?: string;
  fullName?: string;
  image?: string;
  avatarUrl?: string;
  [key: string]: any;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface ResetPasswordConfirmPayload {
  email: string;
  token: string;
  password: string;
}

export interface ServiceResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const response = await fetch('/api/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const payload = await response.json();
    return payload?.data ?? null;
  } catch {
    return null;
  }
};

class UserService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ServiceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to get profile',
        };
      }

      return {
        success: true,
        message: data.message || 'Profile retrieved successfully',
        data: data.data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while fetching profile';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<ServiceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to update profile',
        };
      }

      return {
        success: true,
        message: data.message || 'Profile updated successfully',
        data: data.data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while updating profile';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(payload: ResetPasswordPayload): Promise<ServiceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to request password reset',
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset email sent successfully',
        data: data.data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while requesting password reset';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(payload: ResetPasswordConfirmPayload): Promise<ServiceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to reset password',
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset successfully',
        data: data.data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while resetting password';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const userService = new UserService();
