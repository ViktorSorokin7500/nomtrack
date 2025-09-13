// app/[lang]/(root)/(pages)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  // NutritionDashboard,
  // SummaryCard,
  AICoachCard,
  // WaterTrackerCard,
  DashboardSkeleton,
} from "@/components/dashboard";
import { Locale } from "@/i18n.config";
import { DbSavedWorkout, WorkoutPlan } from "@/types";
import { Suspense } from "react";

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
  const [
    foodEntriesResult,
    activityEntriesResult,
    userRecipesResult,
    savedWorkoutsResult,
  ] = await Promise.all([
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
    (await supabase)
      .from("user_workouts")
      .select("id, workout_name, estimated_calories_burned")
      .eq("user_id", user.id),
  ]);

  const foodEntries = foodEntriesResult.data;
  const activityEntries = activityEntriesResult.data;
  const userRecipes = userRecipesResult.data || [];
  const savedWorkouts = savedWorkoutsResult.data || [];

  console.log(foodEntries, userRecipes);

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

  // 3. Визначаємо процентний розподіл БЖВ на основі БАЗОВИХ цілей
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

  const { data: latestPlan } = await (await supabase)
    .from("workout_plans")
    .select("plan_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const workoutPlan = latestPlan?.plan_data;

  const todayDayIndex = new Date().getDay();
  const daysOfWeek = [
    "Неділя",
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "П'ятниця",
    "Субота",
  ];
  const todayDayName = daysOfWeek[todayDayIndex]; // Додаткова перевірка, яка усуне помилку

  const todaysWorkout = workoutPlan?.daily_plans.find(
    (day: WorkoutPlan["daily_plans"][0]) =>
      day.day === todayDayName && day.estimated_calories_burned > 0
  );

  return (
    <Suspense fallback={<DashboardSkeleton />}>
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
            {/* <SummaryCard currentWeight={profile.current_weight_kg} /> */}
            {/* <WaterTrackerCard
              currentWater={totalWater}
              targetWater={profile.target_water_ml || 2500}
            /> */}
            <AICoachCard
              activityLogData={activityEntries || []}
              todaysWorkout={todaysWorkout}
              savedWorkouts={savedWorkouts as DbSavedWorkout[]}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
