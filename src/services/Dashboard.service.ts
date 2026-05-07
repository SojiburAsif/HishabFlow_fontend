/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

export type DashboardViewMode = "admin" | "shop" | "staff";

export interface DashboardSeriesPoint {
	label: string;
	value?: number;
	count: number;
}

export interface DashboardRevenuePoint {
	shopName: string;
	revenue: number;
	profit: number;
	invoices: number;
}

export interface DashboardProductPoint {
	productId: string;
	name: string;
	soldQuantity: number;
	revenue: number;
	profit: number;
}

export interface DashboardCountPoint {
	label: string;
	count: number;
}

export interface DashboardInvoiceItem {
	id: string;
	invoiceNumber: string;
	grandTotal: number;
	totalProfit: number;
	createdAt: string;
	status?: string;
	shop?: { shopName?: string | null } | null;
	createdByUser?: { name?: string | null; email?: string | null } | null;
}

export interface DashboardShopItem {
	id: string;
	shopName: string;
	status: string;
	subscriptionStatus: string;
	createdAt: string;
	ownerProfile?: {
		user?: {
			name?: string | null;
			email?: string | null;
		} | null;
	} | null;
}

export interface DashboardProductItem {
	id: string;
	name: string;
	stock: number;
	reorderLevel: number;
	isActive: boolean;
	updatedAt?: string;
}

export interface DashboardStaffItem {
	id: string;
	displayName?: string | null;
	designation?: string | null;
	canSell?: boolean;
	canViewReports?: boolean;
	canManageInventory?: boolean;
	isActive?: boolean;
	user?: {
		name?: string | null;
		email?: string | null;
	} | null;
}

export interface DashboardStatsResponse {
	viewMode: DashboardViewMode;
	permissions?: {
		canViewReports?: boolean;
	};
	shop?: {
		id: string;
		name: string;
		status: string;
		subscriptionStatus: string;
		isDashboardLocked: boolean;
		currentPlan?: string | null;
		ownerName?: string | null;
	} | null;
	overview?: {
		users?: { total: number; active: number; inactive: number; suspended: number };
		shops?: { total: number; active: number; pending: number; suspended: number };
		commerce?: {
			products: number;
			categories: number;
			invoices: number;
			revenue: number;
			profit: number;
			lowStockProducts: number;
		};
		subscriptions?: {
			total: number;
			active: number;
			trial: number;
			expired: number;
			canceled: number;
			pastDue: number;
		};
		staff?: number;
		products?: number;
		activeProducts?: number;
		categories?: number;
		invoices?: number;
		revenue?: number;
		profit?: number;
		currentMonthRevenue?: number;
		currentMonthProfit?: number;
		lowStockProducts?: number;
		stockMovements?: number;
	};
	charts?: {
		revenueByMonth?: DashboardSeriesPoint[];
		shopStatus?: DashboardCountPoint[];
		subscriptionStatus?: DashboardCountPoint[];
		topShops?: DashboardRevenuePoint[];
		topProducts?: DashboardProductPoint[];
		stockMovements?: DashboardCountPoint[];
		invoiceStatus?: DashboardCountPoint[];
	};
	recent?: {
		invoices?: DashboardInvoiceItem[];
		shops?: DashboardShopItem[];
		products?: DashboardProductItem[];
		staff?: DashboardStaffItem[];
	};
	lowStockProducts?: DashboardProductItem[];
	recentPerformance?: {
		monthToDateRevenue?: number;
		monthToDateProfit?: number;
	};
}

export interface ServiceResponse<T = unknown> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
}

class DashboardService {
	async getDashboardStats(): Promise<ServiceResponse<DashboardStatsResponse>> {
		try {
			const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
				method: "GET",
				credentials: "include",
				cache: "no-store",
			});

			const data = await response.json();

			if (!response.ok) {
				return {
					success: false,
					error: data.message || "Failed to load dashboard stats",
				};
			}

			return {
				success: true,
				message: data.message || "Dashboard stats loaded successfully",
				data: data.data,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An error occurred while loading dashboard stats";

			return {
				success: false,
				error: errorMessage,
			};
		}
	}
}

export const dashboardService = new DashboardService();
