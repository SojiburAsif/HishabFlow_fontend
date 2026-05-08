/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

export type SubscriptionBillingCycle = "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "EXPIRED" | "CANCELED" | "SUSPENDED";

export interface SubscriptionPlan {
	id?: string;
	code: string;
	name: string;
	billingCycle: SubscriptionBillingCycle;
	price: number | string;
	currencyCode?: string | null;
	durationDays: number;
	maxStaff?: number | null;
	maxProducts?: number | null;
	maxInvoices?: number | null;
	maxReports?: boolean | null;
	maxDiscounts?: number | null;
	features?: Record<string, unknown> | string[] | null;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface SubscriptionPlanPayload {
	code?: string;
	name?: string;
	billingCycle?: SubscriptionBillingCycle;
	price?: number;
	currencyCode?: string;
	durationDays?: number;
	maxStaff?: number | null;
	maxProducts?: number | null;
	maxInvoices?: number | null;
	maxReports?: boolean | null;
	maxDiscounts?: number | null;
	features?: Record<string, unknown>;
	isActive?: boolean;
}

export interface ShopSubscriptionUpdatePayload {
	status: SubscriptionStatus;
	note?: string;
	paymentReference?: string;
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
			message: payload?.message || "Request completed successfully",
			data: payload?.data,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "An unexpected error occurred",
		};
	}
};

class SubscriptionService {
	async getPublicPlans(): Promise<ServiceResponse<SubscriptionPlan[]>> {
		return requestJson<SubscriptionPlan[]>(`${API_BASE_URL}/subscriptions/plans/public`);
	}

	async getPublicPlan(id: string): Promise<ServiceResponse<SubscriptionPlan>> {
		return requestJson<SubscriptionPlan>(`${API_BASE_URL}/subscriptions/plans/public/${id}`);
	}

	async getMySubscription(): Promise<ServiceResponse<any>> {
		return requestJson<any>(`${API_BASE_URL}/subscriptions/me`);
	}

	async getAllSubscriptionPlans(): Promise<ServiceResponse<SubscriptionPlan[]>> {
		return requestJson<SubscriptionPlan[]>(`${API_BASE_URL}/subscriptions/plans`);
	}

	async getSubscriptionPlan(id: string): Promise<ServiceResponse<SubscriptionPlan>> {
		return requestJson<SubscriptionPlan>(`${API_BASE_URL}/subscriptions/plans/${id}`);
	}

	async createSubscriptionPlan(payload: SubscriptionPlanPayload): Promise<ServiceResponse<SubscriptionPlan>> {
		return requestJson<SubscriptionPlan>(`${API_BASE_URL}/subscriptions/plans`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
	}

	async updateSubscriptionPlan(id: string, payload: SubscriptionPlanPayload): Promise<ServiceResponse<SubscriptionPlan>> {
		return requestJson<SubscriptionPlan>(`${API_BASE_URL}/subscriptions/plans/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
	}

	async deleteSubscriptionPlan(id: string): Promise<ServiceResponse<null>> {
		return requestJson<null>(`${API_BASE_URL}/subscriptions/plans/${id}`, {
			method: "DELETE",
		});
	}

	async getAllShopSubscriptions(): Promise<ServiceResponse<any[]>> {
		return requestJson<any[]>(`${API_BASE_URL}/subscriptions/records`);
	}

	async updateShopSubscriptionStatus(id: string, payload: ShopSubscriptionUpdatePayload): Promise<ServiceResponse<any>> {
		return requestJson<any>(`${API_BASE_URL}/subscriptions/records/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
	}
}

export const subscriptionService = new SubscriptionService();
