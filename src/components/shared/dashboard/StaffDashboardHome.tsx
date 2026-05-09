"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { dashboardService, type DashboardStatsResponse } from "@/services/Dashboard.service";
import { AlertCircle, ClipboardList, Package, ReceiptText, Users } from "lucide-react";

const formatCount = (value?: number) => Number(value ?? 0).toLocaleString("en-US");

export default function StaffDashboardHome() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      const response = await dashboardService.getDashboardStats();
      if (!mounted) return;

      if (response.success && response.data) {
        setStats(response.data);
        setError(null);
      } else {
        setError(response.error || "Failed to load staff dashboard");
      }

      setLoading(false);
    };

    void loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  const totalOrders = stats?.overview?.invoices ?? stats?.overview?.commerce?.invoices ?? 0;
  const lowStock = stats?.overview?.lowStockProducts ?? stats?.overview?.commerce?.lowStockProducts ?? 0;
  const products = stats?.overview?.products ?? stats?.overview?.commerce?.products ?? 0;
  const staffCount = stats?.overview?.staff ?? stats?.recent?.staff?.length ?? 0;

  return (
    <>
      <DashboardRoutePage
        title="Staff Dashboard"
        description="Quick access to your assigned work, stock status, and daily operations."
        badge="Operations"
        accent="from-rose-500 to-orange-500"
      />

      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-[2rem] border border-zinc-800 bg-zinc-900" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-[2rem] border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Staff dashboard unavailable</p>
              <p className="mt-1 text-sm text-rose-100/80">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Orders", value: totalOrders, icon: ClipboardList, accent: "from-violet-500 to-fuchsia-500" },
              { label: "Products", value: products, icon: Package, accent: "from-sky-500 to-cyan-500" },
              { label: "Low Stock", value: lowStock, icon: AlertCircle, accent: "from-amber-500 to-orange-500" },
              { label: "Team", value: staffCount, icon: Users, accent: "from-emerald-500 to-teal-500" },
            ].map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.label} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                  <div className={`inline-flex rounded-2xl bg-linear-to-br ${card.accent} p-3 text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-zinc-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">{formatCount(card.value)}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Today’s Priorities</h2>
                  <p className="mt-1 text-sm text-zinc-400">Fast links to the most common staff tasks.</p>
                </div>
                <ReceiptText className="h-5 w-5 text-rose-400" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { href: "/dashboard/orders", title: "Orders", text: "Review pending and recent orders", accent: "hover:border-violet-500/60 hover:bg-violet-500/10" },
                  { href: "/dashboard/products", title: "Products", text: "Check catalog and product status", accent: "hover:border-sky-500/60 hover:bg-sky-500/10" },
                  { href: "/dashboard/inventory", title: "Inventory", text: "Track stock and low inventory alerts", accent: "hover:border-amber-500/60 hover:bg-amber-500/10" },
                  { href: "/dashboard/receipts", title: "Receipts", text: "Look up invoice and receipt history", accent: "hover:border-emerald-500/60 hover:bg-emerald-500/10" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className={`rounded-2xl border border-zinc-800 bg-black p-5 transition-all ${item.accent}`}>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.text}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-xl font-bold text-white">Quick Notes</h2>
              <div className="mt-5 space-y-4 text-sm text-zinc-300">
                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  Daily stock checks should happen before opening.
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  Escalate any failed payment or cancelled order immediately.
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  Use reports only if your role has access enabled.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}