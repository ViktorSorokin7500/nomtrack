import {
  CtaSection,
  FeatureSection,
  HeroSection,
  PhilosophySection,
  PricingSection,
} from "@/components/home";
import { Locale } from "@/i18n.config";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
// import SplashCursor from "@/components/ui/splash-cursor";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (user) {
    redirect(`/${lang}/dashboard`);
  }

  return (
    <>
      {/* <SplashCursor /> */}
      <div className="bg-orange-50">
        <HeroSection lang={lang} />
      </div>
      <CtaSection lang={lang} />
      <FeatureSection />
      <PhilosophySection />
      <div className="bg-orange-50">
        <PricingSection />
      </div>
    </>
  );
}
