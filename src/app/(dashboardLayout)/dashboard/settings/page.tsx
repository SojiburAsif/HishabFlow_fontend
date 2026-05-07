"use client";

import React from 'react';

// Deprecated settings page — kept as a lightweight route message.

export default function DashboardSettingsPage() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-zinc-500">Account Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">Profile Updated via Navbar</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          The profile editor has moved to the top-right <strong>Update Profile</strong> action in the navbar (modal). Use that modal to update Name, image, display name, phone, shop name, shop image, and preferred shop name.
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-100 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        This page is deprecated — use the navbar &quot;Update Profile&quot; modal instead.
      </div>
    </section>
  );
}
