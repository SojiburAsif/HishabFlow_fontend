"use client";

import React, { useState, useEffect } from 'react';
import {
  Menu, X, ChevronDown, Bell,
  LogOut, User, Settings, Layers, Zap, 
  ShieldCheck, Users, LayoutDashboard,
  ArrowRight, Crown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../logo/logo';
import ThemeToggle from '../Theme/Toogle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const staticUser = {
    name: "Sojibur Rahman Asif",
    shortName: "Asif",
    role: "Shop Owner",
    email: "asif@shopflow.local",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Asif",
    isLoggedIn: true
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  const featuresItems = [
    { title: 'Billing System', desc: 'Automated tax & digital invoices.', icon: Zap },
    { title: 'Inventory Control', desc: 'Real-time stock & product tracking.', icon: Layers },
    { title: 'Profit Analytics', desc: 'Visualize your daily growth & ROI.', icon: ShieldCheck },
    { title: 'Staff Management', desc: 'Track employee roles & performance.', icon: Users },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-zinc-200 dark:border-purple-900/20 py-2 shadow-sm'
          : 'bg-transparent py-5'
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* 1. Logo & Dashboard */}
        <div className="flex items-center gap-5">
          <Link href="/" className="shrink-0"><Logo /></Link>
          {staticUser.isLoggedIn && (
            <>
              <div className="hidden lg:block h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
              <Link
                href="/dashboard"
                className={`hidden lg:flex items-center gap-1.5 text-sm font-semibold transition-all ${
                  pathname === '/dashboard' ? 'text-purple-600' : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-500'
                }`}
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            </>
          )}
        </div>

        {/* 2. Main Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href 
                ? 'text-purple-600' 
                : 'text-zinc-700 dark:text-zinc-300 hover:text-purple-600'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Features Mega Dropdown (Screen Shot Style) */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('features')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className={`text-sm font-medium transition-all flex items-center gap-1 ${
                activeDropdown === 'features' ? 'text-purple-600' : 'text-zinc-700 dark:text-zinc-300'
              }`}>
              Features <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {activeDropdown === 'features' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                  className="absolute top-full -left-48 mt-4 w-[750px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-purple-900/20 rounded-[2rem] shadow-2xl overflow-hidden flex z-[110]"
                >
                  {/* Left Side: Items */}
                  <div className="w-2/3 p-8 grid grid-cols-2 gap-x-8 gap-y-6">
                    {featuresItems.map((item, i) => (
                      <Link key={i} href="#" className="flex gap-4 group">
                        <div className="h-10 w-10 shrink-0 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 transition-colors">{item.title}</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Right Side: Pro Card (SS Style) */}
                  <div className="w-1/3 bg-purple-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xl font-black leading-tight">Save Time. <br /> Manage Faster.</h3>
                      <p className="text-purple-100 text-xs mt-3 leading-relaxed">Upgrade to Business Pro for automated reports and multi-shop access.</p>
                    </div>
                    <button className="relative z-10 mt-6 bg-black text-white px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all">
                      <Crown size={14} className="text-yellow-400" />
                      Get Unlimited Access
                    </button>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full opacity-50 blur-2xl"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. Right Actions & Profile */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button className="relative p-2 text-zinc-500 hover:text-purple-500 transition-all">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-600 rounded-full border border-white dark:border-black"></span>
          </button>

          {staticUser.isLoggedIn ? (
            <div className="relative" onMouseEnter={() => setActiveDropdown('profile')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-3 pl-1 pr-3 py-1 border border-zinc-200 dark:border-purple-900/30 rounded-full bg-zinc-50 dark:bg-zinc-900/50 hover:border-purple-500 transition-all">
                <img src={staticUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white leading-none">{staticUser.shortName}</p>
                  <p className="text-[9px] text-purple-600 dark:text-purple-400 font-bold uppercase mt-1">{staticUser.role}</p>
                </div>
                <ChevronDown size={14} className={`text-zinc-400 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-black border border-zinc-200 dark:border-purple-900/30 rounded-2xl p-2 shadow-2xl z-[110]">
                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{staticUser.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{staticUser.email}</p>
                    </div>
                    <div className="p-1 space-y-1">
                      <Link href="/dashboard" className="flex items-center gap-2.5 p-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg">
                        <LayoutDashboard size={14} /> My Dashboard
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2.5 p-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg">
                        <Settings size={14} /> Settings
                      </Link>
                      <button className="w-full flex items-center gap-2.5 p-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all pt-2 mt-1 border-t dark:border-zinc-800">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/register" className="bg-purple-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-purple-700 transition-all shadow-md">Get Started</Link>
          )}

          {/* Mobile Menu */}
          <button className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-5 lg:hidden overflow-hidden shadow-2xl">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className={`text-sm font-semibold ${pathname === link.href ? 'text-purple-600' : ''}`}>{link.name}</Link>
            ))}
            {staticUser.isLoggedIn && <Link href="/dashboard" className="text-sm font-semibold text-purple-600">Dashboard</Link>}
            <hr className="dark:border-zinc-800" />
            <button className="text-sm font-bold text-red-500 text-left">Logout System</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}