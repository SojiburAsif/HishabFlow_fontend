import HeroSection from "@/components/static/Hero";
import QuickHighlights from "@/components/static/QuickHighlights";
import Subscription from "@/components/static/subscription";

import TrustedByStatic from "@/components/static/TrustedByStatic";
import ExtendedFeatures from "@/components/static/ExtendedFeatures";
import TestimonialsStatic from "@/components/static/TestimonialsStatic";
import FinalCtaStatic from "@/components/static/FinalCtaStatic";

export default function Home() {
  return (
    <main className="bg-zinc-50 text-zinc-950 dark:bg-black dark:text-white">
      <HeroSection />
      <Subscription />
      <QuickHighlights />

      {/* Added static components (no removals) */}
      <TrustedByStatic />
      <ExtendedFeatures />
      <TestimonialsStatic />
      <FinalCtaStatic />
    </main>
  );
}
