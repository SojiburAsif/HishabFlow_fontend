'use client';

import React from 'react';
import DashboardRoutePage from '@/components/shared/dashboard/DashboardRoutePage';
import { Bell, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <>
      <DashboardRoutePage
        title="Notifications"
        description="Stay updated with important alerts and messages about your shop"
        badge="Messages"
        accent="from-blue-500 to-cyan-500"
      />

      <div className="mt-8 space-y-6">
        {/* Notification Settings */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="mb-4 text-lg font-bold text-white">Notification Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/50 p-4 cursor-pointer hover:bg-black/70">
              <input type="checkbox" className="h-4 w-4" defaultChecked />
              <div>
                <p className="font-semibold text-white">Order Alerts</p>
                <p className="text-xs text-zinc-400">Get notified when you receive new orders</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/50 p-4 cursor-pointer hover:bg-black/70">
              <input type="checkbox" className="h-4 w-4" defaultChecked />
              <div>
                <p className="font-semibold text-white">Payment Notifications</p>
                <p className="text-xs text-zinc-400">Get notified about payment updates and confirmations</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/50 p-4 cursor-pointer hover:bg-black/70">
              <input type="checkbox" className="h-4 w-4" defaultChecked />
              <div>
                <p className="font-semibold text-white">System Updates</p>
                <p className="text-xs text-zinc-400">Get notified about new features and system maintenance</p>
              </div>
            </label>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="mb-4 text-lg font-bold text-white">Recent Notifications</h3>
          
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-black/50 p-4 flex gap-4">
              <div className="mt-1 rounded-full bg-green-500/20 p-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Welcome to Your Dashboard!</p>
                <p className="text-sm text-zinc-400">You successfully logged in to ShopFlow. Start managing your shop now.</p>
                <p className="mt-1 text-xs text-zinc-500">2 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-[2rem] border border-blue-500/30 bg-blue-500/10 p-6">
          <div className="flex gap-4">
            <Info className="h-6 w-6 shrink-0 text-blue-400 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-200">Notification Center Coming Soon</h4>
              <p className="mt-1 text-sm text-blue-200/80">
                We're building a comprehensive notification system. Soon you'll be able to view, filter, and manage all notifications in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <h4 className="font-semibold text-white">Alerts</h4>
            </div>
            <p className="text-xs text-zinc-400">Warnings for low stock, payment issues, and system alerts</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-white">Updates</h4>
            </div>
            <p className="text-xs text-zinc-400">Information about new features and system improvements</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-white">Confirmations</h4>
            </div>
            <p className="text-xs text-zinc-400">Confirmations for actions like payments and orders</p>
          </div>
        </div>
      </div>
    </>
  );
}
