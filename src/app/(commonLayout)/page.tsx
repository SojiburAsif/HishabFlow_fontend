import HeroSection from "@/components/static/Hero";
import QuickHighlights from "@/components/static/QuickHighlights";

import Subscription from "@/components/static/subscription";

export default function Home() {
  return (
    <main className="bg-zinc-50 text-zinc-950 dark:bg-black dark:text-white">
      <HeroSection />
      <Subscription />
      <QuickHighlights />
    </main>
  );
}
