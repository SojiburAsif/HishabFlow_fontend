"use client";

import React, { useEffect, useState } from "react";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { publicEnv } from "@/lib/env";
import { BarChart3, CreditCard, Loader2, TrendingUp, Users } from "lucide-react";

type AdminStatsOverview = {
  users?: { total?: number; active?: number; inactive?: number; suspended?: number };
  shops?: { total?: number; active?: number; pending?: number; suspended?: number };
  commerce?: { products?: number; categories?: number; invoices?: number; revenue?: number; profit?: number; lowStockProducts?: number };
  subscriptions?: { total?: number; active?: number; trial?: number; expired?: number; canceled?: number; pastDue?: number };
  staff?: number;
};

const fetchAdminOverview = async (): Promise<AdminStatsOverview | null> => {
  try {
    const response = await fetch(`${publicEnv.NEXT_PUBLIC_API_BASE_URL}/dashboard/stats`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.data?.overview ?? null;
  } catch {
    return null;
  }
};

export default function AdminDashboardHome() {
  const [overview, setOverview] = useState<AdminStatsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const data = await fetchAdminOverview();
      if (!mounted) return;
      setOverview(data);
      setLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    { title: "Total Users", value: overview?.users?.total ?? 0, icon: Users, accent: "from-blue-500 to-cyan-500" },
    { title: "Active Shops", value: overview?.shops?.active ?? 0, icon: BarChart3, accent: "from-emerald-500 to-teal-500" },
    { title: "Invoices", value: overview?.commerce?.invoices ?? 0, icon: CreditCard, accent: "from-violet-500 to-fuchsia-500" },
    { title: "Revenue", value: `$${Number(overview?.commerce?.revenue ?? 0).toFixed(2)}`, icon: TrendingUp, accent: "from-orange-500 to-amber-500" },
  ];

  return (
    <>
      <DashboardRoutePage
        title="Admin Dashboard"
        description="Platform-level control panel for users, subscriptions, payments, and sessions."
        badge="Admin Control"
        accent="from-blue-500 to-cyan-500"
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-[1.5rem] border border-zinc-800 bg-black p-6 shadow-sm">
              <div className={`mb-4 inline-flex rounded-2xl bg-linear-to-br ${card.accent} p-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-zinc-400">{card.title}</p>
              {loading ? (
                <Loader2 className="mt-2 h-6 w-6 animate-spin text-zinc-500" />
              ) : (
                <p className="mt-2 text-3xl font-black text-white">{card.value}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-black p-8">
        <h2 className="mb-6 text-xl font-bold text-white">Admin Shortcuts</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/dashboard/admin/users", title: "Users", text: "Browse all platform users" },
            { href: "/dashboard/admin/sessions", title: "Sessions", text: "Inspect active sessions" },
            { href: "/dashboard/admin/payments", title: "Payments", text: "Review all payment records" },
            { href: "/dashboard/admin/subscriptions", title: "Subscriptions", text: "Manage subscription plans" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-blue-500/60 hover:bg-blue-500/10"
            >
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{item.text}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
