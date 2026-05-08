/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { toast } from "sonner";
import { BadgeDollarSign, Check, Loader2, PencilLine, Plus, RefreshCw, Save, Trash2, Users } from "lucide-react";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { subscriptionService, type SubscriptionBillingCycle, type SubscriptionPlan, type SubscriptionPlanPayload, type SubscriptionStatus } from "@/services/subscription.service";

type StatusForm = {
  status: SubscriptionStatus;
  note: string;
  paymentReference: string;
};

type PlanForm = {
  code: string;
  name: string;
  billingCycle: SubscriptionBillingCycle;
  price: string;
  currencyCode: string;
  durationDays: string;
  maxStaff: string;
  maxProducts: string;
  maxInvoices: string;
  maxReports: boolean;
  maxDiscounts: string;
  isActive: boolean;
};

type ShopRecord = {
  id?: string;
  _id?: string;
  status?: SubscriptionStatus;
  note?: string;
  paymentReference?: string;
  shopName?: string;
  name?: string;
  planName?: string;
  shop?: {
    shopName?: string;
    name?: string;
  } | null;
  plan?: {
    name?: string;
  } | null;
  [key: string]: unknown;
};

const statusOptions: SubscriptionStatus[] = ["TRIAL", "ACTIVE", "PAST_DUE", "EXPIRED", "CANCELED", "SUSPENDED"];

