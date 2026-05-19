'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
} from '@heroui/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): Breadcrumb[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Dashboard', href: '/dashboard' },
    ];

    let path = '';
    for (let i = 1; i < segments.length; i++) {
        const segment = segments[i];
        path += '/' + segment;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ label, href: i < segments.length - 1 ? path : undefined });
    }
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };

  return (
    <header
      className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#050505]/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 transition-all duration-200"
      style={{
        marginLeft: 'var(--sidebar-width, 260px)',
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6 gap-4">
        {/* Left: Breadcrumb */}
        <div className="flex-1 min-w-0">
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="text-zinc-400 dark:text-zinc-600">/</span>
                )}
                {breadcrumb.href ? (
                  <Link
                    href={breadcrumb.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap"
                  >
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {breadcrumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search Input - Hidden on mobile */}
          <div className="hidden sm:flex items-center">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Theme Toggle */}
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Notifications */}
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <Badge content="5" color="accent" size="sm">
                <Bell className="h-5 w-5" />
              </Badge>
            </Button>

            {/* User Profile */}
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-semibold text-white ring-2 ring-accent">
                    JH
                  </div>
                  <div className="hidden md:flex flex-col items-start mr-1">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Jason Hughes</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Admin</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions">
                <DropdownItem key="profile">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    My Profile
                  </span>
                </DropdownItem>
                <DropdownItem key="settings">
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </span>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  onClick={handleLogout}
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
