"use client";

import React from "react";
import { motion } from "framer-motion";

const icons = {
  invoice: (
    <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  shop: (
    <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  reorder: (
    <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  reports: (
    <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const Item: React.FC<{
  title: string;
  desc: string;
  icon: React.ReactNode;
}> = ({ title, desc, icon }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.01 }}
    transition={{ duration: 0.25 }}
    className="group relative overflow-hidden rounded-[2.2rem] border border-zinc-200/80 bg-white/80 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_20px_60px_rgba(168,85,247,0.12)] dark:border-white/10 dark:bg-zinc-950/70"
  >
    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/10 bg-linear-to-br from-purple-500/10 to-fuchsia-500/10 shadow-sm">
      {icon}
    </div>

    <h3 className="relative mt-6 text-xl font-black tracking-tight text-zinc-900 dark:text-white">
      {title}
    </h3>

    <p className="relative mt-3 text-sm leading-8 font-medium text-zinc-600 dark:text-zinc-400">
      {desc}
    </p>

    <div className="relative mt-7 h-px w-full bg-linear-to-r from-transparent via-purple-500/25 to-transparent" />
  </motion.div>
);

export default function ExtendedFeatures() {
  const features = [
    {
      title: "Automated Invoicing",
      desc: "Create tax-compliant invoices automatically with customizable templates and a polished workflow.",
      icon: icons.invoice,
    },
    {
      title: "Multi-Shop Support",
      desc: "Manage multiple shops under one account with smooth role-based access and centralized control.",
      icon: icons.shop,
    },
    {
      title: "Smart Reorder",
      desc: "Receive smart reorder suggestions based on historical trends, sales patterns, and demand changes.",
      icon: icons.reorder,
    },
    {
      title: "Reports & Exports",
      desc: "Download accounting-ready reports and CSV exports designed for clarity, speed, and accuracy.",
      icon: icons.reports,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
  };

  return (
    <section className="relative mx-auto mt-24 max-w-7xl px-4 sm:px-6">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.82, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.72, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
        className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-[100px]"
      />

      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ y: [0, -4, 0] }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
          className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-purple-700 dark:text-purple-300"
        >
          Premium Highlights
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="mt-5 text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl"
        >
          Features built for smooth daily workflow
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg"
        >
          Powerful tools for invoicing, inventory, reporting, and multi-shop
          management — all wrapped in a clean premium experience.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {features.map((f) => (
          <motion.div key={f.title} variants={item}>
            <Item title={f.title} desc={f.desc} icon={f.icon} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}