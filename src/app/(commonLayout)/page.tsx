import HeroSection from "@/components/static/Hero";
import QuickHighlights from "@/components/static/QuickHighlights";

import Subscription from "@/components/static/subscription";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Subscription />
      <QuickHighlights />
    </main>
  );
}
