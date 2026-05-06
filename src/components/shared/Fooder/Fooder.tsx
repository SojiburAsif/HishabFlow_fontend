"use client";

import React from 'react';
import { Mail, MapPin, Phone, Send, ArrowUpRight } from 'lucide-react';
import Logo from '../logo/logo';
import Link from 'next/link';

// ব্র্যান্ড আইকনগুলোর জন্য কাস্টম SVG (বিল্ড এরর এড়াতে)
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
    <footer className="bg-[#050505] text-zinc-400 py-20 border-t border-purple-900/20 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-8">
            <Logo />
            <p className="text-[14px] leading-relaxed font-medium text-zinc-500 max-w-xs">
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
                  className="p-3 bg-zinc-900/50 border border-white/5 rounded-2xl hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white text-[12px] font-black uppercase tracking-[0.25em]">Product</h3>
            <ul className="space-y-4 text-[13px] font-bold">
              {['Billing System', 'Inventory Tracking', 'Staff Reports', 'Profit Analytics'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-1 group">
                    {item} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white text-[12px] font-black uppercase tracking-[0.25em]">Company</h3>
            <ul className="space-y-4 text-[13px] font-bold">
              {['About ShopFlow', 'Global Pricing', 'Privacy Shield', 'Service Terms'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-1 group">
                    {item} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white text-[12px] font-black uppercase tracking-[0.25em]">Stay Updated</h3>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none focus:border-purple-500/50 transition-all text-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all">
                <Send size={16} />
              </button>
            </div>
            
            <ul className="space-y-4 pt-2">
               <li className="flex items-center gap-3 text-[13px] font-bold hover:text-white transition-colors cursor-pointer">
                  <Mail size={16} className="text-purple-500" />
                  <span>support@shopflow.io</span>
               </li>
               <li className="flex items-center gap-3 text-[13px] font-bold hover:text-white transition-colors cursor-pointer">
                  <Phone size={16} className="text-purple-500" />
                  <span>+880 1700-000000</span>
               </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">
            <p>© {currentYear} <span className="text-purple-600/80">ShopFlow Inc.</span></p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-zinc-300">System Status</Link>
              <Link href="#" className="hover:text-zinc-300">Security</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">All Systems Operational</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}