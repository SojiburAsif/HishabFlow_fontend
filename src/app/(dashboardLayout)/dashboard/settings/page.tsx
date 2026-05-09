'use client';

import React from 'react';
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { Save, AlertCircle, Bell, Lock, Eye, EyeOff } from 'lucide-react';

export default function DashboardSettingsPage() {
  const [shopSettings, setShopSettings] = React.useState({
    shopName: 'My Store',
    email: 'shop@example.com',
    phone: '+1 (555) 000-0000',
    address: '123 Main Street, City, State 12345',
    currency: 'USD',
    timezone: 'EST',
  });
  const [emailNotifications, setEmailNotifications] = React.useState({
    orderNotifications: true,
    paymentAlerts: true,
    weeklyReport: true,
    promotionEmails: false,
  });
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleShopSettingChange = (key: string, value: string) => {
    setShopSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <>
      <DashboardRoutePage
        title="Settings"
        description="Configure shop settings, notifications, and preferences."
        badge="Configuration"
        accent="from-emerald-500 to-teal-500"
      />

      <div className="mt-8 space-y-6">
        {/* Shop Settings */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Shop Settings</h3>
            <p className="mt-1 text-sm text-zinc-400">Manage your store information and preferences</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Shop Name</label>
                <input
                  type="text"
                  value={shopSettings.shopName}
                  onChange={(e) => handleShopSettingChange('shopName', e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={shopSettings.email}
                  onChange={(e) => handleShopSettingChange('email', e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={shopSettings.phone}
                  onChange={(e) => handleShopSettingChange('phone', e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Currency</label>
                <select
                  value={shopSettings.currency}
                  onChange={(e) => handleShopSettingChange('currency', e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>BDT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Timezone</label>
                <select
                  value={shopSettings.timezone}
                  onChange={(e) => handleShopSettingChange('timezone', e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option>EST</option>
                  <option>CST</option>
                  <option>MST</option>
                  <option>PST</option>
                  <option>UTC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Address</label>
                <input
                  type="text"
                  value={shopSettings.address}
                  onChange={(e) => handleShopSettingChange('address', e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
            <p className="mt-1 text-sm text-zinc-400">Choose which notifications you'd like to receive</p>
          </div>

          <div className="space-y-4">
            {[
              { key: 'orderNotifications' as const, label: 'Order Notifications', description: 'Get notified when new orders are placed' },
              { key: 'paymentAlerts' as const, label: 'Payment Alerts', description: 'Receive alerts for successful and failed payments' },
              { key: 'weeklyReport' as const, label: 'Weekly Reports', description: 'Get a summary of weekly sales and performance' },
              { key: 'promotionEmails' as const, label: 'Promotion Emails', description: 'Receive special offers and promotions from us' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 hover:bg-black/50 transition">
                <div>
                  <p className="font-medium text-white">{setting.label}</p>
                  <p className="text-xs text-zinc-400">{setting.description}</p>
                </div>
                <button
                  onClick={() => handleNotificationChange(setting.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    emailNotifications[setting.key as keyof typeof emailNotifications]
                      ? 'bg-emerald-600'
                      : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      emailNotifications[setting.key as keyof typeof emailNotifications]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Security</h3>
            <p className="mt-1 text-sm text-zinc-400">Manage your password and security settings</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-all ${
              saveStatus === 'saving'
                ? 'bg-zinc-700 cursor-not-allowed'
                : saveStatus === 'saved'
                ? 'bg-emerald-600'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/50'
            }`}
            disabled={saveStatus === 'saving'}
          >
            <Save className="h-4 w-4" />
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </>
  );
}
