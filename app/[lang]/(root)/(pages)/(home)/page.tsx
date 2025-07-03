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
      <div className="bg-orange-50">
        <HeroSection lang={lang} />
      </div>
      <FeatureSection />
      <div className="bg-orange-50">
        <PhilosophySection />
      </div>
      <PricingSection lang={lang} />
      <CtaSection lang={lang} />
    </>
  );
}
