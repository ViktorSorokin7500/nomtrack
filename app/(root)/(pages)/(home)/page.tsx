import {
  CtaSection,
  FeatureSection,
  HeroSection,
  PhilosophySection,
  PricingSection,
} from "@/components/home";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (user) {
    redirect("dashboard");
  }

  return (
    <>
      {/* <SplashCursor /> */}
      <div className="bg-orange-50">
        <HeroSection />
      </div>
      <CtaSection />
      <FeatureSection />
      <PhilosophySection />
      <div className="bg-orange-50">
        <PricingSection />
      </div>
    </>
  );
}
