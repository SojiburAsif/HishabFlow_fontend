import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  displayName?: string;
  phone?: string;
  shopName?: string;
  image?: string;
  shopImage?: string;
  preferredShopName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async registerUser(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          ...(payload.displayName && { displayName: payload.displayName }),
          ...(payload.phone && { phone: payload.phone }),
          ...(payload.shopName && { shopName: payload.shopName }),
          ...(payload.image && { image: payload.image }),
          ...(payload.shopImage && { shopImage: payload.shopImage }),
          ...(payload.preferredShopName && { preferredShopName: payload.preferredShopName }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Registration failed",
        };
      }

      // Backend sets cookies via Set-Cookie header with credentials: include
      return {
        success: true,
        message: data.message || "Registration successful",
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during registration";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Login user with email and password
   */
  async loginUser(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Login failed",
        };
      }

      // Backend sets cookies via Set-Cookie header with credentials: include
      return {
        success: true,
        message: data.message || "Login successful",
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during login";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Verify user email
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyEmail(_email: string, _token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Email verification failed",
        };
      }

      return {
        success: true,
        message: data.message || "Email verified successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during email verification";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Verify email OTP
   */
  async verifyEmailOtp(email: string, token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "OTP verification failed",
        };
      }

      return {
        success: true,
        message: data.message || "Email verified successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during OTP verification";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string, name?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to resend verification email",
        };
      }

      return {
        success: true,
        message: data.message || "Verification email sent",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred while resending verification email";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Resend OTP
   */
  async resendVerificationOtp(email: string, name?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to resend OTP",
        };
      }

      return {
        success: true,
        message: data.message || "OTP sent successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred while resending OTP";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to request password reset",
        };
      }

      return {
        success: true,
        message: data.message || "Password reset email sent",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during password reset request";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(
    email: string,
    token: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to reset password",
        };
      }

      return {
        success: true,
        message: data.message || "Password reset successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during password reset";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Logout user
   */
  async logout(sessionToken?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          sessionToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Logout failed",
        };
      }

      return {
        success: true,
        message: data.message || "Logged out successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during logout";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Refresh tokens
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Token refresh failed",
        };
      }

      // Backend sets new tokens via Set-Cookie header
      return {
        success: true,
        message: "Token refreshed successfully",
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during token refresh";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Google login
   */
  async googleLogin(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/google`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Google login failed",
        };
      }

      return {
        success: true,
        message: data.message || "Google login initiated",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during Google login";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Google login success callback
   */
  async googleLoginSuccess(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/success`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Google login success failed",
        };
      }

      // Backend sets tokens via Set-Cookie header
      return {
        success: true,
        message: data.message || "Google login successful",
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during Google login success";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const authService = new AuthService();
