"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star, Sparkles } from "lucide-react";

export default function TestimonialsStatic() {
  const reviews = [
    {
      name: "Aisha Rahman",
      role: "Fashion Store Owner",
      quote:
        "Transformed our billing workflow in just a few days. Everything feels smoother and faster now.",
    },
    {
      name: "Zahid Mahmud",
      role: "Electronics Retailer",
      quote:
        "Inventory sync finally works perfectly across all branches. Huge time saver for our team.",
    },
    {
      name: "Rana Biswas",
      role: "Local Shop Manager",
      quote:
        "The support team responds insanely fast. It genuinely feels premium from every angle.",
    },
    {
      name: "Nadia Sultana",
      role: "Beauty Brand Founder",
      quote:
        "Revenue analytics and insights helped us scale smarter. The dashboard is honestly beautiful.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" as const } },
  };

  return (
    <section className="relative mx-auto mt-24 max-w-7xl overflow-hidden px-4 sm:px-6">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.82, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]"
      />

      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ y: [0, -4, 0] }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-300"
        >
          <Sparkles className="h-4 w-4" />
          Testimonials
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="mt-5 text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl"
        >
          Loved by modern shop owners
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg"
        >
          Thousands of businesses trust our platform to manage sales,
          inventory, customers, and growth — all in one place.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {reviews.map((r) => (
          <motion.div
            key={r.name}
            variants={card}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group relative overflow-hidden rounded-[2.2rem] border border-zinc-200/70 bg-white/80 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_22px_60px_rgba(168,85,247,0.14)] dark:border-white/10 dark:bg-zinc-900/70"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute -top-16 right-0 h-32 w-32 rounded-full bg-purple-500/15 blur-3xl" />
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
                <Quote className="h-6 w-6" />
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>

            <p className="relative mt-7 text-[15px] leading-8 text-zinc-700 dark:text-zinc-300">
              “{r.quote}”
            </p>

            <div className="relative mt-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-fuchsia-500 text-sm font-black text-white">
                {r.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                  {r.name}
                </h4>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {r.role}
                </p>
              </div>
            </div>

            <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}