'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Products',
      href: '/dashboard/products',
      icon: <Package className="w-5 h-5" />,
    },
    {
      label: 'Orders',
      href: '/dashboard/orders',
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      label: 'Payments',
      href: '/dashboard/payments',
      icon: <CreditCard className="w-5 h-5" />,
      badge: 3,
    },
    {
      label: 'Staff',
      href: '/dashboard/staff',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                ShopFlow
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                v1.0
              </span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="hidden md:flex"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer relative group ${
                  active
                    ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-purple-600 text-white rounded-full ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapsed Toggle for Desktop */}
      {isCollapsed && (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="w-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
          <p className="mb-2">Need help?</p>
          <Link
            href="/help"
            className="flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Support
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: isCollapsed ? 80 : 260 }}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen bg-white dark:bg-[#050505] border-r border-zinc-200 dark:border-zinc-800 z-40"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#050505] z-40 md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                    ShopFlow
                  </span>
                </div>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          active
                            ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="flex-1 text-sm font-medium">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-purple-600 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <Button
        isIconOnly
        variant="ghost"
        size="lg"
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-6 right-6 md:hidden bg-purple-600 text-white hover:bg-purple-700 z-20"
      >
        <Menu className="w-6 h-6" />
      </Button>
    </>
  );
};

export default Sidebar;
