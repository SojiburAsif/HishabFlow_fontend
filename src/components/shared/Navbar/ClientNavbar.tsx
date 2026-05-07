"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  LogOut,
  Settings,
  Layers,
  Zap,
  ShieldCheck,
  Users,
  LayoutDashboard,
  Crown,
  User,
  Lock,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Logo from "../logo/logo";
import ThemeToggle from "../Theme/Toogle";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { uploadToImgbb } from "@/lib/imageUpload.utils";
import { Role, normalizeRole, type RoleType } from "@/app/constants/role";

type NavbarUser = {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  shortName?: string;
} | null;

const getInitials = (value?: string) => {
  if (!value) return "U";

  return (
    value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
};

const formatRoleLabel = (role?: string) => {
  if (!role) return "Guest";
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

type ProfileFormState = {
  name: string;
  email: string;
  image: string;
  displayName: string;
  phone: string;
  shopName: string;
  preferredShopName: string;
};

type ProfileRecord = {
  name?: string;
  email?: string;
  image?: string;
  fullName?: string;
  role?: string;
  shopName?: string | null;
  displayName?: string | null;
  preferredShopName?: string | null;
  shopOwnerProfile?: {
    displayName?: string | null;
    phone?: string | null;
    preferredShopName?: string | null;
    shop?: {
      shopName?: string | null;
    } | null;
  } | null;
  superAdminProfile?: {
    displayName?: string | null;
  } | null;
  staffProfile?: {
    displayName?: string | null;
    phone?: string | null;
    shop?: {
      shopName?: string | null;
    } | null;
  } | null;
};

const emptyProfileForm = (): ProfileFormState => ({
  name: "",
  email: "",
  image: "",
  displayName: "",
  phone: "",
  shopName: "",
  preferredShopName: "",
});

export default function ClientNavbar({ user }: { user: NavbarUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileRole, setProfileRole] = useState<RoleType | null>(
    normalizeRole(user?.role) ?? null
  );
  const [profileForm, setProfileForm] = useState<ProfileFormState>(
    emptyProfileForm()
  );
  const [resetPasswordForm, setResetPasswordForm] = useState({ email: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const pathname = usePathname();
  const router = useRouter();
  const isMountedRef = useRef(true);
  const profileFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const featuresItems = [
    { title: "Billing System", desc: "Automated tax & digital invoices.", icon: Zap },
    { title: "Inventory Control", desc: "Real-time stock & product tracking.", icon: Layers },
    { title: "Profit Analytics", desc: "Visualize your daily growth & ROI.", icon: ShieldCheck },
    { title: "Staff Management", desc: "Track employee roles & performance.", icon: Users },
  ];

  const displayUser = user ?? null;

  const syncProfileForm = (data?: ProfileRecord | null) => {
    const role = normalizeRole(data?.role ?? displayUser?.role) ?? Role.SHOP_OWNER;
    const shopOwnerProfile = data?.shopOwnerProfile ?? null;
    const superAdminProfile = data?.superAdminProfile ?? null;
    const staffProfile = data?.staffProfile ?? null;

    setProfileRole(role);
    setProfileForm({
      name: data?.name ?? displayUser?.name ?? "",
      email: data?.email ?? displayUser?.email ?? "",
      image: data?.image ?? displayUser?.avatar ?? "",
      displayName:
        data?.displayName ??
        shopOwnerProfile?.displayName ??
        superAdminProfile?.displayName ??
        staffProfile?.displayName ??
        data?.fullName ??
        data?.name ??
        displayUser?.name ??
        "",
      phone: shopOwnerProfile?.phone ?? staffProfile?.phone ?? "",
      shopName:
        data?.shopName ??
        shopOwnerProfile?.shop?.shopName ??
        shopOwnerProfile?.preferredShopName ??
        staffProfile?.shop?.shopName ??
        "",
      preferredShopName: data?.preferredShopName ?? shopOwnerProfile?.preferredShopName ?? "",
    });
  };

  const handleLogout = async () => {
    try {
      if (isMountedRef.current) setIsLoggingOut(true);
      const response = await authService.logout();

      if (response.success) {
        router.push("/");
        router.refresh();
      } else if (isMountedRef.current) {
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (isMountedRef.current) {
        setIsLoggingOut(false);
      }
    }
  };

  const handleOpenProfileModal = async () => {
    setProfileError("");
    setShowProfileModal(true);

    try {
      setProfileLoading(true);
      const response = await userService.getProfile();
      if (response.success && response.data) {
        syncProfileForm(response.data as ProfileRecord);
      } else {
        syncProfileForm(null);
        const errorMsg = response.error || "Failed to load profile details";
        setProfileError(errorMsg);
        toast.error(`❌ ${errorMsg}`);
      }
    } catch (error) {
      syncProfileForm(null);
      const errorMsg = error instanceof Error ? error.message : "Failed to load profile details";
      setProfileError(errorMsg);
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileFieldChange = (field: keyof ProfileFormState, value: string) => {
    setProfileForm((current) => ({ ...current, [field]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isMountedRef.current) setIsSubmittingProfile(true);

      const payload: Record<string, string> = {};

      if (profileForm.name.trim()) payload.name = profileForm.name.trim();
      if (profileForm.image.trim()) payload.image = profileForm.image.trim();

      if (profileRole === Role.SHOP_OWNER) {
        if (profileForm.displayName.trim()) payload.displayName = profileForm.displayName.trim();
        if (profileForm.phone.trim()) payload.phone = profileForm.phone.trim();
        if (profileForm.shopName.trim()) payload.shopName = profileForm.shopName.trim();
        if (profileForm.preferredShopName.trim()) payload.preferredShopName = profileForm.preferredShopName.trim();
      }

      if (profileRole === Role.SUPER_ADMIN || profileRole === Role.STAFF) {
        if (profileForm.displayName.trim()) payload.displayName = profileForm.displayName.trim();
      }

      if (profileRole === Role.STAFF && profileForm.phone.trim()) {
        payload.phone = profileForm.phone.trim();
      }

      const response = await userService.updateProfile(payload);

      if (isMountedRef.current) {
        if (response.success) {
          if (response.data) {
            syncProfileForm(response.data as ProfileRecord);
          }
          toast.success("Profile updated successfully!");
          setTimeout(() => {
            setShowProfileModal(false);
            router.refresh();
          }, 500);
        } else {
          toast.error(`❌ ${response.error || "Failed to update profile"}`);
        }
        setIsSubmittingProfile(false);
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      if (isMountedRef.current) {
        toast.error("❌ An error occurred while updating profile");
        setIsSubmittingProfile(false);
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isMountedRef.current) setIsSubmittingPassword(true);
      const response = await userService.requestPasswordReset(resetPasswordForm);

      if (isMountedRef.current) {
        if (response.success) {
          toast.success(" Password reset email sent! Check your inbox.");
          setShowResetPasswordModal(false);
          setResetPasswordForm({ email: "" });
        } else {
          toast.error(`❌ ${response.error || "Failed to send reset email"}`);
        }
        setIsSubmittingPassword(false);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      if (isMountedRef.current) {
        toast.error("❌ An error occurred while requesting password reset");
        setIsSubmittingPassword(false);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800 py-3 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          {displayUser && (
            <>
              <div className="hidden h-5 w-px bg-zinc-200 dark:bg-zinc-800 lg:block" />
              <Link
                href="/dashboard"
                className={`hidden items-center gap-1.5 text-sm font-semibold transition-all lg:flex ${
                  pathname === "/dashboard"
                    ? "text-purple-600"
                    : "text-zinc-600 hover:text-purple-500 dark:text-zinc-400"
                }`}
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            </>
          )}
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-purple-600"
                  : "text-zinc-700 hover:text-purple-600 dark:text-zinc-300"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("features")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 text-sm font-medium transition-all ${
                activeDropdown === "features" ? "text-purple-600" : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              Features
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  activeDropdown === "features" ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "features" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute left-1/2 top-full mt-4 flex w-190 -translate-x-1/2 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                  style={{ zIndex: 110 }}
                >
                  <div className="grid w-2/3 grid-cols-2 gap-x-8 gap-y-6 p-8">
                    {featuresItems.map((item, i) => (
                      <button key={i} type="button" className="group flex gap-4 text-left">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-900/20">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-purple-600 dark:text-white">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="relative flex w-1/3 flex-col justify-between overflow-hidden bg-linear-to-br from-purple-600 via-purple-600 to-fuchsia-600 p-8 text-white">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-100">
                        Upgrade
                      </p>
                      <h3 className="mt-3 text-2xl font-black leading-tight">
                        Save Time.
                        <br />
                        Manage Faster.
                      </h3>
                      <p className="mt-3 text-xs leading-relaxed text-purple-100">
                        Upgrade to Business Pro for automated reports and multi-shop access.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="relative z-10 mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold text-white transition-all hover:bg-zinc-900"
                    >
                      <Crown size={14} className="text-yellow-400" />
                      Get Unlimited Access
                    </button>

                    <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          <button
            type="button"
            className="relative rounded-full p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-purple-500 dark:hover:bg-zinc-900"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2.5 h-2 w-2 rounded-full border border-white bg-purple-600 dark:border-black" />
          </button>

          {!displayUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-xs font-bold text-zinc-700 transition-all hover:border-purple-500 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-purple-700"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("profile")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-1.5 py-1.5 pr-3 transition-all hover:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                {displayUser?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayUser.avatar}
                    alt="Avatar"
                    className="h-9 w-9 rounded-full bg-zinc-200 object-cover ring-2 ring-white dark:bg-zinc-800 dark:ring-zinc-950"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700 ring-2 ring-white dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-950">
                    {getInitials(displayUser?.shortName || displayUser?.name)}
                  </div>
                )}
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold leading-none text-zinc-900 dark:text-white">
                    {displayUser.shortName}
                  </p>
                  <p className="mt-1 text-[9px] font-bold uppercase text-purple-600 dark:text-purple-400">
                    {formatRoleLabel(displayUser.role)}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-zinc-400 transition-transform ${
                    activeDropdown === "profile" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "profile" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-3 max-h-[calc(100vh-3.5rem)] w-64 overflow-y-auto overflow-x-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                    style={{ zIndex: 110 }}
                  >
                    <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        {displayUser.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={displayUser.avatar}
                            alt="Profile avatar"
                            className="h-11 w-11 rounded-2xl object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-sm font-black text-purple-600 dark:bg-purple-900/20 dark:text-purple-300">
                            {getInitials(displayUser.name || displayUser.email)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                            {displayUser.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-zinc-500">
                            {displayUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 px-2 pb-3 pt-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 rounded-2xl p-2.5 text-xs font-medium text-zinc-700 transition hover:bg-purple-50 dark:text-zinc-300 dark:hover:bg-purple-900/20"
                      >
                        <LayoutDashboard size={14} /> My Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2.5 rounded-2xl p-2.5 text-xs font-medium text-zinc-700 transition hover:bg-purple-50 dark:text-zinc-300 dark:hover:bg-purple-900/20"
                      >
                        <Settings size={14} /> Settings
                      </Link>
                      <button
                        type="button"
                        onClick={handleOpenProfileModal}
                        className="flex w-full items-center gap-2.5 rounded-2xl p-2.5 text-left text-xs font-medium text-zinc-700 transition hover:bg-purple-50 dark:text-zinc-300 dark:hover:bg-purple-900/20"
                      >
                        <User size={14} /> Update Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResetPasswordForm({ email: displayUser.email || "" });
                          setMessage({ type: "", text: "" });
                          setShowResetPasswordModal(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-2xl p-2.5 text-left text-xs font-medium text-zinc-700 transition hover:bg-purple-50 dark:text-zinc-300 dark:hover:bg-purple-900/20"
                      >
                        <Lock size={14} /> Reset Password
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="mt-3 flex w-full items-center gap-2.5 rounded-2xl border border-zinc-100 px-2.5 py-3 text-left text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-zinc-800 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={14} /> {isLoggingOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            type="button"
            className="rounded-full p-2 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 top-full w-full overflow-hidden border-b border-zinc-200 bg-white px-5 py-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 lg:hidden"
            style={{ zIndex: 100 }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition ${
                    pathname === link.href ? "text-purple-600" : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {displayUser ? (
                <>
                  <Link href="/dashboard" className="text-sm font-semibold text-purple-600">
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleOpenProfileModal}
                    className="text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Update Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetPasswordForm({ email: displayUser.email || "" });
                      setMessage({ type: "", text: "" });
                      setShowResetPasswordModal(true);
                    }}
                    className="text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Reset Password
                  </button>
                  <hr className="border-zinc-200 dark:border-zinc-800" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-left text-sm font-bold text-red-500 disabled:opacity-50"
                  >
                    {isLoggingOut ? "Signing out..." : "Logout System"}
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm"
            onClick={() => {
              setShowProfileModal(false);
              setProfileLoading(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative flex w-full max-w-6xl max-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-6 border-b border-zinc-200 px-6 py-5 dark:border-zinc-800 md:px-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">
                    Profile Update
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">
                    Update your account
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Edit the shared profile fields plus role-specific business data.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-full border border-zinc-200 p-2.5 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form ref={profileFormRef} onSubmit={handleUpdateProfile} className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[320px_1fr]">
                <div className="border-b border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30 lg:border-b-0 lg:border-r lg:overflow-y-auto">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="h-28 w-28 overflow-hidden rounded-full bg-zinc-100 ring-4 ring-white shadow-lg dark:bg-zinc-800 dark:ring-zinc-950">
                        {profileForm.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profileForm.image}
                            alt="Profile avatar"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-600 to-fuchsia-600 text-3xl font-black text-white">
                            {getInitials(displayUser?.shortName || displayUser?.name)}
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-purple-600 p-2 text-white shadow-lg transition hover:bg-purple-700">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadToImgbb(file);
                              handleProfileFieldChange("image", url);
                              toast.success("👤 Avatar updated! (Click save to persist)");
                            } catch (err) {
                              toast.error(err instanceof Error ? err.message : "❌ Upload failed");
                            }
                          }}
                        />
                        <User size={14} />
                      </label>
                    </div>

                    <div className="mt-5">
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">
                        {profileForm.displayName || profileForm.name || displayUser?.name || "Your profile"}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {displayUser?.email}
                      </p>
                      <span className="mt-3 inline-flex rounded-full bg-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-purple-600 dark:bg-purple-900/20 dark:text-purple-300">
                        {formatRoleLabel(profileRole ?? displayUser?.role)}
                      </span>
                    </div>

                    {profileRole === Role.SHOP_OWNER && (
                      <div className="mt-6 w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-500">
                          Business Preview
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                              {profileForm.shopName || "Shop name"}
                            </p>
                            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                              {profileForm.preferredShopName || "Preferred shop name"}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-purple-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-purple-600 dark:bg-purple-900/20 dark:text-purple-300">
                            Ready
                          </div>
                        </div>
                      </div>
                    )}

                    {(message.text || profileError) && (
                      <div
                        className={`mt-5 rounded-2xl p-4 text-sm font-medium ${
                          message.type === "success"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                        }`}
                      >
                        {message.text || profileError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="min-h-0 overflow-y-auto p-6 md:p-8">
                  {profileLoading ? (
                    <div className="flex min-h-120 items-center justify-center rounded-[1.75rem] border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                      <div className="flex flex-col items-center gap-3 text-sm font-semibold text-zinc-500 dark:text-zinc-300">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20">
                          <svg
                            className="h-8 w-8 animate-spin text-purple-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeOpacity="0.15"
                              strokeWidth="4"
                            />
                            <path
                              d="M22 12a10 10 0 0 1-10 10"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div>Loading profile data</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
                              Shared Info
                            </p>
                            <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                              Basic account fields
                            </h3>
                          </div>
                          <div className="rounded-2xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-900/20">
                            <LayoutDashboard size={18} />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="space-y-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                              Name
                            </span>
                            <input
                              type="text"
                              value={profileForm.name}
                              onChange={(e) => handleProfileFieldChange("name", e.target.value)}
                              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-950"
                              placeholder="Your full name"
                            />
                          </label>

                          <label className="space-y-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                              Email
                            </span>
                            <input
                              type="email"
                              value={profileForm.email}
                              disabled
                              className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-500 outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                            />
                          </label>
                        </div>
                      </div>

                      {profileRole === Role.SHOP_OWNER && (
                        <div className="rounded-[1.75rem] border border-purple-200 bg-linear-to-br from-purple-50 to-white p-5 shadow-sm dark:border-purple-900/30 dark:from-purple-900/10 dark:to-zinc-950">
                          <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-500">
                                Shop Owner Fields
                              </p>
                              <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                                Business profile
                              </h3>
                            </div>
                            <Store size={20} className="text-purple-500" />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-2">
                              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                                Display Name
                              </span>
                              <input
                                type="text"
                                value={profileForm.displayName}
                                onChange={(e) => handleProfileFieldChange("displayName", e.target.value)}
                                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                placeholder="Store display name"
                              />
                            </label>

                            <label className="space-y-2">
                              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                                Phone
                              </span>
                              <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) => handleProfileFieldChange("phone", e.target.value)}
                                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                placeholder="Phone number"
                              />
                            </label>

                            <label className="space-y-2">
                              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                                Preferred Shop Name
                              </span>
                              <input
                                type="text"
                                value={profileForm.preferredShopName}
                                onChange={(e) => handleProfileFieldChange("preferredShopName", e.target.value)}
                                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                placeholder="Preferred shop name"
                              />
                            </label>

                            <label className="space-y-2">
                              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                                Shop Name
                              </span>
                              <input
                                type="text"
                                value={profileForm.shopName}
                                onChange={(e) => handleProfileFieldChange("shopName", e.target.value)}
                                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                placeholder="Business/shop name"
                              />
                            </label>

                            <div className="md:col-span-2 rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                              Shop image controls are disabled for now. Save only updates your account and shop name fields.
                            </div>
                          </div>
                        </div>
                      )}

                      {profileRole === Role.SUPER_ADMIN && (
                        <div className="rounded-[1.75rem] border border-sky-200 bg-linear-to-br from-sky-50 to-white p-5 shadow-sm dark:border-sky-900/30 dark:from-sky-900/10 dark:to-zinc-950">
                          <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-500">
                                Admin Fields
                              </p>
                              <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                                Admin profile
                              </h3>
                            </div>
                            <ShieldCheck size={20} className="text-sky-500" />
                          </div>

                          <label className="block space-y-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                              Display Name
                            </span>
                            <input
                              type="text"
                              value={profileForm.displayName}
                              onChange={(e) => handleProfileFieldChange("displayName", e.target.value)}
                              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                              placeholder="Admin display name"
                            />
                          </label>
                        </div>
                      )}

                      {profileRole === Role.STAFF && (
                        <div className="rounded-[1.75rem] border border-violet-200 bg-linear-to-br from-violet-50 to-white p-5 shadow-sm dark:border-violet-900/30 dark:from-violet-900/10 dark:to-zinc-950">
                          <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-500">
                                Staff Fields
                              </p>
                              <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                                Staff profile
                              </h3>
                            </div>
                            <Users size={20} className="text-violet-500" />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-2">
                              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                                Display Name
                              </span>
                              <input
                                type="text"
                                value={profileForm.displayName}
                                onChange={(e) => handleProfileFieldChange("displayName", e.target.value)}
                                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                placeholder="Staff display name"
                              />
                            </label>

                            <label className="space-y-2">
                              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                                Phone
                              </span>
                              <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) => handleProfileFieldChange("phone", e.target.value)}
                                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                placeholder="Phone number"
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-zinc-200 bg-white/95 px-1 pt-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:flex-row sm:items-center sm:justify-between lg:col-span-2 lg:px-6 lg:py-5">
                        <p className="text-xs leading-6 text-zinc-500 dark:text-zinc-400">
                          Save changes to update your shared profile and role-specific business data.
                        </p>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowProfileModal(false)}
                            className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => profileFormRef.current?.requestSubmit()}
                            disabled={isSubmittingProfile}
                            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:from-purple-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSubmittingProfile ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResetPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowResetPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">
                  Reset Password
                </p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  Change your password
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  We&apos;ll send a reset link to your email address.
                </p>
              </div>

              <div className="p-6">
                {message.text && (
                  <div
                    className={`mb-4 rounded-2xl p-4 text-sm font-medium ${
                      message.type === "success"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <label className="block space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">
                      Email Address
                    </span>
                    <input
                      type="email"
                      value={resetPasswordForm.email}
                      onChange={(e) => setResetPasswordForm({ email: e.target.value })}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                      placeholder={displayUser?.email || "your@email.com"}
                      required
                    />
                  </label>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowResetPasswordModal(false)}
                      className="flex-1 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingPassword}
                      className="flex-1 rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmittingPassword ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}