"use client";

import React, { useEffect, useState } from "react";
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { publicEnv } from "@/lib/env";
import { AlertCircle, Loader2, Users } from "lucide-react";

type AdminUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  emailVerified?: boolean;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        const response = await fetch(`${publicEnv.NEXT_PUBLIC_API_BASE_URL}/users`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const payload = await response.json().catch(() => ({}));
        if (!mounted) return;

        if (!response.ok) {
          setError(payload?.message || "Failed to load users");
          setUsers([]);
        } else {
          setUsers((payload?.data as AdminUser[]) || []);
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

    void loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <DashboardRoutePage
        title="Admin Users"
        description="View platform users and their account status."
        badge="Identity"
        accent="from-cyan-500 to-blue-500"
      />

      <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-black p-6 md:p-8">
        {error ? <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
            <Users className="mx-auto mb-3 h-10 w-10" />
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Verified</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id || `${user.email || index}`} className="border-b border-zinc-900 text-zinc-200">
                    <td className="px-4 py-4">{user.name || "-"}</td>
                    <td className="px-4 py-4">{user.email || "-"}</td>
                    <td className="px-4 py-4">{user.role || "-"}</td>
                    <td className="px-4 py-4">{user.status || "-"}</td>
                    <td className="px-4 py-4">{user.emailVerified ? "Yes" : "No"}</td>
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
