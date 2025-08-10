// app/[lang]/(root)/(pages)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  // NutritionDashboard,
  SummaryCard,
  // AICoachCard,
  // WaterTrackerCard,
} from "@/components/dashboard";
import { Locale } from "@/i18n.config";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  console.log(lang);

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

  if (profile.current_weight_kg === null) {
    redirect("/settings");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // --- ЗАВАНТАЖУЄМО ВСІ СЬОГОДНІШНІ ДАНІ ---
  // const [foodEntriesResult, activityEntriesResult, userRecipesResult] =
  await Promise.all([
    (await supabase)
      .from("food_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString()),
    (await supabase)
      .from("activity_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString()),
    (await supabase).from("user_recipes").select("*").eq("user_id", user.id),
  ]);

  // const foodEntries = foodEntriesResult.data;
  // const activityEntries = activityEntriesResult.data;
  // const userRecipes = userRecipesResult.data || [];

  // --- РОЗРАХОВУЄМО ПІДСУМКИ СПОЖИТОГО/СПАЛЕНОГО ---
  // const consumedCalories =
  //   foodEntries?.reduce((sum, entry) => sum + (entry.calories || 0), 0) || 0;
  // const consumedProtein =
  //   foodEntries?.reduce((sum, entry) => sum + (entry.protein_g || 0), 0) || 0;
  // const consumedFat =
  //   foodEntries?.reduce((sum, entry) => sum + (entry.fat_g || 0), 0) || 0;
  // const consumedCarbs =
  //   foodEntries?.reduce((sum, entry) => sum + (entry.carbs_g || 0), 0) || 0;
  // const consumedSugar =
  //   foodEntries?.reduce((sum, entry) => sum + (entry.sugar_g || 0), 0) || 0;
  // const totalWater =
  //   foodEntries?.reduce((sum, entry) => sum + (entry.water_ml || 0), 0) || 0;
  // const burnedCalories =
  //   activityEntries?.reduce(
  //     (sum, entry) => sum + (entry.calories_burned || 0),
  //     0
  //   ) || 0;

  // --- РОЗРАХУНОК ДИНАМІЧНИХ ЦІЛЕЙ (НОВА ЛОГІКА) ---
  // 1. Беремо базові цілі з профілю
  // const baseTargetCalories = profile.target_calories || 2000;
  // const baseTargetProtein = profile.target_protein_g || 120;
  // const baseTargetCarbs = profile.target_carbs_g || 250;
  // const baseTargetFat = profile.target_fat_g || 70;
  // const baseTargetSugar = profile.target_sugar_g || 30;

  // 2. Розраховуємо нову ціль по калоріях
  // const adjustedTargetCalories = baseTargetCalories + burnedCalories;

  // // 3. Визначаємо процентний розподіл БЖВ на основі БАЗОВИХ цілей
  // const proteinPercentage = (baseTargetProtein * 4) / baseTargetCalories;
  // const carbsPercentage = (baseTargetCarbs * 4) / baseTargetCalories;
  // const fatPercentage = (baseTargetFat * 9) / baseTargetCalories;

  // 4. Розраховуємо нові цілі по БЖВ на основі нової цілі по калоріях
  // const adjustedTargetProtein = Math.round(
  //   (adjustedTargetCalories * proteinPercentage) / 4
  // );
  // const adjustedTargetCarbs = Math.round(
  //   (adjustedTargetCalories * carbsPercentage) / 4
  // );
  // const adjustedTargetFat = Math.round(
  //   (adjustedTargetCalories * fatPercentage) / 9
  // );

  // 5. Готуємо фінальний об'єкт з ДИНАМІЧНИМИ цілями
  // const summaryData = {
  //   calories: {
  //     consumed: consumedCalories,
  //     burned: burnedCalories,
  //     target: adjustedTargetCalories, // <-- Використовуємо нову ціль
  //   },
  //   macros: {
  //     protein: { current: consumedProtein, target: adjustedTargetProtein }, // <-- Нова ціль
  //     fat: { current: consumedFat, target: adjustedTargetFat }, // <-- Нова ціль
  //     carbs: { current: consumedCarbs, target: adjustedTargetCarbs }, // <-- Нова ціль
  //     sugar: { current: consumedSugar, target: baseTargetSugar },
  //   },
  // };

  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 lg:order-2">
          {/* <NutritionDashboard
            summaryData={summaryData}
            foodLogData={
              foodEntries?.filter((e) => e.meal_type !== "water") || []
            }
            userRecipes={userRecipes}
          /> */}
        </div>
        <div className="lg:col-span-1 space-y-6 lg:order-1">
          <SummaryCard currentWeight={profile.current_weight_kg} />
          {/* <WaterTrackerCard
            currentWater={totalWater}
            targetWater={profile.target_water_ml || 2500}
            key={totalWater}
          /> */}
          {/* <AICoachCard activityLogData={activityEntries || []} /> */}
        </div>
      </div>
    </div>
  );
}
