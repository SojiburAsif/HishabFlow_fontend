'use client';

import React from 'react';
import { Card } from '@heroui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

interface RevenueData {
  date: string;
  day: string;
  revenue: number;
}

interface RevenueChartProps {
  data?: RevenueData[];
  delay?: number;
}

// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: RevenueData }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-700 dark:border-zinc-800 rounded-lg p-3 backdrop-blur-xl">
        <p className="text-sm font-medium text-zinc-50">
          ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-xs text-zinc-400">
          {payload[0].payload.date}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart: React.FC<RevenueChartProps> = ({
  data = [],
  delay = 0.2,
}) => {
  const hasData = data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex flex-col gap-2 px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Revenue Trend
            </h3>
            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              +12.5% this week
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Last 7 days revenue overview
          </p>
        </div>

        <div className="p-6">
          {hasData ? (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#7c3aed"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#7c3aed"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-zinc-200 dark:stroke-zinc-800"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    className="text-xs text-zinc-500 dark:text-zinc-400"
                    tick={{ fill: 'currentColor' }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    className="text-xs text-zinc-500 dark:text-zinc-400"
                    tick={{ fill: 'currentColor' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-black/30 dark:text-zinc-400">
              No revenue data available yet.
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default RevenueChart;
