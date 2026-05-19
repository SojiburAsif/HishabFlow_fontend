"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, CreditCard, Loader2, Sparkles, ShieldCheck, CalendarClock } from "lucide-react";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { paymentService } from "@/services/payment.service";
import { shopService, type ShopData } from "@/services/shop.service";
import { subscriptionService, type SubscriptionPlan } from "@/services/subscription.service";

type SubscriptionState = {
	planName: string;
	billingCycle: string;
	status: "trial" | "active" | "expired" | "inactive";
	priceLabel: string;
	startedAtLabel: string;
	endsAtLabel: string;
	daysRemaining: number;
	featureSummary: string[];
};

const formatMoney = (amount: number | string, currencyCode?: string | null) => {
	const numericAmount = Number(amount) || 0;
	const code = (currencyCode || "USD").toUpperCase();

	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: code,
			maximumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
		}).format(numericAmount);
	} catch {
		return `${code} ${numericAmount.toFixed(numericAmount % 1 === 0 ? 0 : 2)}`;
	}
};

const normalizeLabel = (value: string) =>
	value
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[_-]/g, " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());

const featureSummary = (plan: SubscriptionPlan) => {
	const summary: string[] = [];
	const push = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed || summary.includes(trimmed)) return;
		summary.push(trimmed);
	};

	if (Array.isArray(plan.features)) {
		plan.features.forEach((item) => push(String(item)));
	} else if (plan.features && typeof plan.features === "object") {
		Object.entries(plan.features).forEach(([key, value]) => {
			if (value === false || value === null || value === undefined) return;
			if (value === true) {
				push(normalizeLabel(key));
				return;
			}
			push(`${normalizeLabel(key)}: ${String(value)}`);
		});
	}

	if (plan.maxStaff != null) push(`Up to ${plan.maxStaff} staff`);
	if (plan.maxProducts != null) push(`Up to ${plan.maxProducts} products`);
	if (plan.maxInvoices != null) push(`Up to ${plan.maxInvoices} invoices`);
	if (plan.maxReports != null) push(plan.maxReports ? "Reports included" : "Reports disabled");

	return summary.slice(0, 4);
};

const getState = (shop: ShopData | null): SubscriptionState | null => {
	if (!shop) return null;

	const endDateValue = shop.subscriptionEndsAt || shop.trialEndsAt || null;
	const endDate = endDateValue ? new Date(endDateValue) : null;
	const now = Date.now();
	const daysRemaining = endDate ? Math.max(0, Math.ceil((endDate.getTime() - now) / (1000 * 60 * 60 * 24))) : 0;
	const normalizedStatus = String(shop.subscriptionStatus || "").toUpperCase();
	const isExpired = daysRemaining <= 0 || normalizedStatus === "EXPIRED" || normalizedStatus === "CANCELED" || normalizedStatus === "SUSPENDED";
	const isTrial = normalizedStatus === "TRIAL" || !shop.currentPlanId;
	const status: SubscriptionState["status"] = isExpired ? "expired" : isTrial ? "trial" : "active";
	const currentPlan = shop.currentPlan;
	const planName = currentPlan?.name || (status === "trial" ? "Free Trial" : "Active Subscription");
	const billingCycle = currentPlan?.billingCycle || (status === "trial" ? "TRIAL" : "MONTHLY");
	const priceLabel = currentPlan ? `${formatMoney(currentPlan.price ?? 0, currentPlan.currencyCode)}/${String(currentPlan.billingCycle || "MONTHLY").toLowerCase()}` : "Free";

	return {
		planName,
		billingCycle,
		status,
		priceLabel,
		startedAtLabel: new Date(shop.trialEndsAt || shop.subscriptionEndsAt || Date.now()).toLocaleDateString(),
		endsAtLabel: endDate ? endDate.toLocaleDateString() : "No expiry date",
		daysRemaining,
		featureSummary: currentPlan ? featureSummary(currentPlan as SubscriptionPlan) : [],
	};
};

