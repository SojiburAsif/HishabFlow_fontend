"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { publicEnv } from "@/lib/env";
import Logo from "../shared/logo/logo";


// --- Google Icon Component ---
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// --- Custom Input Field ---
type InputFieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({ label, placeholder, type = "text", icon, value, onChange }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </label>
      <div className="group flex h-11 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 shadow-sm transition-all focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
        <span className="text-zinc-400 group-focus-within:text-purple-500 transition-colors">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />
      </div>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFieldChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      const backendOAuthUrl = `${publicEnv.NEXT_PUBLIC_API_BASE_URL}/auth/login/google?callbackURL=${encodeURIComponent(
        "/dashboard"
      )}`;
      window.location.href = backendOAuthUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#050505] flex flex-col items-center justify-center py-12 px-4 pt-24 relative overflow-hidden transition-colors duration-500">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-[0_32px_100px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_100px_rgba(0,0,0,0.4)] overflow-hidden p-8 md:p-10">
          
          {/* Logo Inside Form */}
          <div className="flex items-center justify-center mb-6">
            <Logo />
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5">Sign in to manage your shop</p>
          </div>

          <div className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="flex gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-900">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="flex gap-3 rounded-xl bg-green-50 dark:bg-green-950/30 p-3 border border-green-200 dark:border-green-900">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-green-700 dark:text-green-300 font-medium">{success}</p>
              </div>
            )}
            
            {/* Social Login */}
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-100 dark:border-zinc-900"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Or use email</span>
              <div className="flex-grow border-t border-zinc-100 dark:border-zinc-900"></div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField 
                label="Email Address" 
                placeholder="you@yourbusiness.com" 
                icon={<Mail size={16} />} 
                type="email"
                value={formData.email}
                onChange={handleFieldChange("email")}
              />
              
              <div className="space-y-1">
                <InputField 
                  label="Password" 
                  placeholder="Enter your password" 
                  icon={<Lock size={16} />} 
                  type="password"
                  value={formData.password}
                  onChange={handleFieldChange("password")}
                />
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-[10px] font-bold text-purple-600 hover:text-purple-500 transition-colors uppercase tracking-widest">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Login Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2 group transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to ShopFlow
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Footer */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center">
              <p className="text-[11px] text-zinc-500 font-medium">
                Don&rsquo;t have a shop yet?{" "}
                <Link href="/register" className="text-purple-600 font-black hover:underline underline-offset-4">
                  Create Account
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Extra Navigation Links */}
        <div className="flex justify-center gap-8 mt-8">
           <Link href="/faq" className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-purple-500 flex items-center gap-1.5 transition-colors">
              Help Center <ChevronRight size={10} />
           </Link>
           <Link href="/privacy" className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-purple-500 flex items-center gap-1.5 transition-colors">
              Privacy Shield <ChevronRight size={10} />
           </Link>
        </div>
      </motion.div>
    </div>
  );
}