'use client';

import React from 'react';
import DashboardRoutePage from '@/components/shared/dashboard/DashboardRoutePage';
import { Users, Plus, User, Shield, AlertCircle } from 'lucide-react';

export default function TeamPage() {
  return (
    <>
      <DashboardRoutePage
        title="Team Members"
        description="Manage your shop staff and assign roles and permissions"
        badge="Team"
        accent="from-purple-500 to-pink-500"
      />

      <div className="mt-8 space-y-6">
        {/* Add Team Member */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Staff Members</h3>
              <p className="mt-1 text-sm text-zinc-400">Manage your team and their permissions</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700">
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-zinc-900 p-4">
              <Users className="h-12 w-12 text-zinc-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">No Team Members Yet</h3>
            <p className="mb-6 max-w-md text-zinc-400">You can add staff members to your shop to help manage orders, inventory, and reports.</p>
            <button className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-700">
              <Plus className="h-4 w-4" />
              Invite Your First Team Member
            </button>
          </div>
        </div>

        {/* Role Information */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="mb-4 text-lg font-bold text-white">Team Roles</h3>
          
          <div className="space-y-3">
            <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-400 mt-1" />
                <div>
                  <p className="font-semibold text-white">Owner</p>
                  <p className="text-sm text-zinc-400">Full access to shop settings, team management, and finances</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold text-white">Manager</p>
                  <p className="text-sm text-zinc-400">Can manage orders, inventory, and view reports</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <p className="font-semibold text-white">Staff</p>
                  <p className="text-sm text-zinc-400">Can process orders and update inventory only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-[2rem] border border-yellow-500/30 bg-yellow-500/10 p-6">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 shrink-0 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-200">Pro Tip</h4>
              <p className="mt-1 text-sm text-yellow-200/80">
                Give different permissions to different team members based on their responsibilities. For example, salespeople don t need access to financial reports, and inventory managers dont need order processing permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
