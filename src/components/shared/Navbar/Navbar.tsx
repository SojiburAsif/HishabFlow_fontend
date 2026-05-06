"use client";

import React, { useState, useEffect } from 'react';
import {
  Menu, X, ChevronDown, Rocket, Bell,
  LogOut, User, Settings, Layers, Zap, 
  ShieldCheck, Users, HelpCircle, Mail, 
  Info, MessageSquare, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../logo/logo';
import ThemeToggle from '../Theme/Toogle';

const staticUser = {
  name: 'Sojibur Rahman Asif',
  shortName: 'Asif',
  role: 'Shop Owner',
  email: 'asif@shopflow.local',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Asif',
  isLoggedIn: true,
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuresItems = [
    { title: 'Billing System', icon: Zap },
    { title: 'Inventory Control', icon: Layers },
    { title: 'Profit Analytics', icon: ShieldCheck },
    { title: 'Staff Management', icon: Users },
  ];

  const resourcesItems = [
    { title: 'FAQ', icon: HelpCircle },
    { title: 'Contact Support', icon: Mail },
    { title: 'Documentation', icon: Info },
    { title: 'Live Chat', icon: MessageSquare },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-black/95 backdrop-blur-md border-b border-zinc-200 dark:border-purple-900/20 py-2 shadow-md'
          : 'bg-transparent py-5'
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo Section */}
        <div className="flex items-center gap-5">
          <Link href="/" className="shrink-0"><Logo /></Link>

          {/* Root Level Dashboard Link (Desktop) */}
          {staticUser.isLoggedIn && (
            <>
              <div className="hidden lg:block h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
              <Link
                href="/dashboard"
                className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:opacity-80 transition-all"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            </>
          )}
        </div>

        {/* 6 Main Links for Desktop - Clean Default Style */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link>
          
          <Link href="/about" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About</Link>

          {/* Features Dropdown */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('features')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-1">
              Features <ChevronDown size={14} className={activeDropdown === 'features' ? 'rotate-180' : ''} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'features' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-black border border-zinc-200 dark:border-purple-900/30 rounded-xl p-3 shadow-xl">
                  {featuresItems.map((item, i) => (
                    <Link key={i} href="#" className="flex items-center gap-3 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg group">
                      <item.icon className="text-purple-500" size={16} />
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{item.title}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/pricing" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Pricing</Link>

          {/* Resources Dropdown */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('resources')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-1">
              Resources <ChevronDown size={14} className={activeDropdown === 'resources' ? 'rotate-180' : ''} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'resources' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-black border border-zinc-200 dark:border-purple-900/30 rounded-xl p-3 shadow-xl">
                  {resourcesItems.map((item, i) => (
                    <Link key={i} href="#" className="flex items-center gap-3 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg group">
                      <item.icon className="text-purple-500" size={16} />
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{item.title}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/contact" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</Link>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button className="relative p-2 text-zinc-500 hover:text-purple-500 transition-all">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-600 rounded-full border border-white dark:border-black"></span>
          </button>

          {staticUser.isLoggedIn ? (
            /* User Profile Section - Medium Standard Size */
            <div className="relative ml-1" onMouseEnter={() => setActiveDropdown('profile')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-3 pl-1 pr-3 py-1 border border-zinc-200 dark:border-purple-900/30 rounded-full bg-zinc-50 dark:bg-zinc-900/50 hover:border-purple-500 transition-all">
                <img src={staticUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white leading-none">{staticUser.shortName}</p>
                  <p className="text-[9px] text-purple-600 dark:text-purple-400 font-bold uppercase mt-1">{staticUser.role}</p>
                </div>
                <ChevronDown size={14} className="text-zinc-400" />
              </button>

              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-black border border-zinc-200 dark:border-purple-900/30 rounded-2xl p-2 shadow-2xl z-[110]">
                    <div className="px-3 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{staticUser.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{staticUser.email}</p>
                    </div>
                    <div className="p-1 space-y-1">
                      <Link href="/dashboard" className="flex items-center gap-2.5 p-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg">
                        <LayoutDashboard size={14} /> My Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center gap-2.5 p-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg">
                        <User size={14} /> Profile
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2.5 p-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg">
                        <Settings size={14} /> Settings
                      </Link>
                      <button className="w-full flex items-center gap-2.5 p-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
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

          {/* Mobile Menu Toggle */}
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
            <Link href="/" className="text-sm font-semibold">Home</Link>
            {staticUser.isLoggedIn && <Link href="/dashboard" className="text-sm font-semibold text-purple-600">Dashboard</Link>}
            <Link href="/about" className="text-sm font-semibold">About</Link>
            <Link href="/features" className="text-sm font-semibold">Features</Link>
            <Link href="/pricing" className="text-sm font-semibold">Pricing</Link>
            <Link href="/contact" className="text-sm font-semibold">Contact</Link>
            <hr className="dark:border-zinc-800" />
            <button className="text-sm font-bold text-red-500 text-left">Logout System</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}