"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";

export default function EmailVerifyPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (!mounted) return;

        if (response.success && response.data) {
          const profile = response.data as { email?: string; name?: string; fullName?: string };
          setEmail(profile.email || "");
          setName(profile.name || profile.fullName || "");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleResend = async () => {
    if (!email) {
      toast.error("❌ Email address is required");
      return;
    }

    try {
      setSending(true);
      const response = await authService.resendVerificationEmail(email, name || undefined);

      if (response.success) {
        toast.success(response.message || "Verification email sent");
      } else {
        toast.error(`❌ ${response.error || "Failed to send verification email"}`);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-[2rem] border border-zinc-800 bg-black/70 p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
          <MailCheck className="h-8 w-8" />
        </div>

        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Email Verification</p>
        <h1 className="mt-3 text-center text-3xl font-black tracking-tight md:text-4xl">Check your inbox to verify your account</h1>
        <p className="mt-4 max-w-2xl text-center text-sm leading-6 text-zinc-400">
          We sent a verification link to your registered email address. If you do not see it, you can resend the email below.
        </p>

        <div className="mt-8 w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">Email Address</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500 disabled:opacity-60"
              placeholder="you@example.com"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={sending || loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {sending ? "Sending..." : "Resend Verification Email"}
            </button>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900">
              Back to Login
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs text-zinc-500">If you already verified your email, refresh the page or go back to the dashboard.</p>
      </div>
    </main>
  );
}
