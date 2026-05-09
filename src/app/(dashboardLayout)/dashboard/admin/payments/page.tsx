"use client";

import React, { useEffect, useState } from "react";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { paymentService } from "@/services/payment.service";
import { AlertCircle, CheckCircle2, Clock, Loader2, Users } from "lucide-react";

type AdminPayment = {
  id: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  transactionId?: string;
  paymentReference?: string;
  planName?: string;
  shopName?: string;
  userName?: string;
  userEmail?: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPayments = async () => {
      const result = await paymentService.getAllPayments();
      if (!mounted) return;

      if (!result.success) {
        setError(result.error || "Failed to load payments");
        setPayments([]);
      } else {
        setPayments((result.data as AdminPayment[]) || []);
        setError(null);
      }

      setLoading(false);
    };

    void loadPayments();

    return () => {
      mounted = false;
    };
  }, []);

  const getStatusIcon = (status?: string) => {
    switch ((status || "").toUpperCase()) {
      case "PAID":
      case "ACTIVE":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-zinc-500" />;
    }
  };

  return (
    <>
      <DashboardRoutePage
        title="Admin Payments"
        description="Review every payment transaction across the platform."
        badge="Billing"
        accent="from-indigo-500 to-cyan-500"
      />

      <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-black p-6 md:p-8">
        {error ? <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>
        ) : payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
            <Users className="mx-auto mb-3 h-10 w-10" />
            No payments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">Shop</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-zinc-900 text-zinc-200">
                    <td className="px-4 py-4 font-mono text-xs">{payment.transactionId || payment.paymentReference || payment.id}</td>
                    <td className="px-4 py-4">{payment.shopName || payment.userName || payment.userEmail || "-"}</td>
                    <td className="px-4 py-4">{payment.planName || "-"}</td>
                    <td className="px-4 py-4">${Number(payment.amount || 0).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span>{payment.status || "UNKNOWN"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
