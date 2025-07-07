import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  NutritionDashboard,
  SummaryCard,
  AICoachCard,
  WaterTrackerCard,
} from "@/components/dashboard";
import { Locale } from "@/i18n.config";

export default async function Dashboard({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = await params;
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await (await supabase)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/settings");
  }

  // Надійний фільтр по даті
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // --- ЗАВАНТАЖУЄМО ВСІ НЕОБХІДНІ ДАНІ ---

  // 1. Записи про їжу та воду
  const { data: foodEntries } = await (await supabase)
    .from("food_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString())
    .lt("created_at", tomorrow.toISOString());

  // 2. Повертаємо записи про активності
  const { data: activityEntries } = await (await supabase)
    .from("activity_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString())
    .lt("created_at", tomorrow.toISOString());

  // --- РОЗРАХОВУЄМО ПІДСУМКИ ---

  const totalWater =
    foodEntries?.reduce((sum, entry) => sum + (entry.water_ml || 0), 0) || 0;
  const consumedCalories =
    foodEntries?.reduce((sum, entry) => sum + (entry.calories || 0), 0) || 0;
  const consumedProtein =
    foodEntries?.reduce((sum, entry) => sum + (entry.protein_g || 0), 0) || 0;
  const consumedFat =
    foodEntries?.reduce((sum, entry) => sum + (entry.fat_g || 0), 0) || 0;
  const consumedCarbs =
    foodEntries?.reduce((sum, entry) => sum + (entry.carbs_g || 0), 0) || 0;

  // Розраховуємо спалені калорії
  const burnedCalories =
    activityEntries?.reduce(
      (sum, entry) => sum + (entry.calories_burned || 0),
      0
    ) || 0;

  // Готуємо об'єкт з даними для передачі в компоненти
  const summaryData = {
    calories: {
      consumed: consumedCalories,
      burned: burnedCalories, // Тепер тут реальне значення
      target: profile.target_calories || 2000,
    },
    macros: {
      protein: {
        current: consumedProtein,
        target: profile.target_protein_g || 120,
      },
      fat: { current: consumedFat, target: profile.target_fat_g || 70 },
      carbs: { current: consumedCarbs, target: profile.target_carbs_g || 250 },
    },
  };

  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Передаємо лише ті дані, які потрібні кожному компоненту */}
          <SummaryCard currentWeight={profile.current_weight_kg} />
          <WaterTrackerCard
            key={totalWater}
            currentWater={totalWater}
            targetWater={profile.target_water_ml || 2500}
          />
          <AICoachCard />
        </div>
        <div className="lg:col-span-2">
          <NutritionDashboard
            summaryData={summaryData}
            foodLogData={
              foodEntries?.filter((e) => e.meal_type !== "water") || []
            }
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
