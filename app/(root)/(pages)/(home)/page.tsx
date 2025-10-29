import {
  CtaSection,
  FeatureSection,
  HeroSection,
  PhilosophySection,
  PricingSection,
} from "@/components/home";
export const dynamic = "force-static";
export const revalidate = 0;

export default async function Home() {
  return (
    <>
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
