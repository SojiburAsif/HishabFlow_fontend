"use client";

import React from "react";
import { ArrowRight, Check, Crown, Loader2, Sparkles, Star, Zap, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { subscriptionService, type SubscriptionPlan } from "@/services/subscription.service";
import { paymentService } from "@/services/payment.service";
import { shopService, type ShopData } from "@/services/shop.service";
import { diagnosticService } from "@/services/diagnostic.service";

type BillingToggle = "MONTHLY" | "YEARLY";

type FeatureItem = {
  text: string;
  included: boolean;
};

const defaultPlans: SubscriptionPlan[] = [
  {
    code: "starter",
    name: "Starter",
    billingCycle: "MONTHLY",
    price: 0,
    currencyCode: "USD",
    durationDays: 30,
    maxStaff: 1,
    maxProducts: 50,
    maxInvoices: 100,
    maxReports: false,
    maxDiscounts: 0,
    features: { description: "Entry plan for new shops" },
    isActive: true,
  },
];

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

const normalizeKey = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const buildFeatures = (plan: SubscriptionPlan): FeatureItem[] => {
  const features: FeatureItem[] = [];
  const pushFeature = (text: string, included = true) => {
    const trimmed = text.trim();
    if (!trimmed || features.some((item) => item.text === trimmed)) return;
    features.push({ text: trimmed, included });
  };

  if (Array.isArray(plan.features)) {
    plan.features.forEach((feature) => pushFeature(String(feature)));
  } else if (plan.features && typeof plan.features === "object") {
    Object.entries(plan.features).forEach(([key, value]) => {
      if (value === false || value === null || value === undefined) return;
      if (value === true) {
        pushFeature(normalizeKey(key));
        return;
      }
      pushFeature(`${normalizeKey(key)}: ${String(value)}`);
    });
  }

  if (plan.maxStaff != null) pushFeature(`Up to ${plan.maxStaff} staff accounts`);
  if (plan.maxProducts != null) pushFeature(`Up to ${plan.maxProducts} products`);
  if (plan.maxInvoices != null) pushFeature(`Up to ${plan.maxInvoices} invoices`);
  if (plan.maxDiscounts != null) pushFeature(`Up to ${plan.maxDiscounts} discounts`);
  if (plan.maxReports != null) pushFeature(plan.maxReports ? "Reports access included" : "Reports access disabled", Boolean(plan.maxReports));

  return features.length > 0 ? features : [{ text: "Backend-managed plan features", included: true }];
};

const getDescription = (plan: SubscriptionPlan) => {
  if (plan.features && !Array.isArray(plan.features) && typeof plan.features === "object") {
    const featureMap = plan.features as Record<string, unknown>;
    const description = featureMap.description || featureMap.summary || featureMap.tagline;
    if (typeof description === "string" && description.trim()) {
      return description;
    }
  }

  return `${Number(plan.durationDays) || 0}-day access, billed ${plan.billingCycle === "MONTHLY" ? "monthly" : "yearly"}.`;
};

export default function SubscriptionSection() {
  const router = useRouter();

  const [billingCycle, setBillingCycle] = React.useState<BillingToggle>("MONTHLY");
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  // Initialize error from URL to avoid setState in effect
  const [error, setError] = React.useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('cancelled')) {
      window.history.replaceState({}, '', window.location.pathname);
      return 'Payment was cancelled. You can try again or choose a different plan.';
    }
    return null;
  });
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = React.useState(false);
  const [checkoutUrl, setCheckoutUrl] = React.useState<string | null>(null);
  const [currentShop, setCurrentShop] = React.useState<ShopData | null>(null);
  const [loadingShop, setLoadingShop] = React.useState(true);
  const [shopFetchError, setShopFetchError] = React.useState<string | null>(null);

  // Handle redirect to Stripe checkout when URL is ready
  React.useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  React.useEffect(() => {
    let mounted = true;

    const loadPlansAndShop = async () => {
      try {
        // Load subscription plans
        const plansResult = await subscriptionService.getPublicPlans();
        if (mounted) {
          if (!plansResult.success) {
            setError(plansResult.error || "Failed to load subscription plans");
            setPlans(defaultPlans);
          } else {
            setPlans(plansResult.data && plansResult.data.length > 0 ? plansResult.data : defaultPlans);
          }
        }

        // Load current user's shop
        const shopResult = await shopService.getMyShop();
        if (mounted) {
          if (shopResult.success && shopResult.data) {
            setCurrentShop(shopResult.data);
            setShopFetchError(null);
          } else if (shopResult.error?.includes("Forbidden")) {
            // Forbidden - need to diagnose why
            console.warn("Shop fetch forbidden, checking account status:", shopResult.error);
            
            // Get detailed account status to provide specific guidance
            const statusResult = await diagnosticService.getAccountStatus();
            if (statusResult.success && statusResult.data) {
              const accountStatus = statusResult.data;
              if (!accountStatus.emailVerified) {
                setShopFetchError("email-not-verified");
              } else if (!accountStatus.hasShopOwnerProfile) {
                setShopFetchError("no-shop-owner-profile");
              } else if (!accountStatus.hasShop) {
                setShopFetchError("no-shop");
              } else {
                setShopFetchError("unknown");
              }
            } else {
              setShopFetchError("unknown");
            }
          } else if (shopResult.error?.includes("Not Found")) {
            // No shop exists yet
            console.warn("Shop not found:", shopResult.error);
            setShopFetchError("no-shop");
          } else if (shopResult.error) {
            // Other errors
            console.warn("Shop fetch error:", shopResult.error);
            setShopFetchError("unknown");
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setLoadingShop(false);
        }
      }
    };

    void loadPlansAndShop();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPlans = plans.filter((plan) => plan.billingCycle === billingCycle && plan.isActive !== false);
  const displayPlans = filteredPlans.length > 0 ? filteredPlans : plans.filter((plan) => plan.isActive !== false);
  const cycleLabel = billingCycle === "MONTHLY" ? "mo" : "yr";

  const iconForPlan = (plan: SubscriptionPlan, index: number) => {
    const text = `${plan.name} ${plan.code}`.toLowerCase();
    if (text.includes("free") || text.includes("starter")) return <Zap className="text-zinc-300 dark:text-zinc-500" size={24} />;
    if (index === 1 || text.includes("pro") || text.includes("growth")) return <Star className="text-amber-400" size={24} fill="currentColor" fillOpacity={0.2} />;
    return <Crown className="text-emerald-400" size={24} fill="currentColor" fillOpacity={0.2} />;
  };

  const handlePlanSelection = async (plan: SubscriptionPlan) => {
    if (processingPayment || !plan.id) return;
    if (!currentShop?.id) {
      setError("Shop information is still loading. Please wait and try again.");
      return;
    }

    setProcessingPayment(true);
    setSelectedPlanId(plan.id);
    setError(null);

    try {
      // If we couldn't fetch the shop (403 error), don't try to initiate payment
      if (!currentShop && loadingShop === false) {
        if (shopFetchError === "email-not-verified") {
          setError("Please verify your email address before purchasing a subscription plan. Check your inbox for a verification link (check spam folder too).");
        } else if (shopFetchError === "no-shop") {
          setError("You can purchase a subscription plan to create your shop. Choose a plan below to get started!");
        } else if (shopFetchError === "no-shop-owner-profile") {
          setError("Your shop owner profile is missing. Please contact support to resolve this issue.");
        } else {
          setError("Unable to retrieve your shop information. Please verify your email and ensure your account is properly set up.");
        }
        setSelectedPlanId(null);
        setProcessingPayment(false);
        return;
      }

      if (!currentShop) {
        setError("You need to create a shop first before purchasing a subscription plan.");
        setSelectedPlanId(null);
        setProcessingPayment(false);
        return;
      }

      const result = await paymentService.initiatePayment({
        planId: plan.id,
        shopId: currentShop.id,
        amount: Number(plan.price),
        purpose: `${plan.name} subscription - ${plan.billingCycle}`,
      });

      if (result.success && result.data?.checkoutUrl) {
        // Set checkout URL - the useEffect will handle the redirect
        setCheckoutUrl(result.data.checkoutUrl);
      } else {
        // Check if error is due to email verification
        if (result.error?.includes("email")) {
          setError("Please verify your email address before purchasing a subscription plan.");
        } else {
          setError(result.error || "Failed to initiate payment. Please try again.");
        }
        setSelectedPlanId(null);
        setProcessingPayment(false);
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError("An error occurred while processing your request. Please try again.");
      setSelectedPlanId(null);
      setProcessingPayment(false);
    }
  };

  return (
    <section className="bg-black py-24 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="text-purple-600" size={20} />
            <span className="text-purple-600 font-black uppercase tracking-[0.2em] text-[10px]">Pricing Plans</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Flexible plans <br /> backed by live data
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Public subscription cards are rendered from the backend subscription module.
          </p>

          <div className="mt-10 flex items-center justify-center">
            <div className="p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center relative border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setBillingCycle("MONTHLY")}
                className={`px-8 py-2.5 rounded-full text-xs font-black transition-all relative z-10 ${billingCycle === "MONTHLY" ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}
              >
                Monthly
              </button>
                <button
                type="button"
                onClick={() => setBillingCycle("YEARLY")}
                className={`px-8 py-2.5 rounded-full text-xs font-black transition-all relative z-10 flex items-center gap-2 ${billingCycle === "YEARLY" ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}
              >
                Annually
                <span className="bg-purple-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">Save 20%</span>
              </button>

              <motion.div
                animate={{ x: billingCycle === "MONTHLY" ? 0 : 106 }}
                className="absolute h-9 bg-white dark:bg-zinc-800 rounded-full shadow-md border border-zinc-200 dark:border-zinc-700"
                style={{ width: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-8 rounded-[2rem] border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        ) : null}

        {shopFetchError && !currentShop ? (
          <div className="mb-8 rounded-[2rem] border border-yellow-500/30 bg-yellow-500/10 px-5 py-4 text-sm text-yellow-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              {shopFetchError === "email-not-verified" && (
                <>
                  <p className="font-semibold mb-1">Verification Required</p>
                  <p className="text-yellow-200/80">Please verify your email address to access subscription plans and purchase features. Check your inbox for a verification link (check spam folder too).</p>
                </>
              )}
              {shopFetchError === "no-shop" && (
                <>
                  <p className="font-semibold mb-1">Shop Not Created Yet</p>
                  <p className="text-yellow-200/80">You can view subscription plans below and purchase one to create your shop and start selling.</p>
                </>
              )}
              {shopFetchError === "no-shop-owner-profile" && (
                <>
                  <p className="font-semibold mb-1">Account Setup Issue</p>
                  <p className="text-yellow-200/80">Your shop owner profile is missing. Please contact support to resolve this issue.</p>
                </>
              )}
              {shopFetchError === "unknown" && (
                <>
                  <p className="font-semibold mb-1">Account Setup Required</p>
                  <p className="text-yellow-200/80">Unable to retrieve your shop information. Please verify your email and ensure your account is properly set up. Contact support if the issue persists.</p>
                </>
              )}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-[2.5rem] border border-zinc-800 bg-zinc-950/80 p-8" style={{ minHeight: "28rem" }} />
            ))
          ) : displayPlans.length > 0 ? (
            displayPlans.map((plan, index) => {
              const features = buildFeatures(plan);
              const isPopular = index === 1;

              return (
                <motion.div
                  key={plan.id ?? plan.code ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 border ${isPopular ? "bg-zinc-950 border-purple-600 shadow-2xl scale-105 z-10" : "bg-zinc-950/80 border-zinc-800 hover:border-purple-600/40"}`}
                >
                  {isPopular ? (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-purple-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                      <Star size={10} fill="white" />
                      Most Popular
                    </div>
                  ) : null}

                  <div className="mb-6 flex justify-between items-start">
                    <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm">
                      {iconForPlan(plan, index)}
                    </div>
                    {isPopular ? <Sparkles className="text-purple-600 opacity-50" size={20} /> : null}
                  </div>

                  <div className="mb-8">
                    <h3 className={`text-2xl font-black mb-3 ${isPopular ? "text-purple-600" : "text-zinc-900 dark:text-white"}`}>
                      {plan.name}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold leading-relaxed mb-6">
                      {getDescription(plan)}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white tracking-tighter">
                        {formatMoney(plan.price, plan.currencyCode)}
                      </span>
                      <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">/{cycleLabel}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlanSelection(plan)}
                    disabled={processingPayment || selectedPlanId === plan.id}
                    className={`w-full py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all mb-10 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed ${isPopular ? "bg-purple-600 text-white hover:opacity-95 disabled:hover:opacity-60" : "bg-zinc-900 text-white border border-zinc-800 hover:border-purple-600/40 disabled:border-zinc-800"}`}
                  >
                    {selectedPlanId === plan.id && processingPayment ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isPopular ? "Choose plan" : "Start plan"}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex-1 space-y-4">
                    {features.map((feature, featureIndex) => (
                      <div key={featureIndex} className={`flex items-start gap-3 ${feature.included ? "opacity-100" : "opacity-30"}`}>
                        <div className={`mt-0.5 p-0.5 rounded-full border ${feature.included ? "border-purple-600 text-purple-400" : "border-zinc-400 text-zinc-400"}`}>
                          {feature.included ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                        </div>
                        <span className={`text-[13px] font-bold ${feature.included ? "text-zinc-300" : "text-zinc-500"}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {isPopular ? (
                    <div
                      className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                      style={{ backgroundImage: "linear-gradient(to bottom right, rgba(16, 185, 129, 0.03), transparent)" }}
                    />
                  ) : null}
                </motion.div>
              );
            })
          ) : (
            <div className="md:col-span-3 rounded-[2.5rem] border border-dashed border-zinc-800 bg-zinc-950/60 p-8 text-center text-zinc-400">
              No active pricing plans were returned for the selected billing cycle.
            </div>
          )}
        </div>

        {!loading ? (
          <div className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Plans are reloaded from the backend on each visit.
          </div>
        ) : (
          <div className="mt-8 flex justify-center text-zinc-500">
            <Loader2 className="animate-spin" size={16} />
          </div>
        )}
      </div>
    </section>
  );
}
