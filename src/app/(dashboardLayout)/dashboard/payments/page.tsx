"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { paymentService } from "@/services/payment.service";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";

interface Payment {
	id: string;
	amount: number;
	status: string;
	createdAt: string;
	planName?: string;
	transactionId?: string;
	paymentReference?: string;
}

export default function DashboardPaymentsPage() {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		const loadPayments = async () => {
			try {
				const result = await paymentService.getMyPayments();
				if (!mounted) return;

				if (!result.success) {
					setError(result.error || "Failed to load payments");
					setPayments([]);
				} else {
					setPayments(result.data || []);
					setError(null);
				}
			} catch (err) {
				if (mounted) {
					setError("An error occurred while loading payments");
					console.error(err);
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		};

		loadPayments();

		return () => {
			mounted = false;
		};
	}, []);

	const getStatusIcon = (status: string) => {
		switch (status?.toUpperCase()) {
			case "PAID":
			case "ACTIVE":
				return <CheckCircle2 className="w-5 h-5 text-green-500" />;
			case "PENDING":
				return <Clock className="w-5 h-5 text-yellow-500" />;
			case "FAILED":
			case "CANCELLED":
				return <XCircle className="w-5 h-5 text-red-500" />;
			default:
				return <AlertCircle className="w-5 h-5 text-gray-500" />;
		}
	};

	const getStatusBadgeColor = (status: string) => {
		switch (status?.toUpperCase()) {
			case "PAID":
			case "ACTIVE":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "PENDING":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "FAILED":
			case "CANCELLED":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount || 0);
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<>
			<DashboardRoutePage
				title="Payments"
				description="View your payment history and transaction details."
				badge="Billing"
				accent="from-blue-500 to-cyan-500"
			/>

			<div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black md:p-8">
				{error && (
					<div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 p-4 mb-6">
						<div className="flex items-center gap-3">
							<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
							<p className="text-sm text-red-800 dark:text-red-200">{error}</p>
						</div>
					</div>
				)}

				{loading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="w-8 h-8 animate-spin text-blue-500" />
					</div>
				) : payments.length === 0 ? (
					<div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
						<AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
							No payments yet
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							When you make a payment, it will appear here.
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200 dark:border-gray-800">
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
										Transaction ID
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
										Amount
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
										Plan
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
										Status
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
										Date
									</th>
								</tr>
							</thead>
							<tbody>
								{payments.map((payment) => (
									<tr
										key={payment.id}
										className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
									>
										<td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono">
											{payment.transactionId || payment.id}
										</td>
										<td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
											{formatCurrency(payment.amount)}
										</td>
										<td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
											{payment.planName || "-"}
										</td>
										<td className="px-6 py-4 text-sm">
											<div className="flex items-center gap-2">
												{getStatusIcon(payment.status)}
												<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(payment.status)}`}>
													{payment.status || "Unknown"}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
											{formatDate(payment.createdAt)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
}