export default function ShopSubscriptionOverview() {
	const [plans, setPlans] = React.useState<SubscriptionPlan[]>([]);
	const [shop, setShop] = React.useState<ShopData | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [checkoutUrl, setCheckoutUrl] = React.useState<string | null>(null);

	const subscription = React.useMemo(() => getState(shop), [shop]);

	React.useEffect(() => {
		if (checkoutUrl) {
			window.location.href = checkoutUrl;
		}
	}, [checkoutUrl]);

	React.useEffect(() => {
		let mounted = true;

		const load = async () => {
			setLoading(true);
			setError(null);

			const [shopResult, plansResult] = await Promise.all([shopService.getMyShop(), subscriptionService.getPublicPlans()]);

			if (!mounted) return;

			if (!shopResult.success || !shopResult.data) {
				setError(shopResult.error || "Failed to load your shop data");
			} else {
				setShop(shopResult.data);
			}

			if (!plansResult.success) {
				setError((current) => current || plansResult.error || "Failed to load subscription plans");
				setPlans([]);
			} else {
				setPlans((plansResult.data ?? []).filter((plan) => plan.isActive !== false));
			}

			setLoading(false);
		};

		void load();

		return () => {
			mounted = false;
		};
	}, []);

	const handleChoosePlan = async (plan: SubscriptionPlan) => {
		if (!plan.id || selectedPlanId) return;
		if (!shop?.id) {
			setError("Shop information is still loading. Please wait and try again.");
			return;
		}

		setSelectedPlanId(plan.id);
		setError(null);

		const result = await paymentService.initiatePayment({
			planId: plan.id,
			shopId: shop.id,
			amount: Number(plan.price),
			purpose: `${plan.name} subscription - ${plan.billingCycle}`,
		});

		if (result.success && result.data?.checkoutUrl) {
			setCheckoutUrl(result.data.checkoutUrl);
			return;
		}

		setError(result.error || "Failed to start checkout for this plan");
		setSelectedPlanId(null);
	};

	return (
		<section className="space-y-6">
			<DashboardRoutePage
				title="Subscriptions"
				description="See your active plan, remaining trial time, and available upgrade paths."
				badge="Shop Owner"
				accent="from-violet-500 to-fuchsia-500"
			/>

			{error ? (
				<div className="rounded-[2rem] border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200 flex items-center gap-3">
					<AlertCircle className="h-5 w-5 shrink-0" />
					{error}
				</div>
			) : null}

			<div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
				<div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black">
					<p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-zinc-500">Current subscription</p>
					<h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">{subscription?.planName || "Loading subscription..."}</h2>
					<div className="mt-4 flex flex-wrap items-center gap-3">
						<span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] ${subscription?.status === "active" ? "bg-emerald-500 text-white" : subscription?.status === "trial" ? "bg-amber-500 text-zinc-950" : subscription?.status === "expired" ? "bg-rose-500 text-white" : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"}`}>
							<ShieldCheck size={14} />
							{subscription?.status || "checking"}
						</span>
						<span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-zinc-800 dark:text-zinc-300">
							<CalendarClock size={14} />
							{subscription ? `${subscription.daysRemaining} day(s) left` : "Loading..."}
						</span>
					</div>

					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
							<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Billing cycle</p>
							<p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">{subscription?.billingCycle || "Monthly"}</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
							<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Price</p>
							<p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">{subscription?.priceLabel || "Free"}</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
							<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Starts</p>
							<p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">{subscription?.startedAtLabel || "-"}</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
							<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Ends</p>
							<p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">{subscription?.endsAtLabel || "-"}</p>
						</div>
					</div>

					{subscription?.featureSummary?.length ? (
						<div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
							<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Plan features</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{subscription.featureSummary.map((item) => (
									<span key={item} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-zinc-800 dark:text-zinc-300">
										{item}
									</span>
								))}
							</div>
						</div>
					) : null}

					<div className="mt-6 flex flex-wrap gap-3">
						<Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
							Back to dashboard <ArrowRight size={14} />
						</Link>
						<Link href="/dashboard/payment-success" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900">
							Payment status <CreditCard size={14} />
						</Link>
					</div>
				</div>

				<div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-zinc-500">Upgrade path</p>
							<h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">Available plans</h2>
						</div>
						<Sparkles className="text-violet-500" size={18} />
					</div>

					{loading ? (
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							{Array.from({ length: 4 }).map((_, index) => (
								<div key={index} className="h-56 animate-pulse rounded-[1.5rem] border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950" />
							))}
						</div>
					) : plans.length > 0 ? (
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							{plans.map((plan) => {
								const isCurrentPlan = plan.id && plan.id === shop?.currentPlanId;
								const disabled = !plan.id || selectedPlanId === plan.id;
								return (
									<article key={plan.id ?? plan.code} className={`rounded-[1.5rem] border p-4 ${isCurrentPlan ? "border-emerald-500/40 bg-emerald-500/5" : "border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950/70"}`}>
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">{plan.billingCycle}</p>
												<h3 className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">{plan.name}</h3>
												<p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">{plan.code}</p>
											</div>
											<div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right dark:border-zinc-800 dark:bg-black">
												<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Price</p>
												<p className="mt-1 text-base font-semibold text-zinc-950 dark:text-white">{formatMoney(plan.price, plan.currencyCode)}</p>
											</div>
										</div>

										<div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
											<span className="rounded-full border border-slate-200 px-3 py-1 dark:border-zinc-800">{plan.durationDays} days</span>
											<span className="rounded-full border border-slate-200 px-3 py-1 dark:border-zinc-800">Staff {plan.maxStaff ?? 0}</span>
											<span className="rounded-full border border-slate-200 px-3 py-1 dark:border-zinc-800">Products {plan.maxProducts ?? 0}</span>
										</div>

										{isCurrentPlan ? (
											<div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 flex items-center gap-2">
												<CheckCircle2 size={16} /> Current plan
											</div>
										) : (
											<button
												type="button"
												onClick={() => void handleChoosePlan(plan)}
												disabled={disabled}
												className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
											>
												{selectedPlanId === plan.id ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
												{selectedPlanId === plan.id ? "Redirecting..." : "Choose plan"}
											</button>
										)}
									</article>
								);
							})}
						</div>
					) : (
						<div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
							No active plans are available right now.
						</div>
					)}
				</div>
			</div>
		</section>
	);
}