"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Star } from "lucide-react";

export default function FinalCtaStatic() {
  const container = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
        duration: 0.7,
          ease: "easeOut" as const,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="mx-auto mt-24 pb-28 max-w-7xl px-4 sm:px-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="group relative overflow-hidden rounded-[3rem] border border-white/10 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8 shadow-[0_25px_90px_rgba(0,0,0,0.38)] sm:p-12 lg:p-16"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-purple-500/25 blur-[130px] transition-all duration-700 group-hover:bg-purple-500/35"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.78, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="pointer-events-none absolute -right-24 -bottom-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[130px] transition-all duration-700 group-hover:bg-fuchsia-500/30"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />

        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="grid gap-12 px-7 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-14 lg:py-16">
            <div className="text-center lg:text-left">
              <motion.div
                variants={item}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/80 uppercase"
              >
                <Sparkles className="h-4 w-4 text-purple-300" />
                Premium Growth Boost
              </motion.div>

              <motion.h3
                variants={item}
                className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Ready to transform your shop into something premium?
              </motion.h3>

              <motion.p
                variants={item}
                className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg lg:mx-0"
              >
                Launch faster, look sharper, and convert more visitors with a
                polished storefront experience built to impress.
              </motion.p>

              <motion.div
                variants={item}
                className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 py-2.5 text-sm font-medium text-zinc-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  No credit card required
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 py-2.5 text-sm font-medium text-zinc-200">
                  <Star className="h-4 w-4 text-amber-400" />
                  Cancel anytime
                </div>
              </motion.div>

              <motion.div
                variants={item}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
              >
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="/register"
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-500 via-fuchsia-500 to-pink-500 px-9 text-sm font-bold text-white shadow-[0_14px_36px_rgba(168,85,247,0.35)] transition-all duration-200 hover:shadow-[0_18px_44px_rgba(168,85,247,0.48)] sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="/pricing"
                  className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/15 bg-white/8 px-9 text-sm font-semibold text-white/90 transition-all duration-200 hover:border-white/25 hover:bg-white/12 sm:w-auto"
                >
                  View Pricing
                </motion.a>
              </motion.div>
            </div>

            <motion.div
              variants={item}
              className="relative"
            >
              <div className="rounded-[2rem] border border-white/10 bg-zinc-950/65 p-7 shadow-2xl backdrop-blur-md sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-300">
                    Trusted by growing brands
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Live
                  </span>
                </div>

                <div className="mt-7 space-y-4">
                  {[
                    ["Conversion uplift", "+32%"],
                    ["Setup time", "Under 10 min"],
                    ["User satisfaction", "4.9/5"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/8 bg-white/5 p-5"
                    >
                      <p className="text-sm text-zinc-400">{label}</p>
                      <p className="mt-2 text-3xl font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-7 text-zinc-400">
                  A premium CTA that feels clean, modern, and built for
                  conversions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}