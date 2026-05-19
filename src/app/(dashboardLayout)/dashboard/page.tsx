'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Spinner } from '@heroui/react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Receipt,
  Store,
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '@/components/module/dashboard/StatCard';
import RevenueChart from '@/components/module/dashboard/RevenueChart';
import { dashboardService, type DashboardStatsResponse } from '@/services/Dashboard.service';

const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

const relativeTime = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

const formatMonthLabel = (label: string) => {
  const [year, month] = label.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardService.getDashboardStats();

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to load dashboard data');
        }

        setStats(response.data);
        setError(null);
      } catch (loadError) {
        console.error('Failed to load dashboard stats:', loadError);
        setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const isAdmin = stats?.viewMode === 'admin';

  const chartData = useMemo(
    () =>
      (stats?.charts?.revenueByMonth ?? []).map((point) => ({
        date: point.label,
        day: formatMonthLabel(point.label),
        revenue: point.value ?? 0,
      })),
    [stats]
  );

  const statCards = useMemo(() => {
    const overview = stats?.overview;

    if (isAdmin) {
      return [
        {
          title: 'Total Users',
          value: overview?.users?.total ?? 0,
          icon: <Users className="h-6 w-6" />,
        },
        {
          title: 'Active Shops',
          value: overview?.shops?.active ?? 0,
          icon: <Store className="h-6 w-6" />,
        },
        {
          title: 'Invoices',
          value: overview?.commerce?.invoices ?? 0,
          icon: <Receipt className="h-6 w-6" />,
        },
        {
          title: 'Revenue',
          value: currency(overview?.commerce?.revenue ?? 0),
          icon: <TrendingUp className="h-6 w-6" />,
        },
      ];
    }

    return [
      {
        title: 'Products',
        value: overview?.products ?? 0,
        icon: <Package className="h-6 w-6" />,
      },
      {
        title: 'Active Products',
        value: overview?.activeProducts ?? overview?.products ?? 0,
        icon: <ShoppingCart className="h-6 w-6" />,
      },
      {
        title: 'Invoices',
        value: overview?.invoices ?? 0,
        icon: <Receipt className="h-6 w-6" />,
      },
      {
        title: 'Revenue',
        value: currency(overview?.revenue ?? 0),
        icon: <DollarSign className="h-6 w-6" />,
      },
    ];
  }, [isAdmin, stats]);

  const recentInvoices = stats?.recent?.invoices ?? [];
  const recentShops = stats?.recent?.shops ?? [];
  const recentProducts = stats?.recent?.products ?? [];
  const recentStaff = stats?.recent?.staff ?? [];
  const lowStockProducts = stats?.lowStockProducts ?? [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Live data from the backend dashboard service.
        </p>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-red-300/60 bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} delay={index * 0.05} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {isLoading ? (
            <Card className="flex min-h-[22rem] items-center justify-center border border-zinc-200/50 bg-white/50 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <Spinner color="current" size="sm" />
                <span>Loading revenue chart...</span>
              </div>
            </Card>
          ) : (
            <RevenueChart data={chartData} delay={0.2} />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="lg:col-span-4"
        >
          <Card className="h-full border border-zinc-200/50 bg-white/50 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <div className="flex flex-col gap-2 border-b border-zinc-200/50 px-6 py-4 dark:border-zinc-800/50">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Activity</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Pulled directly from the backend.</p>
            </div>

            <div className="space-y-5 p-6">
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                    Invoices
                  </h4>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{recentInvoices.length}</span>
                </div>

                <div className="space-y-3">
                  {recentInvoices.slice(0, 4).map((invoice) => (
                    <div key={invoice.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-black/40">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">{invoice.invoiceNumber}</p>
                          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {invoice.shop?.shopName || invoice.createdByUser?.name || invoice.createdByUser?.email || 'Unknown source'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-zinc-950 dark:text-white">{currency(invoice.grandTotal)}</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">Profit {currency(invoice.totalProfit)}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{relativeTime(invoice.createdAt)}</p>
                    </div>
                  ))}

                  {recentInvoices.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      No invoices available yet.
                    </p>
                  ) : null}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                    {isAdmin ? 'Shops' : 'Products'}
                  </h4>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {isAdmin ? recentShops.length : recentProducts.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {isAdmin
                    ? recentShops.slice(0, 4).map((shop) => (
                        <div key={shop.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-black/40">
                          <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">{shop.shopName}</p>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Owner: {shop.ownerProfile?.user?.name || shop.ownerProfile?.user?.email || 'Unknown'}
                          </p>
                        </div>
                      ))
                    : recentProducts.slice(0, 4).map((product) => (
                        <div key={product.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-black/40">
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">{product.name}</p>
                              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Updated {product.updatedAt ? relativeTime(product.updatedAt) : 'recently'}
                              </p>
                            </div>
                            <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                              Stock {product.stock}
                            </span>
                          </div>
                        </div>
                      ))}

                  {(isAdmin ? recentShops.length : recentProducts.length) === 0 ? (
                    <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      No recent records available yet.
                    </p>
                  ) : null}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Team</h4>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{recentStaff.length}</span>
                </div>

                <div className="space-y-3">
                  {recentStaff.slice(0, 4).map((member) => (
                    <div key={member.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-black/40">
                      <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">
                        {member.displayName || member.user?.name || member.user?.email || 'Staff member'}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {member.designation || member.user?.email || 'No designation'}
                      </p>
                    </div>
                  ))}

                  {recentStaff.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      No staff data loaded yet.
                    </p>
                  ) : null}
                </div>
              </section>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border border-zinc-200/50 bg-white/50 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/50">
          <div className="flex flex-col gap-2 border-b border-zinc-200/50 px-6 py-4 dark:border-zinc-800/50">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Low Stock Products</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Items that need reordering soon.</p>
          </div>

          <div className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <Spinner color="current" size="sm" />
                <span>Loading inventory alerts...</span>
              </div>
            ) : null}

            {lowStockProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-black/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">{product.name}</p>
                  <span className="rounded-full bg-red-600/10 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
                    {product.stock}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Reorder level: {product.reorderLevel}</p>
              </div>
            ))}

            {!isLoading && lowStockProducts.length === 0 ? (
              <p className="col-span-full rounded-2xl border border-dashed border-zinc-200 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                No low-stock products right now.
              </p>
            ) : null}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;