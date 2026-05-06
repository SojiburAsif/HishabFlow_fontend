"use client";

import React from "react";
import {
  ArrowRight,
  Crown,
  Search,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

function CtaButton({ text }: { text: string }) {
  return (
    <button className="inline-flex items-center gap-3 rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-zinc-900">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white">
        <ArrowRight size={16} />
      </span>
      {text}
    </button>
  );
}

export default function QuickHighlights() {
  return (
    <section className="mx-auto w-full max-w-475 px-2 py-4 md:px-4 md:py-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-purple-500 px-5 pb-56 pt-16 md:px-10 md:pt-24">
        <div className="pointer-events-none absolute -right-32 -top-60 h-135 w-210 rounded-full bg-purple-300/35" />
        <div className="pointer-events-none absolute -bottom-56 -left-40 h-105 w-235 rounded-full bg-purple-300/25" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black leading-tight text-zinc-950 md:text-5xl">
            Take your billing workflow to the
            <br />
            next level with precision and style
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm font-medium text-zinc-900/80 md:text-base">
            Gain unlimited access to dashboards, reports, and advanced business tools through one simple subscription.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CtaButton text="Install Billing Plugin" />
            <CtaButton text="Add-on Analytics Suite" />
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 w-[95%] max-w-4xl -translate-x-1/2 translate-y-24 md:translate-y-32">
          <div className="rounded-[2rem] border border-white/40 bg-zinc-100 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.2)] md:p-4">
            <div className="rounded-[1.7rem] border border-zinc-300 bg-zinc-100">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-300 px-4 py-4 md:px-5">
                <span className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-3 py-2 text-sm font-black text-zinc-950">
                  <Crown size={14} /> Upgrade Pro
                </span>

                <div className="flex items-center gap-2">
                  <button className="rounded-xl border border-zinc-300 bg-zinc-200 px-5 py-2 text-sm font-bold text-zinc-700">
                    Sign In
                  </button>
                  <button className="rounded-xl bg-zinc-950 px-5 py-2 text-sm font-bold text-white">
                    Start Free Trial
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-4 md:p-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                  <div className="relative md:col-span-6">
                    <input
                      type="text"
                      placeholder="Search reports, products, or invoices..."
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-purple-500 p-2 text-zinc-950">
                      <Search size={16} />
                    </button>
                  </div>

                  <button className="flex items-center justify-between rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-600 md:col-span-3">
                    All Mockups
                    <ChevronDown size={16} />
                  </button>

                  <button className="flex items-center justify-between rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-600 md:col-span-3">
                    Filter By Price
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="rounded-2xl border border-zinc-300 bg-zinc-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-lg font-black text-zinc-800">Popular Categories</h4>
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-600">
                      Live
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {["Device Mockups", "Apparel Mockups", "Branding Mockups"].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        className="flex items-center justify-between rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-purple-400"
                      >
                        {item}
                        <CheckCircle2 size={16} className="text-purple-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-16 left-6 z-0 hidden w-40 rounded-[1.5rem] border border-white/30 bg-zinc-100/90 p-3 shadow-xl md:block">
            <div className="mb-2 h-8 w-8 rounded-full bg-purple-500/80" />
            <div className="h-3 w-full rounded bg-zinc-300" />
            <div className="mt-2 h-3 w-3/4 rounded bg-zinc-300" />
            <div className="mt-4 h-10 rounded-xl bg-purple-500/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
