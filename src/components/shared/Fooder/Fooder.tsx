"use client";

import React from 'react';
import { Mail, MapPin, Phone, Send, ArrowUpRight } from 'lucide-react';
import Logo from '../logo/logo';
import Link from 'next/link';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Fooder() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-zinc-200 bg-white py-20 text-zinc-600 transition-colors duration-300 dark:border-purple-900/20 dark:bg-[#050505] dark:text-zinc-400">

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-20 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-8">
            <Logo />
            <p className="max-w-xs text-[14px] font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
              Automate your shop&rsquo;s billing, inventory, and analytics with the world&rsquo;s most advanced SaaS platform for retailers.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <FacebookIcon />, href: "#" },
                { icon: <TwitterIcon />, href: "#" },
                { icon: <InstagramIcon />, href: "#" },
                { icon: <LinkedinIcon />, href: "#" }
              ].map((social, idx) => (
                <Link 
                  key={idx} 
                  href={social.href} 
                  className="rounded-2xl border border-zinc-200 bg-zinc-100 p-3 transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5 hover:text-purple-600 dark:border-white/5 dark:bg-zinc-900/50 dark:hover:text-purple-400 dark:hover:bg-purple-500/5"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[12px] font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-white">Product</h3>
            <ul className="space-y-4 text-[13px] font-bold">
              {['Billing System', 'Inventory Tracking', 'Staff Reports', 'Profit Analytics'].map((item) => (
                <li key={item}>
                  <Link href="#" className="flex items-center gap-1 transition-colors hover:text-purple-600 dark:hover:text-purple-400 group">
                    {item} <ArrowUpRight size={14} className="opacity-0 transition-all -translate-y-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[12px] font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-white">Company</h3>
            <ul className="space-y-4 text-[13px] font-bold">
              {['About ShopFlow', 'Global Pricing', 'Privacy Shield', 'Service Terms'].map((item) => (
                <li key={item}>
                  <Link href="#" className="flex items-center gap-1 transition-colors hover:text-purple-600 dark:hover:text-purple-400 group">
                    {item} <ArrowUpRight size={14} className="opacity-0 transition-all -translate-y-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[12px] font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-white">Stay Updated</h3>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-5 py-4 text-xs font-bold text-zinc-900 outline-none transition-all focus:border-purple-500/50 dark:border-white/5 dark:bg-zinc-900/50 dark:text-white dark:focus:border-purple-500/50"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-purple-600 p-2.5 text-white transition-all hover:bg-purple-500">
                <Send size={16} />
              </button>
            </div>
            
            <ul className="space-y-4 pt-2">
               <li className="flex items-center gap-3 text-[13px] font-bold transition-colors hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <Mail size={16} className="text-purple-600 dark:text-purple-500" />
                  <span>support@shopflow.io</span>
               </li>
               <li className="flex items-center gap-3 text-[13px] font-bold transition-colors hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <Phone size={16} className="text-purple-600 dark:text-purple-500" />
                  <span>+880 1700-000000</span>
               </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-zinc-200 pt-10 dark:border-white/5 md:flex-row">
          <div className="flex flex-col items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 md:flex-row md:gap-8">
            <p>© {currentYear} <span className="text-purple-600 dark:text-purple-400">ShopFlow Inc.</span></p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Status</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Security</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 dark:border-white/5 dark:bg-zinc-900/50">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">All Systems Operational</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}