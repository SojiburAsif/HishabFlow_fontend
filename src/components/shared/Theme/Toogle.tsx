"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white transition-all hover:bg-zinc-50 dark:border-purple-900/30 dark:bg-zinc-950 dark:hover:bg-zinc-900 shadow-sm overflow-hidden"
      aria-label="Toggle Theme"
    >
      <motion.div 
        initial={false}
        animate={{ rotate: isDark ? 0 : 90, scale: isDark ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-purple-500 fill-purple-500/20" />
      </motion.div>

      <motion.div 
        initial={false}
        animate={{ rotate: isDark ? -90 : 0, scale: isDark ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-amber-500 fill-amber-500/20" />
      </motion.div>

      {/* Hover Glow */}
      <span className="absolute inset-0 rounded-xl bg-purple-500/0 transition-colors group-hover:bg-purple-500/5 dark:group-hover:bg-purple-500/10" />
    </button>
  );
}