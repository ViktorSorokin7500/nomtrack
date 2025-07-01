// app/dashboard/page.tsx
import {
  AICoachCard,
  NutritionDashboard,
  SummaryCard,
} from "@/components/dashboard";
import { Locale } from "@/i18n.config";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }
  const { lang } = await params;

  // Хардкод даних для рефакторинга
  const summaryData = {
    calories: { current: 1450, target: 1800 },
    macros: {
      protein: { current: 85, target: 120 },
      carbs: { current: 145, target: 180 },
      fat: { current: 45, target: 60 },
    },
    weightTracker: {
      currentWeight: 107.3,
      weightDifference: -2.7,
      startDate: "14.06.2025",
      history: [
        { date: "16.06.2025", weight: 107.3, change: -0.2 },
        { date: "15.06.2025", weight: 107.5, change: -0.3 },
        { date: "14.06.2025", weight: 107.8, change: -0.2 },
      ],
    },
  };

  const foodLogData = [
    {
      name: "Breakfast",
      calories: 420,
      foods: [
        {
          name: "Greek Yogurt with Berries",
          description: "200g yogurt, 100g mixed berries",
          calories: 220,
          macros: { protein: 18, carbs: 24, fat: 8 },
          icon: "🥣",
          iconBg: "bg-orange-200",
        },
        {
          name: "Coffee with Oat Milk",
          description: "300ml, 1 tsp honey",
          calories: 80,
          macros: { protein: 1, carbs: 12, fat: 3 },
          icon: "☕",
          iconBg: "bg-green-200",
        },
        {
          name: "Apple",
          description: "1 medium",
          calories: 120,
          macros: { protein: 0, carbs: 25, fat: 0 },
          icon: "🍎",
          iconBg: "bg-yellow-200",
        },
      ],
    },
    {
      name: "Lunch",
      calories: 630,
      foods: [
        {
          name: "Quinoa Salad Bowl",
          description: "Quinoa, avocado, chickpeas, mixed greens",
          calories: 450,
          macros: { protein: 15, carbs: 55, fat: 18 },
          icon: "🥗",
          iconBg: "bg-green-200",
        },
        {
          name: "Green Smoothie",
          description: "Spinach, banana, almond milk",
          calories: 180,
          macros: { protein: 4, carbs: 30, fat: 5 },
          icon: "🥤",
          iconBg: "bg-yellow-200",
        },
      ],
    },
    {
      name: "Dinner",
      calories: 400,
      foods: [],
      isPlanned: true,
    },
  ];

  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <SummaryCard
            calories={summaryData.calories}
            macros={summaryData.macros}
            weightTracker={summaryData.weightTracker}
          />
          <AICoachCard foodLogData={foodLogData} />
        </div>
        <div className="lg:col-span-2">
          <NutritionDashboard
            summaryData={summaryData}
            foodLogData={foodLogData}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
