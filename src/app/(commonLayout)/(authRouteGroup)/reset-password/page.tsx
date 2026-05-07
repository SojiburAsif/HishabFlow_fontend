"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Eye, EyeOff, Loader2, 
  LockKeyhole, ShieldCheck, Sparkles, 
  Mail, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '@/services/user.service';
import Logo from '@/components/shared/logo/logo';


type ResetStatus = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ResetStatus>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !token) {
      setStatus({ type: 'error', message: 'Reset link is invalid or expired.' });
      return;
    }
    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Securing your account...' });
      const response = await userService.confirmPasswordReset({ email, token, password });

      if (!response.success) {
        setStatus({ type: 'error', message: response.error || 'Reset failed.' });
        return;
      }

      setStatus({ type: 'success', message: 'Password updated successfully! Redirecting...' });
      window.setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const hasValidLink = Boolean(email && token);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505] px-4 py-12 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] grid lg:grid-cols-[1.1fr_0.9fr] gap-0 z-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl shadow-2xl overflow-hidden"
      >
        {/* Left Section: Branding */}
        <div className="p-10 md:p-14 bg-zinc-50 dark:bg-zinc-900/40 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="mb-10"><Logo /></div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-900/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400 mb-6">
              <ShieldCheck size={14} /> Security Protocol
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] text-zinc-900 dark:text-white tracking-tight">
              Regain control of <br />
              <span className="text-purple-600">your ShopFlow.</span>
            </h1>
            <p className="mt-6 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
              We take security seriously. Please create a strong, unique password to protect your business data and financial records.
            </p>
          </div>

          <div className="space-y-4 pt-10 border-t border-zinc-200 dark:border-zinc-800/50 mt-10">
             <div className="flex items-center gap-3">
             
               
             </div>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">New Password</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Reset your credentials below</p>
          </div>

          <AnimatePresence mode="wait">
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mb-6 p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
                  status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 
                  status.type === 'info' ? 'bg-purple-500/10 border-purple-500/20 text-purple-600' : 
                  'bg-rose-500/10 border-rose-500/20 text-rose-600'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 size={16}/> : <ShieldAlert size={16}/>}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Create Password</label>
              <div className="group flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 text-zinc-900 shadow-sm transition-all focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
                <LockKeyhole size={18} className="text-zinc-400 group-focus-within:text-purple-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-400 hover:text-purple-500 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Confirm Password</label>
              <div className="group flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 text-zinc-900 shadow-sm transition-all focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
                <LockKeyhole size={18} className="text-zinc-400 group-focus-within:text-purple-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!hasValidLink || loading}
              className="w-full h-12 mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-[1.2rem] font-bold text-sm shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'Updating Security...' : 'Update Password'}
            </button>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-black text-zinc-400 hover:text-purple-600 uppercase tracking-widest transition-colors">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}