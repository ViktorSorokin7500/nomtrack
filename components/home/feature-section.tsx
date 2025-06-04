import React from "react";
import { FeatureCard } from "./feature-card";

const features = [
  {
    title: "Track Calories & Macros",
    description:
      "Automatically log and analyze your daily intake of proteins, fats, and carbs.",
    iconColor: "bg-orange-200",
    iconTextColor: "text-orange-400",
    iconPath:
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "AI-Powered Meal Suggestions",
    description:
      "Let our smart assistant generate meals based on your goals, dietary preferences, and available ingredients.",
    iconColor: "bg-green-200",
    iconTextColor: "text-green-400",
    iconPath:
      "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    title: "Visualize Your Progress",
    description:
      "Clear graphs show how your diet evolves and where adjustments are needed.",
    iconColor: "bg-yellow-200",
    iconTextColor: "text-yellow-600",
    iconPath:
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Set Goals & Stay Motivated",
    description:
      "Whether you're aiming to lose weight, gain muscle, or just eat healthier, NutriFlow keeps you on track.",
    iconColor: "bg-orange-200",
    iconTextColor: "text-orange-400",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Scan Barcodes & Use Voice Input",
    description: "Log your meals in seconds with smart input tools.",
    iconColor: "bg-green-200",
    iconTextColor: "text-green-400",
    iconPath:
      "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Sync Across Devices",
    description: "Your data stays with you — mobile, tablet, or desktop.",
    iconColor: "bg-yellow-200",
    iconTextColor: "text-yellow-600",
    iconPath:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

export function FeatureSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          ✨ What You Can Do
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
          NutriFlow combines powerful tracking with AI assistance to help you
          reach your nutrition goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
              iconTextColor={feature.iconTextColor}
              iconPath={feature.iconPath}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
