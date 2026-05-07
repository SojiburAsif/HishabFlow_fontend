"use client";

import React from 'react';
import { 
  ArrowRight, Search, TrendingUp, Zap, FileText, 
  ShoppingBag, Users, DollarSign, Package, LucideIcon 
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

// --- TypeScript Types ---

interface FloatingIconProps {
  icon: LucideIcon;
  x: string;
  y: string;
  size: number;
  color: string; // আইকনের আলাদা কালার দেওয়ার জন্য
}

// Animation Variants with explicit Types
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15 
    },
  },
};

// --- Components ---

const FloatingBackground: React.FC = () => {
  // এখানে আইকনের কালারগুলো গভীর (Deep) করা হয়েছে
  const icons: FloatingIconProps[] = [
    { icon: FileText, x: "10%", y: "15%", size: 40, color: "text-purple-950" },
    { icon: ShoppingBag, x: "85%", y: "10%", size: 45, color: "text-slate-950" },
    { icon: Users, x: "15%", y: "75%", size: 50, color: "text-violet-950" },
    { icon: DollarSign, x: "80%", y: "80%", size: 42, color: "text-fuchsia-950" },
    { icon: Package, x: "50%", y: "40%", size: 35, color: "text-indigo-950" },
    { icon: TrendingUp, x: "5%", y: "55%", size: 48, color: "text-cyan-950" },
    { icon: Zap, x: "90%", y: "60%", size: 38, color: "text-purple-950" },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.12] dark:opacity-[0.08]">
      {icons.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className={`absolute ${item.color}`}
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ 
              opacity: 1, 
              y: [0, 20, 0], 
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              opacity: { duration: 1, delay: 0.2 * index },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.1 * index },
              rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            }}
          >
            <IconComponent size={item.size} strokeWidth={1.5} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-black dark:text-white">
      <div className="absolute inset-0 bg-zinc-100 dark:bg-black" />
      
      <FloatingBackground />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Main Heading */}
        <motion.h1
          className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-zinc-950 dark:text-white md:text-7xl"
          variants={itemVariants}
        >
          Simplify Billing and <br />
          <motion.span
            className="relative inline-block px-6 py-2 mx-2"
          >
            <span className="absolute inset-0 rounded-[1.5rem] bg-purple-700 transform -rotate-1 dark:bg-purple-900"></span>
            <span className="relative text-white italic">Track Profits</span>
          </motion.span>
          Instantly
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mx-auto mb-10 max-w-2xl text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base"
          variants={itemVariants}
        >
          No more manual math. The ultimate SaaS solution to manage your shop&apos;s <br className="hidden md:block" />
          invoices, staff reports, and net profit analytics in one secure dashboard.
        </motion.p>

        {/* Search Bar */}
        <motion.div className="max-w-2xl mx-auto mb-4" variants={itemVariants}>
          <div className="relative flex items-center rounded-full border border-zinc-300 bg-zinc-50 p-1.5 shadow-xl backdrop-blur-sm dark:border-purple-900/50 dark:bg-zinc-900/50 dark:shadow-2xl">
            <div className="pl-4 text-purple-600 dark:text-purple-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search invoices, products, or reports..."
              className="w-full bg-transparent px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-white"
            />
            <motion.button
              className="rounded-full bg-purple-600 p-3 text-white shadow-lg transition-all hover:bg-purple-500"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={20} />
            </motion.button>
          </div>
          <p className="mt-4 text-[13px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            Shortcuts: <span className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">Daily Sales</span>,
            <span className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline ml-2">Stock Alerts</span>,
            <span className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline ml-2">Staff Logs</span>
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div className="relative my-16 flex items-center justify-center" variants={itemVariants}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-purple-900/20"></div>
          </div>
          <span className="relative bg-zinc-100 px-6 text-[11px] font-bold italic uppercase tracking-[0.3em] text-purple-700 transition-colors dark:bg-black dark:text-purple-500">
            Automate Your Workflow
          </span>
        </motion.div>

        {/* Bottom Grid: Stats & Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4 w-full relative z-10">
          <motion.div className="text-center md:text-left group cursor-default" variants={itemVariants}>
            <h3 className="text-4xl font-black leading-none text-zinc-900 transition-colors group-hover:text-purple-600 dark:text-white">12K+</h3>
            <p className="mt-2 text-[12px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Active Shops</p>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <motion.button
              className="flex items-center gap-2 rounded-full bg-purple-700 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-purple-800"
              whileHover={{ scale: 1.05, translateY: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap size={16} fill="white" className="text-white" />
              Get Started
            </motion.button>
            <motion.button
              className="rounded-full bg-zinc-300 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-zinc-900 transition-all hover:bg-zinc-400 dark:bg-white dark:text-black dark:hover:bg-purple-100"
              whileHover={{ scale: 1.05, translateY: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div className="text-center md:text-right group cursor-default" variants={itemVariants}>
            <h3 className="text-4xl font-black leading-none text-zinc-900 transition-colors group-hover:text-purple-600 dark:text-white">$2M+</h3>
            <p className="mt-2 text-[12px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Processed Monthly</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Marquee Bar */}
      <div className="absolute bottom-0 z-10 w-full overflow-hidden border-t border-purple-300 bg-purple-700/5 py-4 backdrop-blur-sm dark:border-purple-900/30 dark:bg-purple-600/10">
        <div className="flex whitespace-nowrap animate-marquee-fixed gap-12">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-800 dark:text-purple-400">
            • NO CREDIT CARD REQUIRED • SECURE CLOUD STORAGE • REAL-TIME ANALYTICS • MULTI-USER ACCESS • CUSTOMER SUPPORT 24/7 • NO CREDIT CARD REQUIRED • SECURE CLOUD STORAGE • REAL-TIME ANALYTICS • MULTI-USER ACCESS • CUSTOMER SUPPORT 24/7
          </span>
        </div>
      </div>

      {/* Marquee Animation CSS */}
      <style jsx>{`
        @keyframes marqueeFixed {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fixed {
          display: flex;
          width: 200%;
          animation: marqueeFixed 35s linear infinite;
        }
      `}</style>
    </section>
  );
}