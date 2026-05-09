'use client';

import React from 'react';
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { TrendingUp, Calendar, Download, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export default function DashboardReportsPage() {
  const [dateRange, setDateRange] = React.useState('month');

  const reportMetrics = [
    {
      title: 'Total Revenue',
      value: '$24,580.00',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Total Orders',
      value: '384',
      change: '+8.2%',
      trend: 'up',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Avg Order Value',
      value: '$64.01',
      change: '+3.4%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-0.8%',
      trend: 'down',
      icon: PieChartIcon,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <>
      <DashboardRoutePage
        title="Reports"
        description="Review business summaries, charts, and exportable performance insights."
        badge="Analytics"
        accent="from-slate-700 to-zinc-900"
      />

      <div className="mt-8 space-y-6">
        {/* Report Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-zinc-400" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-sm text-white focus:border-slate-500 focus:outline-none">
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-700 to-zinc-700 px-6 py-2 font-semibold text-white transition-all hover:shadow-lg">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reportMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`rounded-lg bg-gradient-to-r ${metric.color} p-3`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className={`text-xs font-semibold ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{metric.title}</p>
                <p className="mt-2 text-2xl font-bold text-white">{metric.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sales Chart */}
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="font-semibold text-white mb-4">Sales Trend</h3>
            <div className="h-64 flex items-center justify-center bg-black/50 rounded-lg border border-zinc-800">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">Chart visualization coming soon</p>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="font-semibold text-white mb-4">Sales by Category</h3>
            <div className="h-64 flex items-center justify-center bg-black/50 rounded-lg border border-zinc-800">
              <div className="text-center">
                <PieChartIcon className="h-12 w-12 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">Chart visualization coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="font-semibold text-white mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {[
              { name: 'Premium Wireless Headphones', sales: 245, revenue: '$12,450' },
              { name: 'USB-C Fast Charger', sales: 189, revenue: '$5,670' },
              { name: 'Portable SSD 1TB', sales: 156, revenue: '$4,680' },
              { name: 'Phone Screen Protector', sales: 423, revenue: '$1,692' },
              { name: 'Phone Stand Adjustable', sales: 378, revenue: '$1,512' }
            ].map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 hover:bg-black/50 transition">
                <div>
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-xs text-zinc-400">{product.sales} sales</p>
                </div>
                <p className="font-semibold text-emerald-400">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
