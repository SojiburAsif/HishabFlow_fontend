import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type DashboardRoutePageProps = {
  title: string;
  description: string;
  badge?: string;
  accent?: string;
};

export default function DashboardRoutePage({
  title,
  description,
  badge = "Dashboard",
  accent = "from-emerald-500 to-teal-500",
}: DashboardRoutePageProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-zinc-500">{badge}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
        <div className={`hidden h-16 w-16 rounded-2xl bg-linear-to-br ${accent} md:block`} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-black">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Status</p>
          <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">Ready</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-black">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Route</p>
          <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">{title}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-black">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Action</p>
          <Link href="/dashboard/overview" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500">
            Back to overview <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
