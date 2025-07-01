import {
  CtaSection,
  FeatureSection,
  HeroSection,
  PhilosophySection,
  PricingSection,
} from "@/components/home";
import { Locale } from "@/i18n.config";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

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
