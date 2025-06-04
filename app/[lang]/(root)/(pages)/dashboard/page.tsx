// app/dashboard/page.tsx
import {
  AICoachCard,
  NutritionDashboard,
  SummaryCard,
} from "@/components/dashboard";
import { Locale } from "@/i18n.config";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  console.log(params);

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
      startDate: "17.05.2025",
      history: [
        { date: "28.05.2025", weight: 107.3, change: -0.2 },
        { date: "27.05.2025", weight: 107.5, change: -0.3 },
        { date: "26.05.2025", weight: 107.8, change: -0.2 },
        { date: "25.05.2025", weight: 108.0, change: -0.2 },
        { date: "24.05.2025", weight: 108.2, change: -0.3 },
        { date: "23.05.2025", weight: 108.5, change: -0.2 },
        { date: "22.05.2025", weight: 108.7, change: -0.3 },
        { date: "21.05.2025", weight: 109.0, change: -0.2 },
        { date: "20.05.2025", weight: 109.2, change: -0.3 },
        { date: "19.05.2025", weight: 109.5, change: -0.3 },
        { date: "18.05.2025", weight: 109.8, change: -0.2 },
        { date: "17.05.2025", weight: 110.0, change: 0 },
      ],
    },
  };

  const aiMessages = [
    {
      id: "1",
      text: "Based on your recent protein intake, I recommend adding more lean protein sources to your lunch. This will help support your muscle gain goals.",
    },
    {
      id: "2",
      text: "Your water intake is below target today. Try to drink at least 500ml more before dinner.",
    },
  ];

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
    <div className="bg-orange-50 p-8 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <SummaryCard
            calories={summaryData.calories}
            macros={summaryData.macros}
            weightTracker={summaryData.weightTracker}
          />
          <AICoachCard messages={aiMessages} />
        </div>
        <div className="lg:col-span-2">
          <NutritionDashboard
            summaryData={summaryData}
            foodLogData={foodLogData}
            aiMessages={aiMessages}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
