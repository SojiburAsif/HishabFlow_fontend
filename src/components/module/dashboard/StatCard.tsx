'use client';

import React from 'react';
import { Card } from '@heroui/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel = 'vs last month',
  delay = 0,
}) => {
  const isPositiveTrend = trend && trend > 0;
  const trendColor = isPositiveTrend
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-red-600 dark:text-red-400';
  const trendBgColor = isPositiveTrend
    ? 'bg-emerald-100 dark:bg-emerald-900/30'
    : 'bg-red-100 dark:bg-red-900/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-purple-400/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-900/20">
        <div className="gap-4 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {title}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {value}
              </h3>
            </div>

            {/* Icon */}
            <div className="p-3 bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg text-purple-600 dark:text-purple-400">
              {icon}
            </div>
          </div>

          {/* Trend */}
          {trend !== undefined && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${trendBgColor}`}
              >
                {isPositiveTrend ? (
                  <TrendingUp className={`w-4 h-4 ${trendColor}`} />
                ) : (
                  <TrendingDown className={`w-4 h-4 ${trendColor}`} />
                )}
                <span className={`text-sm font-semibold ${trendColor}`}>
                  {isPositiveTrend ? '+' : ''}
                  {trend}%
                </span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {trendLabel}
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
