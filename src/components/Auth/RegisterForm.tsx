"use client";

import React, { useState } from "react";
import { 
  User, Mail, Lock, Phone, Store, 
  ArrowRight, UploadCloud, Loader2,
  Camera, AlertCircle, CheckCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { uploadToImgbb } from "@/lib/imageUpload.utils";
import { authService } from "@/services/auth.service";
import Logo from "../shared/logo/logo";


// --- Compact Input Field ---
type FieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Field({ label, placeholder, type = "text", icon, value, onChange }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <div className="group flex h-10 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-900 shadow-sm transition-all focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
        <span className="text-zinc-400 group-focus-within:text-purple-500 transition-colors">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-xs font-medium outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />
      </div>
    </label>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    displayName: "",
    phone: "",
    shopName: "",
  });

  // UI state
  const [shopImageUrl, setShopImageUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isUploadingShop, setIsUploadingShop] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'shop' | 'profile') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'shop') setIsUploadingShop(true);
    else setIsUploadingProfile(true);

    try {
      const uploadedUrl = await uploadToImgbb(file);
      if (type === 'shop') setShopImageUrl(uploadedUrl);
      else setProfileImageUrl(uploadedUrl);
    } catch (err) {
      setError(`Failed to upload ${type} image`);
    } finally {
      setIsUploadingShop(false);
      setIsUploadingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!formData.shopName.trim()) {
      setError("Shop name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || formData.name,
        phone: formData.phone,
        shopName: formData.shopName,
        image: profileImageUrl,
        shopImage: shopImageUrl,
      });

      if (response.success) {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#050505] flex flex-col items-center justify-center py-12 px-4 pt-24 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Glow */}
      <div className="absolute top-24 left-0 w-full h-[calc(100%-96px)] pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl z-10"
      >
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 md:p-10">
            
            {/* Logo & Branding */}
            <div className="flex items-center justify-center mb-6">
              <Logo />
            </div>

            {/* User Profile Image (Small & Top) */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full border-2 border-purple-500/30 p-1 bg-white dark:bg-zinc-900 overflow-hidden">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <div className="h-full w-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      {isUploadingProfile ? <Loader2 className="animate-spin" size={20} /> : <User size={24} />}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 h-7 w-7 bg-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-purple-700 transition-colors">
                  <Camera size={14} />
                  <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'profile')} />
                </label>
              </div>
              <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white text-center">Create Your Account</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Start managing your shop today</p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field 
                  label="Full Name" 
                  placeholder="Mohammad Sojibur Rahman" 
                  icon={<User size={14} />}
                  value={formData.name}
                  onChange={handleFieldChange("name")}
                />
                <Field 
                  label="Display Name" 
                  placeholder="Shop Manager / Owner" 
                  icon={<User size={14} />}
                  value={formData.displayName}
                  onChange={handleFieldChange("displayName")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field 
                  type="email" 
                  label="Email Address" 
                  placeholder="you@yourbusiness.com" 
                  icon={<Mail size={14} />}
                  value={formData.email}
                  onChange={handleFieldChange("email")}
                />
                <Field 
                  type="tel" 
                  label="Phone Number" 
                  placeholder="+880 17XX XXX XXXX" 
                  icon={<Phone size={14} />}
                  value={formData.phone}
                  onChange={handleFieldChange("phone")}
                />
              </div>

              <Field 
                type="password" 
                label="Password" 
                placeholder="Create a strong password (min 8 characters)" 
                icon={<Lock size={14} />}
                value={formData.password}
                onChange={handleFieldChange("password")}
              />

              <div className="py-2"><div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" /></div>

              <Field 
                label="Shop Name" 
                placeholder="Your Business Name (e.g., Asif Mart, Tech Shop)" 
                icon={<Store size={14} />}
                value={formData.shopName}
                onChange={handleFieldChange("shopName")}
              />

              {/* Shop Banner Image (Large & Stylish) */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Store Logo / Banner</span>
                <div className="relative group h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden hover:border-purple-500/50 transition-all">
                  {shopImageUrl ? (
                    <img src={shopImageUrl} alt="Shop" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      {isUploadingShop ? <Loader2 className="animate-spin text-purple-500" /> : <UploadCloud size={24} />}
                      <span className="text-[10px] font-bold uppercase">Upload Shop Branding</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleImageUpload(e, 'shop')} 
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2 group transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create My Shop
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex flex-col gap-3 mt-6">
                <p className="text-center text-[11px] text-zinc-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-600 font-black hover:underline">
                    Sign In
                  </Link>
                </p>
                
                {/* Links for Trust */}
                <div className="flex justify-center gap-6 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                  <Link href="/faq" className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-purple-500 transition-colors">Help & FAQ</Link>
                  <Link href="/terms" className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-purple-500 transition-colors">Privacy Policy</Link>
                </div>
              </div>
            </form>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}