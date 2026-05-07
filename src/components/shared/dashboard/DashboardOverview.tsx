"use client";

import React from "react";
import { Chip } from "@heroui/react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Package,
  RefreshCcw,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import { dashboardService, type DashboardStatsResponse } from "@/services/Dashboard.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type MetricCard = {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

const currency = (value?: number | null) =>
  `৳${Number(value ?? 0).toLocaleString("en-US")}`;

const compact = (value?: number | null) =>
  Number(value ?? 0).toLocaleString("en-US");

const formatMonth = (label: string) => {
  const [year, month] = label.split("-").map(Number);
  if (!year || !month) return label;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
};

const formatRelativeDate = (value?: string) => {
  if (!value) return "Unknown";
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const revenueChartConfig = {
  value: { label: "Revenue", color: "#a855f7" },
  count: { label: "Invoices", color: "#22c55e" },
};

const statusChartConfig = {
  count: { label: "Count", color: "#a855f7" },
};

function MetricTile({ title, value, description, icon: Icon, tone }: MetricCard) {
  return (
    <Card className="group overflow-hidden border-zinc-800 bg-zinc-950/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="relative flex items-start gap-4 p-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-105",
            tone
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight text-white">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {description}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-800 bg-black p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400">
        <BarChart3 className="h-5 w-5" />
      </div>
      <p className="text-base font-bold text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-black p-6 shadow-xl md:p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-900" />
              <div className="h-7 w-28 animate-pulse rounded-full bg-zinc-900" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-900" />
            </div>

            <div className="space-y-3">
              <div className="h-14 w-full max-w-3xl animate-pulse rounded-3xl bg-zinc-900" />
              <div className="h-5 w-full max-w-2xl animate-pulse rounded-full bg-zinc-900" />
              <div className="h-5 w-4/5 animate-pulse rounded-full bg-zinc-900" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="h-3 w-20 animate-pulse rounded-full bg-zinc-800" />
                <div className="mt-4 h-5 w-28 animate-pulse rounded-full bg-zinc-800" />
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="h-3 w-20 animate-pulse rounded-full bg-zinc-800" />
                <div className="mt-4 h-5 w-32 animate-pulse rounded-full bg-zinc-800" />
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="h-3 w-20 animate-pulse rounded-full bg-zinc-800" />
                <div className="mt-4 h-5 w-24 animate-pulse rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl rounded-[2rem] border border-zinc-800 bg-zinc-950 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-28 animate-pulse rounded-full bg-zinc-800" />
                <div className="h-5 w-40 animate-pulse rounded-full bg-zinc-800" />
              </div>
              <div className="h-8 w-20 animate-pulse rounded-2xl bg-zinc-800" />
            </div>
            <div className="h-72 animate-pulse rounded-[1.75rem] bg-zinc-900" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-black p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-zinc-800" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="h-3 w-20 animate-pulse rounded-full bg-zinc-800" />
                <div className="h-7 w-28 animate-pulse rounded-full bg-zinc-800" />
                <div className="h-3 w-full animate-pulse rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-black shadow-sm">
          <div className="border-b border-zinc-800 bg-zinc-950/60 p-6">
            <div className="h-6 w-40 animate-pulse rounded-full bg-zinc-800" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-zinc-800" />
          </div>
          <div className="p-4 md:p-6">
            <div className="h-96 animate-pulse rounded-[1.75rem] bg-zinc-900" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-black shadow-sm">
          <div className="border-b border-zinc-800 bg-zinc-950/60 p-6">
            <div className="h-6 w-44 animate-pulse rounded-full bg-zinc-800" />
            <div className="mt-3 h-4 w-64 animate-pulse rounded-full bg-zinc-800" />
          </div>
          <div className="p-4 md:p-6">
            <div className="h-96 animate-pulse rounded-[1.75rem] bg-zinc-900" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DashboardOverview() {
  const [stats, setStats] = React.useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dashboardService.getDashboardStats();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || "Failed to load dashboard");
      }
    } catch {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    void loadStats();
  }, []);

  const overview = stats?.overview;
  const charts = stats?.charts;
  const recent = stats?.recent;
  const isAdmin = stats?.viewMode === "admin";
  const isShop = stats?.viewMode === "shop" || stats?.viewMode === "staff";

  const metrics: MetricCard[] = stats
    ? isAdmin
      ? [
          {
            title: "Total Users",
            value: compact(overview?.users?.total),
            description: `${compact(overview?.users?.active)} active · ${compact(overview?.users?.suspended)} suspended`,
            icon: Users,
            tone: "bg-gradient-to-br from-purple-600 to-fuchsia-600",
          },
          {
            title: "Shops",
            value: compact(overview?.shops?.total),
            description: `${compact(overview?.shops?.active)} active · ${compact(overview?.shops?.pending)} pending`,
            icon: Building2,
            tone: "bg-gradient-to-br from-cyan-600 to-sky-600",
          },
          {
            title: "Revenue",
            value: currency(overview?.commerce?.revenue),
            description: `${compact(overview?.commerce?.invoices)} invoices · ${compact(overview?.commerce?.lowStockProducts)} low stock items`,
            icon: Wallet,
            tone: "bg-gradient-to-br from-emerald-600 to-teal-600",
          },
          {
            title: "Profit",
            value: currency(overview?.commerce?.profit),
            description: `${compact(overview?.commerce?.products)} products · ${compact(overview?.commerce?.categories)} categories`,
            icon: TrendingUp,
            tone: "bg-gradient-to-br from-zinc-800 to-zinc-950",
          },
          {
            title: "Subscriptions",
            value: compact(overview?.subscriptions?.total),
            description: `${compact(overview?.subscriptions?.active)} active · ${compact(overview?.subscriptions?.trial)} trial`,
            icon: ShieldCheck,
            tone: "bg-gradient-to-br from-violet-600 to-indigo-600",
          },
          {
            title: "Staff",
            value: compact(overview?.staff),
            description: "Team members and operational capacity",
            icon: Package,
            tone: "bg-gradient-to-br from-orange-500 to-amber-500",
          },
        ]
      : [
          {
            title: "Products",
            value: compact(overview?.products),
            description: `${compact(overview?.activeProducts)} active · ${compact(overview?.lowStockProducts)} low stock`,
            icon: ShoppingCart,
            tone: "bg-gradient-to-br from-purple-600 to-fuchsia-600",
          },
          {
            title: "Invoices",
            value: compact(overview?.invoices),
            description: `${compact(overview?.currentMonthRevenue)} this month`,
            icon: ReceiptText,
            tone: "bg-gradient-to-br from-cyan-600 to-sky-600",
          },
          {
            title: "Revenue",
            value: currency(overview?.revenue),
            description: `${currency(stats?.recentPerformance?.monthToDateRevenue)} month to date`,
            icon: Wallet,
            tone: "bg-gradient-to-br from-emerald-600 to-teal-600",
          },
          {
            title: "Profit",
            value: currency(overview?.profit),
            description: `${currency(stats?.recentPerformance?.monthToDateProfit)} this month`,
            icon: TrendingUp,
            tone: "bg-gradient-to-br from-zinc-800 to-zinc-950",
          },
          {
            title: "Categories",
            value: compact(overview?.categories),
            description: `${compact(overview?.stockMovements)} stock movements tracked`,
            icon: BarChart3,
            tone: "bg-gradient-to-br from-violet-600 to-indigo-600",
          },
          {
            title: "Team",
            value: compact(overview?.staff),
            description: "Active shop staff and permissions",
            icon: Users,
            tone: "bg-gradient-to-br from-orange-500 to-amber-500",
          },
        ]
    : [];

  const revenueData =
    charts?.revenueByMonth?.map((item) => ({
      ...item,
      month: formatMonth(item.label),
    })) ?? [];

  const distributionData = isAdmin
    ? charts?.shopStatus ?? []
    : charts?.invoiceStatus ?? charts?.stockMovements ?? [];

  const topShops = charts?.topShops ?? [];
  const topProducts = charts?.topProducts ?? [];

  const quickStats = isAdmin
    ? [
        { label: "Users active", value: compact(overview?.users?.active) },
        { label: "Shops pending", value: compact(overview?.shops?.pending) },
        { label: "Subscriptions past due", value: compact(overview?.subscriptions?.pastDue) },
        { label: "Low stock alerts", value: compact(overview?.commerce?.lowStockProducts) },
      ]
    : [
        { label: "Current month revenue", value: currency(overview?.currentMonthRevenue) },
        { label: "Current month profit", value: currency(overview?.currentMonthProfit) },
        { label: "Low stock products", value: compact(overview?.lowStockProducts) },
        { label: "Stock movements", value: compact(overview?.stockMovements) },
      ];

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-black p-6 shadow-xl md:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full bg-purple-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-purple-600">
                  {isAdmin ? "Admin Hub" : "Shop Hub"}
                </Badge>
                <Chip color="warning" variant="soft" size="sm">
                  Error state
                </Chip>
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                  Dashboard unavailable
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Card className="border-zinc-800 bg-black shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-rose-500/10 p-4 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Dashboard unavailable</h2>
              <p className="mt-2 text-sm text-zinc-400">{error}</p>
            </div>
            <Button
              onClick={() => void loadStats()}
              className="gap-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
            >
              <RefreshCcw className="h-4 w-4" /> Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-black text-white">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-black p-6 shadow-xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_35%)]" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full bg-purple-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-purple-600">
                {isAdmin ? "Admin Hub" : "Shop Hub"}
              </Badge>

              {stats?.shop?.subscriptionStatus ? (
                <Chip
                  color={
                    stats.shop.subscriptionStatus.toLowerCase().includes("active")
                      ? "success"
                      : "warning"
                  }
                  variant="soft"
                  size="sm"
                >
                  {stats.shop.subscriptionStatus}
                </Chip>
              ) : null}

              <Chip color="success" variant="soft" size="sm">
                Live data connected
              </Chip>

              {stats?.permissions?.canViewReports === false ? (
                <Chip color="warning" variant="soft" size="sm">
                  Limited reports
                </Chip>
              ) : null}
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                {isAdmin ? "Business control center" : "Shop command center"}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                {isAdmin
                  ? "See the full business surface at a glance: users, shops, products, subscriptions, revenue, profit, and live trends all in one place."
                  : "Track daily sales, inventory pressure, staff activity, and month-to-date performance without jumping between pages."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                  View Mode
                </p>
                <p className="mt-2 text-sm font-bold text-white">
                  {isAdmin ? "Administrator" : isShop ? "Shop Operator" : "Team Member"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                  Current Shop
                </p>
                <p className="mt-2 truncate text-sm font-bold text-white">
                  {stats?.shop?.name || "No shop selected"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                  Last Sync
                </p>
                <p className="mt-2 text-sm font-bold text-white">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                  Revenue pulse
                </p>
                <p className="mt-1 text-lg font-bold text-white">Live monthly trend</p>
              </div>
              <div className="rounded-2xl bg-purple-600/20 px-3 py-2 text-xs font-semibold text-purple-200">
                {revenueData.length} points
              </div>
            </div>

            <ChartContainer config={revenueChartConfig} className="h-72 w-full">
              <AreaChart data={revenueData} margin={{ left: 8, right: 8, top: 10 }}>
                <defs>
                  <linearGradient id="heroRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={44}
                  tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#a855f7"
                  fill="url(#heroRevenueFill)"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-zinc-950/80 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                  Total Revenue
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {currency(isAdmin ? overview?.commerce?.revenue : overview?.revenue)}
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-950/80 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                  Total Profit
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {currency(isAdmin ? overview?.commerce?.profit : overview?.profit)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {stats?.shop ? (
          <div className="relative mt-6 grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur xl:grid-cols-4">
            <div className="xl:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Current Shop
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">{stats.shop.name}</h2>
              <p className="mt-2 text-sm text-zinc-300">
                Owner: {stats.shop.ownerName || "Unknown"}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/40 p-4">
              <div className="rounded-2xl bg-purple-600 p-3 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
                  Subscription
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {stats.shop.subscriptionStatus}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/40 p-4">
              <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
                  Status
                </p>
                <p className="mt-1 text-sm font-bold text-white">{stats.shop.status}</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricTile key={metric.title} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden border-zinc-800 bg-black shadow-sm">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/60 pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-xl text-white">Revenue trend</CardTitle>
                <CardDescription className="text-zinc-400">
                  Monthly revenue and invoice volume across the last 12 months.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="w-fit rounded-full border-zinc-800 text-zinc-400"
              >
                Last 12 months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ChartContainer config={revenueChartConfig} className="h-80 w-full">
              <AreaChart data={revenueData} margin={{ left: 12, right: 12, top: 10 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={42} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  fill="url(#revenueFill)"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-zinc-800 bg-black shadow-sm">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/60 pb-4">
            <CardTitle className="text-xl text-white">Operational snapshot</CardTitle>
            <CardDescription className="text-zinc-400">
              Distribution of activity in the current workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ChartContainer config={statusChartConfig} className="h-80 w-full">
              <BarChart data={distributionData} margin={{ left: 12, right: 12, top: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-zinc-800 bg-black shadow-sm">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/60 pb-4">
            <CardTitle className="text-xl text-white">Top ranking</CardTitle>
            <CardDescription className="text-zinc-400">
              {isAdmin ? "Highest revenue shops" : "Best performing products"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {isAdmin ? (
              <ChartContainer
                config={{ revenue: { label: "Revenue", color: "#a855f7" } }}
                className="h-96 w-full"
              >
                <BarChart
                  data={topShops}
                  layout="vertical"
                  margin={{ left: 12, right: 24, top: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="shopName"
                    tickLine={false}
                    axisLine={false}
                    width={140}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 12, 12, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <ChartContainer
                config={{ revenue: { label: "Revenue", color: "#a855f7" } }}
                className="h-96 w-full"
              >
                <BarChart
                  data={topProducts}
                  layout="vertical"
                  margin={{ left: 12, right: 24, top: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={140}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 12, 12, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-zinc-800 bg-black shadow-sm">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/60 pb-4">
            <CardTitle className="text-xl text-white">Quick stats</CardTitle>
            <CardDescription className="text-zinc-400">
              Everything important in one glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 md:p-6">
            {quickStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <span className="text-sm text-zinc-400">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}

            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Live summary
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {isAdmin
                  ? "The admin dashboard blends financial performance, shop lifecycle, and subscription health so bottlenecks are easy to catch."
                  : "The shop dashboard keeps sales, products, and staff activity visible so daily operations stay tight and responsive."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden border-zinc-800 bg-black shadow-sm xl:col-span-2">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/60 pb-4">
            <CardTitle className="text-xl text-white">Recent activity</CardTitle>
            <CardDescription className="text-zinc-400">
              Latest records pulled from the backend dashboard service.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue={isAdmin ? "invoices" : "products"} className="w-full">
              <TabsList className="mb-5 w-full justify-start rounded-full bg-zinc-950">
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value={isAdmin ? "shops" : "products"}>
                  {isAdmin ? "Shops" : "Products"}
                </TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="invoices" className="mt-0">
                <div className="space-y-3">
                  {(recent?.invoices ?? []).slice(0, 6).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="mt-1 truncate text-xs text-zinc-400">
                          {invoice.shop?.shopName ||
                            invoice.createdByUser?.name ||
                            invoice.createdByUser?.email ||
                            "Unknown source"}{" "}
                          · {formatRelativeDate(invoice.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">
                          {currency(invoice.grandTotal)}
                        </p>
                        <p className="text-xs text-emerald-400">
                          Profit {currency(invoice.totalProfit)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(recent?.invoices ?? []).length === 0 ? (
                    <EmptyState
                      title="No invoices yet"
                      description="Once invoices are generated, they will appear here."
                    />
                  ) : null}
                </div>
              </TabsContent>

              <TabsContent value={isAdmin ? "shops" : "products"} className="mt-0">
                <div className="space-y-3">
                  {isAdmin
                    ? (recent?.shops ?? []).slice(0, 6).map((shop) => (
                        <div
                          key={shop.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {shop.shopName}
                            </p>
                            <p className="mt-1 truncate text-xs text-zinc-400">
                              Owner:{" "}
                              {shop.ownerProfile?.user?.name ||
                                shop.ownerProfile?.user?.email ||
                                "Unknown"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-right">
                            <Badge variant="outline" className="rounded-full border-zinc-700 text-zinc-300">
                              {shop.status}
                            </Badge>
                            <span className="text-xs text-zinc-400">
                              {shop.subscriptionStatus}
                            </span>
                          </div>
                        </div>
                      ))
                    : (recent?.products ?? []).slice(0, 6).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">
                              Updated {formatRelativeDate(product.updatedAt)}
                            </p>
                          </div>
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                            className="rounded-full bg-purple-600 text-white hover:bg-purple-600"
                          >
                            {product.stock} in stock
                          </Badge>
                        </div>
                      ))}

                  {((isAdmin ? recent?.shops : recent?.products) ?? []).length === 0 ? (
                    <EmptyState
                      title={isAdmin ? "No shops yet" : "No products yet"}
                      description="Once data arrives from the backend, it will show up here."
                    />
                  ) : null}
                </div>
              </TabsContent>

              <TabsContent value="team" className="mt-0">
                <div className="space-y-3">
                  {(recent?.staff ?? []).slice(0, 6).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {member.displayName ||
                            member.user?.name ||
                            member.user?.email ||
                            "Staff member"}
                        </p>
                        <p className="mt-1 truncate text-xs text-zinc-400">
                          {member.designation || member.user?.email || "No designation"}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {member.canSell ? (
                          <Badge className="rounded-full bg-purple-600 text-white hover:bg-purple-600">
                            Sell
                          </Badge>
                        ) : null}
                        {member.canViewReports ? (
                          <Badge variant="outline" className="rounded-full border-zinc-700 text-zinc-300">
                            Reports
                          </Badge>
                        ) : null}
                        {member.canManageInventory ? (
                          <Badge variant="secondary" className="rounded-full bg-zinc-800 text-zinc-200">
                            Inventory
                          </Badge>
                        ) : null}
                        {!member.isActive ? (
                          <Badge variant="destructive" className="rounded-full">
                            Inactive
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {(recent?.staff ?? []).length === 0 ? (
                    <EmptyState
                      title="No staff loaded"
                      description="Staff members will appear here when the backend has them."
                    />
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden border-zinc-800 bg-black shadow-sm">
            <CardHeader className="border-b border-zinc-800 bg-zinc-950/60 pb-4">
              <CardTitle className="text-xl text-white">Low stock</CardTitle>
              <CardDescription className="text-zinc-400">
                Products that need attention soon.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 md:p-6">
              {(stats?.lowStockProducts ?? []).slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-bold text-white">{product.name}</p>
                    <Badge variant="destructive" className="rounded-full">
                      {product.stock}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Reorder level: {product.reorderLevel}
                  </p>
                </div>
              ))}

              {(stats?.lowStockProducts ?? []).length === 0 ? (
                <EmptyState
                  title="Stock looks healthy"
                  description="No low-stock warnings are currently active."
                />
              ) : null}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-zinc-800 bg-black shadow-sm">
            <CardHeader className="border-b border-zinc-800 bg-zinc-950/60 pb-4">
              <CardTitle className="text-xl text-white">Focus area</CardTitle>
              <CardDescription className="text-zinc-400">
                Current operational pulse from the backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 md:p-6">
              <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-4 text-white shadow-lg">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                  Priority
                </p>
                <p className="mt-2 text-lg font-black">
                  {isAdmin ? "Grow high-performing shops" : "Protect inventory and close sales"}
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {isAdmin
                    ? "Use the shop and subscription charts to see where support or intervention is needed."
                    : "Use the sales and stock charts to keep the shop running without gaps."}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Last sync
                </p>
                <p className="mt-2 text-sm font-bold text-white">
                  {new Date().toLocaleString()}
                </p>
              </div>

              <Button
                onClick={() => void loadStats()}
                className="w-full rounded-2xl bg-purple-600 text-white hover:bg-purple-700"
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Refresh dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}