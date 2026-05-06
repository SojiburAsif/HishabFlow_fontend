"use client";

import Link from "next/link";
import { MoveLeft, Ghost, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#FAFAFA] via-[#F3E8FF] to-[#A855F7] dark:from-[#050505] dark:via-[#130624] dark:to-[#050505] text-gray-900 dark:text-white font-sans selection:bg-purple-500 flex flex-col items-center justify-center p-6 text-center">
      
      {/* --- Background Watermark: Billing Symbols --- */}
      <div className="absolute -bottom-10 -right-10 text-[250px] md:text-[450px] font-bold text-purple-900/10 dark:text-purple-500/5 leading-none select-none pointer-events-none transform rotate-12">
        ৳
      </div>
      <div className="absolute top-0 -left-10 text-[200px] md:text-[350px] font-bold text-purple-900/5 dark:text-purple-500/5 leading-none select-none pointer-events-none transform -rotate-12">
        $
      </div>

      {/* --- Main Content --- */}
      <div className="z-10 flex flex-col items-center">
        
        {/* Animated Icon Section */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="text-purple-600/20 dark:text-purple-400/10">
            <CircleDollarSign size={200} strokeWidth={0.5} />
          </div>
          <div className="absolute text-purple-600 dark:text-purple-400 animate-bounce transition-all duration-1000">
            <Ghost size={90} strokeWidth={1.2} />
          </div>
        </div>

        {/* 404 Header */}
        <div className="space-y-3">
          <h1 className="text-9xl font-black tracking-tighter text-zinc-900 dark:text-white drop-shadow-2xl">
            4<span className="text-purple-600 dark:text-purple-500">0</span>4
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Transaction Lost?
          </h2>
          
          <p className="max-w-125 text-base md:text-lg text-zinc-600 dark:text-zinc-400 mx-auto font-medium leading-relaxed">
            We couldn{"'"}t find the receipt or page you are looking for. It might have been voided or moved to another ledger.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-5">
          <Button 
            asChild 
            size="lg" 
            className="bg-zinc-900 dark:bg-purple-600 hover:bg-zinc-800 dark:hover:bg-purple-500 text-white rounded-2xl px-12 h-14 font-bold shadow-2xl shadow-purple-900/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/">
              Go to Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="rounded-2xl px-12 h-14 border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md font-bold transition-all hover:bg-white dark:hover:bg-zinc-900 group hover:scale-105 active:scale-95"
          >
            <MoveLeft className="mr-3 size-5 group-hover:-translate-x-2 transition-transform" />
            Previous Page
          </Button>
        </div>
      </div>

    </div>
  );
}