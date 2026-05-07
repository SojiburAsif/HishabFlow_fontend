"use client";

import React, { ElementType, ReactNode } from "react";
import {
  ArrowRight,
  Crown,
  Search,
  ChevronDown,
  CheckCircle2,
  Zap,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Package,
  ShieldCheck,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

// --- Types & Interfaces ---
interface FeatureStat {
  icon: ElementType;
  label: string;
}

interface ActivityItem {
  icon: ReactNode;
  label: string;
  value: string;
  colorClass: string;
}

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// --- Sub-Components ---
const StatBox = ({ icon: Icon, label }: FeatureStat) => (
  <div className="flex items-center gap-3">
    <Icon className="text-purple-600 dark:text-purple-500" size={18} />
    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
      {label}
    </span>
  </div>
);

export default function QuickHighlights() {
  const activities: ActivityItem[] = [
    {
      icon: <Receipt size={14} />,
      label: "Invoice #1024 Generated",
      value: "+$450.00",
      colorClass: "text-emerald-500",
    },
    {
      icon: <Package size={14} />,
      label: "Stock Updated: Smart Watch",
      value: "25 Items",
      colorClass: "text-blue-500",
    },
    {
      icon: <Users size={14} />,
      label: "New Staff Added",
      value: "Manager",
      colorClass: "text-purple-500",
    },
  ];

  const coreFeatures: FeatureStat[] = [
    { icon: Receipt, label: "Instant Invoicing" },
    { icon: Package, label: "Live Inventory" },
    { icon: ShieldCheck, label: "Data Protection" },
  ];

  return (
    <section className="relative w-full bg-white dark:bg-black py-24 transition-colors duration-500 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative rounded-[3rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 md:p-16 shadow-2xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-16 items-center">
            
            {/* Left Content Side */}
            <div className="flex flex-col space-y-8">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full w-fit border border-purple-600/20"
              >
                <Zap size={14} className="text-purple-600" fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                  ShopFlow Core v2.0
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-6xl font-semibold leading-[1.1] text-zinc-900 dark:text-white tracking-tight"
              >
                Next-Gen Billing. <br />
                <span className="text-purple-600">Zero Effort Control.</span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-lg font-medium"
              >
                Experience the fastest way to manage your retail business. From
                automated stock alerts to cloud-based financial reports.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <button className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg active:scale-95">
                  Start Your Journey <ArrowRight size={18} />
                </button>
                <button className="flex items-center gap-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 py-4 rounded-full font-bold text-zinc-700 dark:text-zinc-300 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <BarChart3 size={18} /> Watch Demo
                </button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800"
              >
                {coreFeatures.map((feat, idx) => (
                  <StatBox key={idx} icon={feat.icon} label={feat.label} />
                ))}
              </motion.div>
            </div>

            {/* Right Visual Side (Mockup) */}
            <motion.div variants={itemVariants} className="relative">
              
              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10"
              >
                <div className="flex items-center justify-between mb-10 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-purple-600" />
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Live Stats</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-zinc-50 dark:bg-black p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Profit</span>
                      <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-4xl font-semibold text-zinc-900 dark:text-white">$24,842.50</div>
                    <div className="mt-4 h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "82%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-purple-600 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Recent Activity</h4>
                    {activities.map((item, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700 text-purple-600">
                            {item.icon}
                          </div>
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{item.label}</span>
                        </div>
                        <span className={`text-xs font-black ${item.colorClass}`}>{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Pro Badge */}
              <motion.div
                animate={{ y: [0, 25, 0], x: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-6 md:-right-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-6 rounded-[2rem] shadow-2xl z-20 border border-zinc-700 dark:border-zinc-200 min-w-[180px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Crown size={22} className="text-amber-400" fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-tighter">ShopFlow Pro</span>
                </div>
                <p className="text-[10px] font-medium opacity-60 leading-tight">Unlock multi-shop <br /> synchronization</p>
                <button className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold py-3 rounded-xl transition-all shadow-lg">
                  Upgrade Plan
                </button>
              </motion.div>

              {/* Background Decorative Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-12 -left-8 hidden md:flex h-20 w-20 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-0 opacity-50"
              >
                <LayoutDashboard size={32} className="text-purple-600" />
              </motion.div>

            </motion.div> {/* Closing 'Right Visual Side' */}
          </div>
        </motion.div> {/* Closing 'Main Container' */}
      </div>
    </section>
  );
}