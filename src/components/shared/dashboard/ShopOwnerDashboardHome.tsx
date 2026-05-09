"use client";

import React, { useEffect, useState } from "react";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { shopService, type ShopData } from "@/services/shop.service";
import { dashboardService, type DashboardStatsResponse } from "@/services/Dashboard.service";
import { AlertCircle, CheckCircle, Clock, AlertTriangle, TrendingUp, Package, ShoppingCart, Users, FileText } from "lucide-react";

type SubscriptionInfo = {
  planName: string;
  billingCycle: string;
  price: string;
  status: "active" | "expired" | "trial" | "inactive";
  startDate: string;
  endDate: string;
  daysRemaining: number;
  features: {
    maxStaff?: number;
    maxProducts?: number;
    maxInvoices?: number;
  };
};

type StatCard = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
};

export default function ShopOwnerDashboardHome() {
  const [shop, setShop] = useState<ShopData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const [shopResult, statsResult] = await Promise.all([
        shopService.getMyShop(),
        dashboardService.getDashboardStats(),
      ]);
      
      if (!mounted) return;

      if (!shopResult.success) {
        setError(shopResult.error || "Failed to load shop data");
        setLoading(false);
        return;
      }

      if (!shopResult.data) {
        setError("Unable to load shop. Please refresh or contact support.");
        setLoading(false);
        return;
      }

      const shopData = shopResult.data;
      setShop(shopData);

      if (statsResult.success && statsResult.data) {
        setDashboardStats(statsResult.data);
      }

      const isTrialShop = shopData.subscriptionStatus === "TRIAL" && !shopData.currentPlanId;
      const endDate = shopData.subscriptionEndsAt || shopData.trialEndsAt;
      
      if (endDate) {
        const endDateObj = new Date(endDate);
        const now = new Date();
        const daysRemaining = Math.ceil((endDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        let status: SubscriptionInfo["status"] = "active";
        if (daysRemaining <= 0) {
          status = "expired";
        } else if (isTrialShop || daysRemaining <= 7) {
          status = "trial";
        }

        setSubscription({
          planName: isTrialShop ? "Free Trial" : shopData.currentPlanId ? "Active Plan" : "Free Plan",
          billingCycle: "monthly",
          price: isTrialShop ? "Free" : shopData.currentPlanId ? "$XX" : "Free",
          status,
          startDate: new Date().toLocaleDateString(),
          endDate: endDateObj.toLocaleDateString(),
          daysRemaining,
          features: {
            maxStaff: 10,
            maxProducts: 1000,
            maxInvoices: 5000,
          },
        });
      }

      setError(null);
      setLoading(false);
    };

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const getStatCards = (): StatCard[] => {
    if (!dashboardStats?.overview?.commerce) {
      return [];
    }

    const commerce = dashboardStats.overview.commerce;
    return [
      {
        label: "Total Products",
        value: commerce.products || 0,
        icon: <Package className="h-5 w-5" />,
        color: "from-blue-500 to-cyan-500",
      },
      {
        label: "Total Invoices",
        value: commerce.invoices || 0,
        icon: <FileText className="h-5 w-5" />,
        color: "from-purple-500 to-pink-500",
      },
      {
        label: "Total Revenue",
        value: `$${(commerce.revenue || 0).toFixed(2)}`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: "from-green-500 to-emerald-500",
      },
    ];
  };

  return (
    <>
      <DashboardRoutePage
        title="Dashboard"
        description="Welcome back! Here's an overview of your shop performance and subscription status."
        badge="Home"
        accent="from-purple-500 to-pink-500"
      />

      {loading ? (
        <div className="mt-8 space-y-4 animate-pulse">
          <div className="h-40 rounded-[2rem] bg-zinc-800" />
          <div className="h-40 rounded-[2rem] bg-zinc-800" />
          <div className="h-40 rounded-[2rem] bg-zinc-800" />
        </div>
      ) : error ? (
        <div className="mt-8 rounded-[2rem] border border-rose-500/30 bg-rose-500/10 p-6 flex items-start gap-4">
          <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-rose-400" />
          <div>
            <h3 className="mb-1 font-semibold text-rose-200">Unable to Load Shop Data</h3>
            <p className="text-sm text-rose-200/80">{error}</p>
            <a href="/dashboard/subscriptions" className="mt-3 inline-block rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700">
              View Subscription Plans
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-linear-to-br from-zinc-950 to-black p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-1 text-2xl font-bold text-white">{shop?.shopName}</h2>
                <p className="text-zinc-400">Shop ID: {shop?.id}</p>
              </div>
              <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${shop?.status === "ACTIVE" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}`}>
                {shop?.status}
              </span>
            </div>
            {shop?.description ? <p className="mb-4 text-zinc-300">{shop.description}</p> : null}
          </div>

          {getStatCards().length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {getStatCards().map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-zinc-700 hover:bg-black"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`rounded-lg bg-linear-to-br ${stat.color} p-3 text-white opacity-20`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {subscription ? (
            <div className={`mt-6 rounded-[2rem] border p-8 ${subscription.status === "expired" ? "border-rose-500/30 bg-rose-500/10" : subscription.status === "trial" ? "border-yellow-500/30 bg-yellow-500/10" : "border-green-500/30 bg-green-500/10"}`}>
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-xl font-bold text-white">Subscription Status</h3>
                  <p className={`text-sm ${subscription.status === "expired" ? "text-rose-200" : subscription.status === "trial" ? "text-yellow-200" : "text-green-200"}`}>
                    {subscription.status === "expired" ? "Your subscription has expired" : subscription.status === "trial" ? "Your subscription is expiring soon" : "Your subscription is active"}
                  </p>
                </div>
                {subscription.status === "expired" ? <AlertTriangle className="h-8 w-8 shrink-0 text-rose-400" /> : subscription.status === "active" ? <CheckCircle className="h-8 w-8 shrink-0 text-green-400" /> : <Clock className="h-8 w-8 shrink-0 text-yellow-400" />}
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
                  <p className="mb-1 text-xs text-zinc-400">Plan</p>
                  <p className="text-lg font-bold text-white">{subscription.planName}</p>
                  <p className="mt-1 text-sm text-zinc-300">{subscription.price}/{subscription.billingCycle}</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
                  <p className="mb-1 text-xs text-zinc-400">Expires</p>
                  <p className="text-lg font-bold text-white">{subscription.daysRemaining} days</p>
                  <p className="mt-1 text-sm text-zinc-300">{subscription.endDate}</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
                  <p className="mb-1 text-xs text-zinc-400">Status</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${subscription.status === "expired" ? "bg-rose-400" : subscription.status === "active" ? "bg-green-400" : "bg-yellow-400"}`} />
                    <p className="text-sm font-semibold text-white uppercase">{subscription.status}</p>
                  </div>
                </div>
              </div>

              {(subscription.status === "trial" || subscription.status === "expired") && (
                <a href="/dashboard/subscriptions" className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700">
                  {subscription.status === "expired" ? "Renew Subscription" : "Upgrade Plan"}
                </a>
              )}
            </div>
          ) : null}

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-bold text-white">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <a href="/dashboard/orders" className="group rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-purple-500 hover:bg-purple-500/10">
                <ShoppingCart className="mb-3 h-6 w-6 text-purple-400 transition-transform group-hover:scale-110" />
                <h4 className="font-semibold text-white">View Orders</h4>
                <p className="mt-1 text-xs text-zinc-400">Manage your recent orders</p>
              </a>
              <a href="/dashboard/products" className="group rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-blue-500 hover:bg-blue-500/10">
                <Package className="mb-3 h-6 w-6 text-blue-400 transition-transform group-hover:scale-110" />
                <h4 className="font-semibold text-white">View Products</h4>
                <p className="mt-1 text-xs text-zinc-400">Manage your inventory</p>
              </a>
              <a href="/dashboard/team" className="group rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-pink-500 hover:bg-pink-500/10">
                <Users className="mb-3 h-6 w-6 text-pink-400 transition-transform group-hover:scale-110" />
                <h4 className="font-semibold text-white">Team Members</h4>
                <p className="mt-1 text-xs text-zinc-400">Manage your staff</p>
              </a>
              <a href="/dashboard/reports" className="group rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-green-500 hover:bg-green-500/10">
                <TrendingUp className="mb-3 h-6 w-6 text-green-400 transition-transform group-hover:scale-110" />
                <h4 className="font-semibold text-white">View Reports</h4>
                <p className="mt-1 text-xs text-zinc-400">Check business analytics</p>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