const emptyPlanForm: PlanForm = {
  code: "",
  name: "",
  billingCycle: "MONTHLY",
  price: "0",
  currencyCode: "USD",
  durationDays: "30",
  maxStaff: "0",
  maxProducts: "0",
  maxInvoices: "0",
  maxReports: false,
  maxDiscounts: "0",
  isActive: true,
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

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const planToForm = (plan: SubscriptionPlan): PlanForm => ({
  code: plan.code,
  name: plan.name,
  billingCycle: plan.billingCycle,
  price: String(plan.price ?? 0),
  currencyCode: plan.currencyCode ?? "USD",
  durationDays: String(plan.durationDays ?? 30),
  maxStaff: String(plan.maxStaff ?? 0),
  maxProducts: String(plan.maxProducts ?? 0),
  maxInvoices: String(plan.maxInvoices ?? 0),
  maxReports: Boolean(plan.maxReports),
  maxDiscounts: String(plan.maxDiscounts ?? 0),
  isActive: plan.isActive !== false,
});

const planFeatureSummary = (plan: SubscriptionPlan) => {
  if (!plan.features) return [] as string[];

  if (Array.isArray(plan.features)) {
    return plan.features.map((item) => String(item)).filter(Boolean);
  }

  return Object.entries(plan.features)
    .map(([key, value]) => {
      if (value === true) return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
      if (value === false || value === null || value === undefined || value === "") return "";
      return `${key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ")}: ${String(value)}`;
    })
    .filter(Boolean)
    .slice(0, 4);
};

const statusColor = (s?: SubscriptionStatus) => {
  switch (s) {
    case "TRIAL":
      return "bg-violet-500 text-white";
    case "ACTIVE":
      return "bg-emerald-500 text-white";
    case "PAST_DUE":
      return "bg-amber-500 text-zinc-900";
    case "EXPIRED":
      return "bg-zinc-500 text-white";
    case "CANCELED":
      return "bg-rose-500 text-white";
    case "SUSPENDED":
      return "bg-amber-600 text-white";
    default:
      return "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950";
  }
};

export default function SubscriptionManagement() {
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([]);
  const [records, setRecords] = React.useState<ShopRecord[]>([]);
  const [planForm, setPlanForm] = React.useState<PlanForm>(emptyPlanForm);
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null);
  const [statusForms, setStatusForms] = React.useState<Record<string, StatusForm>>({});
  const [loading, setLoading] = React.useState(true);
  const [savingPlan, setSavingPlan] = React.useState(false);
  const [savingStatusId, setSavingStatusId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const [plansResult, recordsResult] = await Promise.all([
      subscriptionService.getAllSubscriptionPlans(),
      subscriptionService.getAllShopSubscriptions(),
    ]);

    if (!plansResult.success) {
      setError(plansResult.error || "Failed to load subscription plans");
    } else {
      setPlans(plansResult.data ?? []);
    }

    if (!recordsResult.success) {
      setError((current) => current || recordsResult.error || "Failed to load subscription records");
    } else {
      const loadedRecords = recordsResult.data ?? [];
      setRecords(loadedRecords);
      setStatusForms(
        loadedRecords.reduce<Record<string, StatusForm>>((accumulator, record) => {
          const recordId = String(record?.id ?? record?._id ?? "");
          if (!recordId) return accumulator;

          accumulator[recordId] = {
            status: (record?.status ?? "ACTIVE") as SubscriptionStatus,
            note: String(record?.note ?? ""),
            paymentReference: String(record?.paymentReference ?? ""),
          };
          return accumulator;
        }, {}),
      );
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadData]);

  const startCreate = () => {
    setSelectedPlanId(null);
    setPlanForm(emptyPlanForm);
    setMessage(null);
    setError(null);
  };

  const startEdit = (plan: SubscriptionPlan) => {
    setSelectedPlanId(String(plan.id ?? ""));
    setPlanForm(planToForm(plan));
    setMessage(null);
    setError(null);
  };

  const submitPlan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingPlan(true);
    setError(null);
    setMessage(null);

    // features JSON removed from dashboard; send empty features object
    const parsedFeatures: Record<string, unknown> = {};

    const payload: SubscriptionPlanPayload = {
      code: planForm.code.trim(),
      name: planForm.name.trim(),
      billingCycle: planForm.billingCycle,
      price: toNumber(planForm.price),
      currencyCode: planForm.currencyCode.trim(),
      durationDays: toNumber(planForm.durationDays),
      maxStaff: toNumber(planForm.maxStaff),
      maxProducts: toNumber(planForm.maxProducts),
      maxInvoices: toNumber(planForm.maxInvoices),
      maxReports: planForm.maxReports,
      maxDiscounts: toNumber(planForm.maxDiscounts),
      features: parsedFeatures,
      isActive: planForm.isActive,
    };

    const response = selectedPlanId
      ? await subscriptionService.updateSubscriptionPlan(selectedPlanId, payload)
      : await subscriptionService.createSubscriptionPlan(payload);

    if (!response.success) {
      const details = (response as any).errorDetails;
      if (Array.isArray(details)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msgs = details.map((d) => String((d as any).message ?? JSON.stringify(d))).join("; ");
        setError(`${response.message ?? response.error ?? "Validation error"}: ${msgs}`);
        toast.error(`${response.message ?? response.error ?? "Validation error"}: ${msgs}`);
      } else {
        setError(response.error || "Unable to save subscription plan");
        toast.error(response.error || "Unable to save subscription plan");
      }
      setSavingPlan(false);
      return;
    }

    setMessage(response.message || "Subscription plan saved successfully");
    toast.success(response.message || "Subscription plan saved successfully");
    setSavingPlan(false);
    await loadData();
    startCreate();
  };

  const deletePlan = async (id: string) => {
    const shouldDelete = window.confirm("Delete this subscription plan?");
    if (!shouldDelete) return;

    setDeletingId(id);
    setError(null);
    setMessage(null);

    const response = await subscriptionService.deleteSubscriptionPlan(id);
    if (!response.success) {
      const details = (response as any).errorDetails;
      if (Array.isArray(details)) {
        const msgs = details.map((d) => String((d as any).message ?? JSON.stringify(d))).join("; ");
        setError(`${response.message ?? response.error ?? "Validation error"}: ${msgs}`);
        toast.error(`${response.message ?? response.error ?? "Validation error"}: ${msgs}`);
      } else {
        setError(response.error || "Unable to delete subscription plan");
        toast.error(response.error || "Unable to delete subscription plan");
      }
      setDeletingId(null);
      return;
    }

    setMessage(response.message || "Subscription plan deleted successfully");
    toast.success(response.message || "Subscription plan deleted successfully");
    setDeletingId(null);
    await loadData();
    if (selectedPlanId === id) {
      startCreate();
    }
  };

  const updateStatusForm = (recordId: string, patch: Partial<StatusForm>) => {
    setStatusForms((current) => ({
      ...current,
      [recordId]: {
        ...(current[recordId] ?? ({ status: "ACTIVE", note: "", paymentReference: "" } as StatusForm)),
        ...patch,
      },
    }));
  };

  const submitStatus = async (recordId: string) => {
    const form = statusForms[recordId];
    if (!form) return;

    setSavingStatusId(recordId);
    setError(null);
    setMessage(null);

    const response = await subscriptionService.updateShopSubscriptionStatus(recordId, {
      status: form.status,
      note: form.note.trim() || undefined,
      paymentReference: form.paymentReference.trim() || undefined,
    });

    if (!response.success) {
      const details = (response as any).errorDetails;
      if (Array.isArray(details)) {
        const msgs = details.map((d) => String((d as any).message ?? JSON.stringify(d))).join("; ");
        setError(`${response.message ?? response.error ?? "Validation error"}: ${msgs}`);
        toast.error(`${response.message ?? response.error ?? "Validation error"}: ${msgs}`);
      } else {
        setError(response.error || "Unable to update subscription status");
        toast.error(response.error || "Unable to update subscription status");
      }
      setSavingStatusId(null);
      return;
    }

    setMessage(response.message || "Subscription status updated successfully");
    toast.success(response.message || "Subscription status updated successfully");
    setSavingStatusId(null);
    await loadData();
  };

  const activePlans = plans.filter((plan) => plan.isActive !== false);

  return (
    <section className="space-y-6">
      <DashboardRoutePage
        title="Subscriptions"
        description="Create, edit, and activate pricing plans from the super-admin dashboard."
        badge="Billing"
        accent="from-slate-700 to-zinc-950"
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-zinc-500">Plan library</p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">Active subscription plans</h2>
            </div>
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <Plus size={14} />
              New plan
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-44 animate-pulse rounded-[1.5rem] border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-black/70" />
              ))
            ) : activePlans.length > 0 ? (
              activePlans.map((plan) => {
                const features = planFeatureSummary(plan);
                return (
                  <article key={plan.id ?? plan.code} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-black/60">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white dark:bg-white dark:text-zinc-950">
                          {plan.billingCycle}
                        </span>
                        <h3 className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">{plan.name}</h3>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                          {plan.code}
                        </p>
                      </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-right dark:border-zinc-800 dark:bg-black">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Price</p>
                        <p className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                          {formatMoney(plan.price, plan.currencyCode)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                      <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-zinc-800">{plan.durationDays} days</span>
                      <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-zinc-800">Staff {plan.maxStaff ?? 0}</span>
                      <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-zinc-800">Products {plan.maxProducts ?? 0}</span>
                      <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-zinc-800">Invoices {plan.maxInvoices ?? 0}</span>
                    </div>

                    {features.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                              <Check size={12} strokeWidth={3} />
                            </span>
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(plan)}
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-3.5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:scale-[1.01] dark:bg-white dark:text-zinc-950"
                      >
                        <PencilLine size={13} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePlan(String(plan.id ?? ""))}
                        disabled={deletingId === plan.id}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3.5 py-2 text-xs font-black uppercase tracking-[0.18em] text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        {deletingId === plan.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-500 dark:border-zinc-800 dark:bg-black/60 dark:text-zinc-400">
                No active plans yet. Create one from the editor panel.
              </div>
            )}
          </div>
        </div>

        <form onSubmit={submitPlan} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-zinc-500">Editor</p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">{selectedPlanId ? "Update plan" : "Create plan"}</h2>
            </div>
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Code</span>
              <input
                value={planForm.code}
                onChange={(event) => setPlanForm((current) => ({ ...current, code: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="starter-monthly"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Name</span>
              <input
                value={planForm.name}
                onChange={(event) => setPlanForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="Starter"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Billing cycle</span>
              <select
                value={planForm.billingCycle}
                onChange={(event) => setPlanForm((current) => ({ ...current, billingCycle: event.target.value as SubscriptionBillingCycle }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Price</span>
              <input
                value={planForm.price}
                onChange={(event) => setPlanForm((current) => ({ ...current, price: event.target.value }))}
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="29.99"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Currency</span>
              <input
                value={planForm.currencyCode}
                onChange={(event) => setPlanForm((current) => ({ ...current, currencyCode: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="USD"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Duration days</span>
              <input
                value={planForm.durationDays}
                onChange={(event) => setPlanForm((current) => ({ ...current, durationDays: event.target.value }))}
                type="number"
                min="1"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="30"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Max staff</span>
              <input
                value={planForm.maxStaff}
                onChange={(event) => setPlanForm((current) => ({ ...current, maxStaff: event.target.value }))}
                type="number"
                min="0"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="5"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Max products</span>
              <input
                value={planForm.maxProducts}
                onChange={(event) => setPlanForm((current) => ({ ...current, maxProducts: event.target.value }))}
                type="number"
                min="0"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="100"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Max invoices</span>
              <input
                value={planForm.maxInvoices}
                onChange={(event) => setPlanForm((current) => ({ ...current, maxInvoices: event.target.value }))}
                type="number"
                min="0"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="500"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-zinc-500">Max discounts</span>
              <input
                value={planForm.maxDiscounts}
                onChange={(event) => setPlanForm((current) => ({ ...current, maxDiscounts: event.target.value }))}
                type="number"
                min="0"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                placeholder="10"
              />
            </label>
          </div>

          {/* Features JSON removed from dashboard editor intentionally */}

          <div className="mt-4 flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={planForm.maxReports}
                onChange={(event) => setPlanForm((current) => ({ ...current, maxReports: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Reports enabled
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={planForm.isActive}
                onChange={(event) => setPlanForm((current) => ({ ...current, isActive: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Active
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={savingPlan}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950"
            >
              {savingPlan ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {selectedPlanId ? "Update plan" : "Create plan"}
            </button>
            {selectedPlanId ? (
              <button
                type="button"
                onClick={startCreate}
                className="rounded-full border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-500/12 p-3 text-purple-600 ring-1 ring-purple-100 dark:ring-purple-900/30">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-zinc-500">Subscription records</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">Manage shop access</h2>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {records.length > 0 ? (
              records.slice(0, 8).map((record) => {
                const recordId = String(record?.id ?? record?._id ?? "");
                const shopLabel = record.shop?.shopName ?? record.shop?.name ?? record.shopName ?? record.name ?? "Shop";
                const planLabel = record.plan?.name ?? record.planName ?? "Unknown";
                const currentForm = statusForms[recordId] ?? {
                  status: (record?.status ?? "ACTIVE") as SubscriptionStatus,
                  note: String(record?.note ?? ""),
                  paymentReference: String(record?.paymentReference ?? ""),
                };

                return (
                  <article key={recordId || `${record?.shopId ?? "record"}`} className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-black/60">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/60" />
                    <div className="flex flex-wrap items-start justify-between gap-3 pl-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">{shopLabel}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                          Plan: {planLabel}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${statusColor(record?.status)}`}>
                        {String(record?.status ?? "ACTIVE")}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        <span>Status</span>
                        <select
                          value={currentForm.status}
                          onChange={(event) => updateStatusForm(recordId, { status: event.target.value as SubscriptionStatus })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-black dark:text-white"
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        <span>Payment reference</span>
                        <input
                          value={currentForm.paymentReference}
                          onChange={(event) => updateStatusForm(recordId, { paymentReference: event.target.value })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-black dark:text-white"
                          placeholder="INV-2026-001"
                        />
                      </label>
                    </div>

                    <label className="mt-3 block space-y-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                      <span>Note</span>
                      <textarea
                        value={currentForm.note}
                        onChange={(event) => updateStatusForm(recordId, { note: event.target.value })}
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-black dark:text-white"
                        placeholder="Optional admin note"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => submitStatus(recordId)}
                      disabled={savingStatusId === recordId}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                    >
                      {savingStatusId === recordId ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      Save status
                    </button>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
                No shop subscription records found.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-600 p-3 text-white shadow-sm">
              <BadgeDollarSign size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-zinc-500">Snapshot</p>
              <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold text-zinc-950 dark:text-white">Pricing health
                <span className="ml-2 inline-block rounded-full bg-purple-600/10 px-2 py-0.5 text-xs font-semibold text-purple-600">Test</span>
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-black/60">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Plans</p>
              <p className="mt-2 text-3xl font-semibold text-purple-600 dark:text-purple-400">{plans.length}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Total plans loaded from the backend.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-black/60">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">Active</p>
              <p className="mt-2 text-3xl font-semibold text-purple-600 dark:text-purple-400">{activePlans.length}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Visible to customers on the public pricing page.</p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-zinc-500">How it works</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-300">
              The public pricing section reads from the same backend API, so any change here appears on the live homepage after the next fetch.
            </p>
          </div>
        </section>
      </div>

      {(error || message) && (
        <div className={`rounded-[1.5rem] border px-5 py-4 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"}`}>
          {error || message}
        </div>
      )}
    </section>
  );
}
