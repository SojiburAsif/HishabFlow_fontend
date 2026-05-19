/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

export interface InitiatePaymentPayload {
	planId: string;
	shopId?: string;
	amount: number;
	purpose: string;
}

export interface ConfirmPaymentPayload {
	paymentReference: string;
	planId?: string;
}

export interface PaymentSession {
	success: boolean;
	paymentRequired: boolean;
	checkoutUrl: string;
	sessionId: string;
	publishableKey: string;
}

export interface PaymentConfirmation {
	success: boolean;
	subscription: any;
	message: string;
}

export interface MyPaymentsResponse {
	success: boolean;
	data: any[];
	message: string;
}

export interface AllPaymentsResponse {
	success: boolean;
	data: any[];
	message: string;
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

export const paymentService = {
	async initiatePayment(payload: InitiatePaymentPayload): Promise<ServiceResponse<PaymentSession>> {
		return requestJson<PaymentSession>(
			`${API_BASE_URL}/payments/initiate`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			}
		);
	},

	async confirmPayment(payload: ConfirmPaymentPayload): Promise<ServiceResponse<PaymentConfirmation>> {
		return requestJson<PaymentConfirmation>(
			`${API_BASE_URL}/payments/confirm`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			}
		);
	},

	async getMyPayments(): Promise<ServiceResponse<any[]>> {
		return requestJson<any[]>(
			`${API_BASE_URL}/payments/my`,
			{
				method: "GET",
			}
		);
	},

	async getAllPayments(): Promise<ServiceResponse<any[]>> {
		return requestJson<any[]>(
			`${API_BASE_URL}/payments/all`,
			{
				method: "GET",
			}
		);
	},

	async handlePaymentSuccess(sessionId: string): Promise<ServiceResponse<any>> {
		return requestJson(
			`${API_BASE_URL}/payments/success?session_id=${sessionId}`,
			{
				method: "GET",
			}
		);
	},

	async handlePaymentCancel(): Promise<ServiceResponse<any>> {
		return requestJson(
			`${API_BASE_URL}/payments/cancel`,
			{
				method: "GET",
			}
		);
	},
};
