import React from 'react';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ForbiddenAccessProps {
  title?: string;
  message?: string;
  reason?: string;
}

export default function ForbiddenAccessError({
  title = "Access Denied",
  message = "You don't have permission to access this resource.",
  reason = "subscription-expired"
}: ForbiddenAccessProps) {
  const getReasonMessage = () => {
    switch (reason) {
      case 'email-not-verified':
        return {
          title: "Email Verification Required",
          message: "Please verify your email address to access this resource.",
          action: "Check your inbox for a verification email",
        };
      case 'subscription-expired':
        return {
          title: "Subscription Expired",
          message: "Your subscription has expired or is inactive.",
          action: "Renew your subscription to regain access",
        };
      case 'account-not-active':
        return {
          title: "Account Inactive",
          message: "Your account is not currently active.",
          action: "Contact support for assistance",
        };
      case 'shop-not-found':
        return {
          title: "No Shop Found",
          message: "You need to create a shop first.",
          action: "Create a shop to get started",
        };
      default:
        return {
          title,
          message,
          action: "Go back and try again",
        };
    }
  };

  const reasonData = getReasonMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="rounded-[2rem] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black p-8 shadow-lg">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-3">
            {reasonData.title}
          </h1>
          
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
            {reasonData.message}
          </p>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 mb-8 p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg">
            {reasonData.action}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </Link>
            
            {reason === 'subscription-expired' && (
              <Link
                href="/subscriptions"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Renew Subscription
              </Link>
            )}

            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 mt-6">
          If you need help, please contact support
        </p>
      </div>
    </div>
  );
}
