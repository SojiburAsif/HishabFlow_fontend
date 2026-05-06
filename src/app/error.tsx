"use client";

import { useEffect } from "react";
import { ReceiptText, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#FAFAFA] via-[#F3E8FF] to-[#A855F7] dark:from-[#050505] dark:via-[#1a0a2e] dark:to-[#050505] p-6 text-gray-900 dark:text-white font-sans selection:bg-purple-500">
      
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] md:text-[400px] font-black text-purple-900/5 dark:text-purple-500/5 select-none pointer-events-none uppercase">
        Error
      </div>

      {/* Error Card */}
      <div className="max-w-md w-full bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/20 dark:border-white/5 shadow-2xl text-center space-y-8 relative z-10">
        
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-12">
          <ReceiptText size={48} className="animate-pulse" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            System <span className="text-purple-600 uppercase">Glitch</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 leading-relaxed">
            We encountered a problem processing your request. Don{"'"}t worry, your data is safe. Let{"'"}s try to re-sync.
          </p>
        </div>

        {/* Error Message Snippet */}
        <div className="bg-zinc-900/5 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-100/50 dark:border-purple-900/30">
          <p className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 wrap-break-word text-left line-clamp-2">
            ID: {error.digest || "ERR_BILL_PROC_FAILED"} <br />
            Message: {error.message || "Unknown processing error"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-2">
          <Button 
            onClick={() => reset()} 
            className="h-14 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            <RefreshCcw size={20} />
            Try to Re-process
          </Button>
          
          <Link href="/" className="w-full">
            <Button 
              variant="outline" 
              className="w-full h-14 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-800 text-slate-900 dark:text-white font-black uppercase tracking-widest rounded-2xl transition-all"
            >
              <Home size={20} className="mr-2" />
              Back to POS
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}