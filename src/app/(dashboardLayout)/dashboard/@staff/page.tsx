import Link from "next/link";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { ArrowRight, ClipboardList, Package, ReceiptText, Users } from "lucide-react";

export default function StaffPage() {
  return (
    <>
      <DashboardRoutePage
        title="Staff Dashboard"
        description="Quick access to your assigned work, stock status, and daily operations."
        badge="Operations"
        accent="from-rose-500 to-orange-500"
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Orders", value: "24", icon: ClipboardList, accent: "from-violet-500 to-fuchsia-500" },
          { label: "Products", value: "148", icon: Package, accent: "from-sky-500 to-cyan-500" },
          { label: "Low Stock", value: "7", icon: ReceiptText, accent: "from-amber-500 to-orange-500" },
          { label: "Team", value: "8", icon: Users, accent: "from-emerald-500 to-teal-500" },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <div className={`inline-flex rounded-2xl bg-linear-to-br ${card.accent} p-3 text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-400">{card.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Today’s Priorities</h2>
              <p className="mt-1 text-sm text-zinc-400">Fast links to the most common staff tasks.</p>
            </div>
            <ReceiptText className="h-5 w-5 text-rose-400" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { href: "/dashboard/orders", title: "Orders", text: "Review pending and recent orders" },
              { href: "/dashboard/products", title: "Products", text: "Check catalog and product status" },
              { href: "/dashboard/inventory", title: "Inventory", text: "Track low inventory alerts" },
              { href: "/dashboard/receipts", title: "Receipts", text: "Look up invoice and receipt history" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-zinc-800 bg-black p-5 transition-all hover:border-rose-500/60 hover:bg-rose-500/10">
                <p className="text-base font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-bold text-white">Quick Notes</h2>
          <div className="mt-5 space-y-4 text-sm text-zinc-300">
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              Daily stock checks should happen before opening.
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              Escalate any failed payment or cancelled order immediately.
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              Use reports only if your role has access enabled.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Link href="/dashboard/overview" className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-black px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-rose-500/60 hover:text-white">
          Back to overview <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
