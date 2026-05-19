/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

export interface ShopData {
	id: string;
	shopName: string;
	slug: string;
	description?: string;
	image?: string;
	status: string;
	subscriptionStatus: string;
	currentPlanId?: string;
	subscriptionStartsAt?: string;
	currentPlan?: {
		id?: string;
		code?: string;
		name?: string;
		billingCycle?: string;
		price?: number | string;
		currencyCode?: string | null;
		durationDays?: number;
		maxStaff?: number | null;
		maxProducts?: number | null;
		maxInvoices?: number | null;
		maxReports?: boolean | null;
		maxDiscounts?: number | null;
	} | null;
	subscriptionEndsAt?: string;
	trialEndsAt?: string;
	subscriptions?: Array<{
		id: string;
		status?: string;
		startsAt?: string;
		endsAt?: string;
		paymentReference?: string | null;
		transactionId?: string | null;
		plan?: {
			name?: string;
			code?: string;
		} | null;
	}> | null;
}

export interface UserProfile {
	id: string;
	email: string;
	emailVerified: boolean;
	name?: string;
	image?: string;
}

export interface ServiceResponse<T = unknown> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
	errorDetails?: unknown;
}

const requestJson = async <T>(url: string, init?: RequestInit): Promise<ServiceResponse<T>> => {
	try {
		const response = await fetch(url, {
			credentials: "include",
			cache: "no-store",
			...init,
			headers: {
				"Content-Type": "application/json",
				...(init?.headers ?? {}),
			},
		});

		const payload = await response.json().catch(() => ({}));

		if (!response.ok) {
			return {
				success: false,
				error: payload?.message || payload?.error || "Request failed",
				errorDetails: payload?.errorSources || payload?.errors || undefined,
			};
		}

		return {
			success: true,
			message: payload?.message,
			data: payload?.data,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Network error",
		};
	}
};

export const shopService = {
	async getMyShop(): Promise<ServiceResponse<ShopData>> {
		return requestJson<ShopData>(
			`${API_BASE_URL}/shops/me`,
			{
				method: "GET",
			}
		);
	},

	async initiateShopCheckout(data: any): Promise<ServiceResponse<any>> {
		return requestJson<any>(
			`${API_BASE_URL}/shops/checkout`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);
	},

	async updateMyShop(data: Partial<ShopData>): Promise<ServiceResponse<ShopData>> {
		return requestJson<ShopData>(
			`${API_BASE_URL}/shops/me`,
			{
				method: "PATCH",
				body: JSON.stringify(data),
			}
		);
	},

	async getShopStaff(): Promise<ServiceResponse<any[]>> {
		return requestJson<any[]>(
			`${API_BASE_URL}/shops/me/staff`,
			{
				method: "GET",
			}
		);
	},

	async createStaffAccount(data: any): Promise<ServiceResponse<any>> {
		return requestJson<any>(
			`${API_BASE_URL}/shops/me/staff`,
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);
	},
};
