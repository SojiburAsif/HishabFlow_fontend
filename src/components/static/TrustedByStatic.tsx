"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function TrustedByStatic() {
  const companies = [
    "Acme Corp",
    "Apex Labs",
    "Nova Retail",
    "Vertex Co",
    "Echo Shop",
    "Zenith Market",
    "Pixel Commerce",
    "Urban Cart",
  ];

  return (
    <section className="relative mx-auto mt-28 max-w-7xl overflow-hidden px-4 sm:px-6">
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-16 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-linear-to-br from-white/80 via-white/70 to-white/60 p-8 shadow-[0_25px_90px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:from-zinc-950/90 dark:via-zinc-900/80 dark:to-zinc-950/90 sm:p-12 lg:p-14"
      >
        {/* glossy overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_38%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_38%)]" />

        {/* top content */}
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/15 bg-purple-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.25em] text-purple-700 dark:text-purple-300"
          >
            <Sparkles className="h-4 w-4" />
            Trusted Worldwide
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Fast-growing brands trust this platform every day
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg"
          >
            Built for modern businesses that want speed, reliability,
            automation, and a premium experience from the very first click.
          </motion.p>
        </div>

        {/* animated logo marquee */}
        <div className="relative mt-14 overflow-hidden">
          {/* fade sides */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max gap-5"
          >
            {[...companies, ...companies].map((company, index) => (
              <motion.div
                key={`${company}-${index}`}
                whileHover={{
                  y: -6,
                  scale: 1.04,
                }}
                transition={{ duration: 0.25 }}
                className="group flex h-20 min-w-55 items-center justify-center rounded-[1.7rem] border border-zinc-200/70 bg-white/80 px-8 shadow-[0_10px_35px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-purple-500/25 hover:shadow-[0_18px_50px_rgba(168,85,247,0.14)] dark:border-white/10 dark:bg-white/5"
              >
                <span className="bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-lg font-black tracking-tight text-transparent transition-all duration-300 group-hover:from-purple-600 group-hover:via-fuchsia-500 group-hover:to-pink-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500">
                  {company}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* bottom stats */}
        <div className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            ["10K+", "Active Businesses"],
            ["99.9%", "Platform Uptime"],
            ["4.9/5", "Customer Satisfaction"],
          ].map(([value, label]) => (
            <motion.div
              key={label}
              whileHover={{ y: -4 }}
              className="rounded-[2rem] border border-zinc-200/70 bg-white/70 p-6 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
                {value}
              </h3>
              <p className="mt-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}