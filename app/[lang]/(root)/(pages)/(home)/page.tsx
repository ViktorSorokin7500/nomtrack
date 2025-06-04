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

// Analyze the list of food and drinks for calories and macronutrients (proteins, fats, carbohydrates). Respond in JSON format as follows:
// {
//   "cal": number,
//   "protein": number,
//   "carbs": number,
//   "fat": number,
//   "dish": string // a short description of the food list provided (in the same language as the original list, without weights, just a list of items)
// } Here is the list: ""
