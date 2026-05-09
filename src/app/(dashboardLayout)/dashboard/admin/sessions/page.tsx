"use client";

import React, { useEffect, useState } from "react";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { publicEnv } from "@/lib/env";
import { AlertCircle, Loader2, Shield, Trash2 } from "lucide-react";

type AdminSession = {
  id: string;
  token?: string;
  expiresAt?: string;
  createdAt?: string;
  ipAddress?: string;
  userAgent?: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
  };
};

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSessions = async () => {
      try {
        const response = await fetch(`${publicEnv.NEXT_PUBLIC_API_BASE_URL}/sessions/admin`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const payload = await response.json().catch(() => ({}));
        if (!mounted) return;

        if (!response.ok) {
          setError(payload?.message || "Failed to load sessions");
          setSessions([]);
        } else {
          setSessions((payload?.data as AdminSession[]) || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadSessions();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <DashboardRoutePage
        title="Admin Sessions"
        description="Inspect active user sessions and manage access tokens."
        badge="Security"
        accent="from-sky-500 to-cyan-500"
      />

      <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-black p-6 md:p-8">
        {error ? <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
            <Shield className="mx-auto mb-3 h-10 w-10" />
            No sessions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">IP</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b border-zinc-900 text-zinc-200">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-white">{session.user?.name || "Unknown"}</p>
                        <p className="text-xs text-zinc-400">{session.user?.email || "-"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">{session.user?.role || "-"}</td>
                    <td className="px-4 py-4">{session.createdAt ? new Date(session.createdAt).toLocaleString() : "-"}</td>
                    <td className="px-4 py-4">{session.expiresAt ? new Date(session.expiresAt).toLocaleString() : "-"}</td>
                    <td className="px-4 py-4 text-xs text-zinc-400">{session.ipAddress || "-"}</td>
                    <td className="px-4 py-4">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-rose-500 hover:text-rose-300">
                        <Trash2 className="h-3.5 w-3.5" />
                        Revoke
                      </button>
                    </td>
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
