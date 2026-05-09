'use client';

import React from 'react';
import DashboardRoutePage from '@/components/shared/dashboard/DashboardRoutePage';
import { FileText, Download } from 'lucide-react';

export default function ReceiptsPage() {
  return (
    <>
      <DashboardRoutePage
        title="Receipts & Invoices"
        description="Download and manage all invoices and receipts from your orders"
        badge="Transactions"
        accent="from-green-500 to-emerald-500"
      />

      <div className="mt-8 space-y-6">
        {/* Filter and Search Bar */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by invoice number or date..."
                className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <button className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-700">
              Filter
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-zinc-900 p-4">
              <FileText className="h-12 w-12 text-zinc-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">No Receipts Yet</h3>
            <p className="mb-6 max-w-md text-zinc-400">Your invoices and receipts will appear here once you create orders. Start creating orders to generate receipts.</p>
            <a href="/dashboard/orders" className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-700">
              Create Your First Order
            </a>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-white">Invoice Templates</h4>
            </div>
            <p className="text-xs text-zinc-400">Create invoices with your custom branding and details</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Download className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-white">Download Receipts</h4>
            </div>
            <p className="text-xs text-zinc-400">Download receipts as PDF for your records and customer delivery</p>
          </div>
        </div>
      </div>
    </>
  );
}
