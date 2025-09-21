import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  NutritionDashboard,
  AICoachCard,
  WaterTrackerCard,
  SummaryCard,
} from "@/components/dashboard";
import { DbSavedWorkout, WorkoutPlan } from "@/types";
import { Suspense } from "react";
import {
  NutritionSkeleton,
  SummarySkeleton,
  WaterSkeleton,
  AiCoachSkeleton,
} from "@/components/skeletons";

export default async function Dashboard() {
  const supabase = await createClient();

  // 1) Користувач
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/sign-in");

  // 2) Діапазон дат для "сьогодні"
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 3) ВСІ запити паралельно
  const [
    { data: profile },
    foodEntriesResult,
    activityEntriesResult,
    userRecipesResult,
    savedWorkoutsResult,
    { data: latestPlan },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("food_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString()),
    supabase
      .from("activity_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString()),
    supabase.from("user_recipes").select("*").eq("user_id", user.id),
    supabase
      .from("user_workouts")
      .select("id, workout_name, estimated_calories_burned")
      .eq("user_id", user.id),
    supabase
      .from("workout_plans")
      .select("plan_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  // Перевірка профілю (безпечна для TS)
  if (!profile || profile.current_weight_kg == null) {
    redirect("/settings");
  }
  const foodEntries = foodEntriesResult.data;
  const activityEntries = activityEntriesResult.data;
  const userRecipes = userRecipesResult.data || [];
  const savedWorkouts = savedWorkoutsResult.data || [];

  const consumedCalories =
    foodEntries?.reduce((sum, entry) => sum + (entry.calories || 0), 0) || 0;
  const consumedProtein =
    foodEntries?.reduce((sum, entry) => sum + (entry.protein_g || 0), 0) || 0;
  const consumedFat =
    foodEntries?.reduce((sum, entry) => sum + (entry.fat_g || 0), 0) || 0;
  const consumedCarbs =
    foodEntries?.reduce((sum, entry) => sum + (entry.carbs_g || 0), 0) || 0;
  const consumedSugar =
    foodEntries?.reduce((sum, entry) => sum + (entry.sugar_g || 0), 0) || 0;
  const totalWater =
    foodEntries?.reduce((sum, entry) => sum + (entry.water_ml || 0), 0) || 0;
  const burnedCalories =
    activityEntries?.reduce(
      (sum, entry) => sum + (entry.calories_burned || 0),
      0
    ) || 0;

  const baseTargetCalories = profile.target_calories || 2000;
  const baseTargetProtein = profile.target_protein_g || 120;
  const baseTargetCarbs = profile.target_carbs_g || 250;
  const baseTargetFat = profile.target_fat_g || 70;
  const baseTargetSugar = profile.target_sugar_g || 30;

  const adjustedTargetCalories = baseTargetCalories + burnedCalories;
  const proteinPercentage = (baseTargetProtein * 4) / baseTargetCalories;
  const carbsPercentage = (baseTargetCarbs * 4) / baseTargetCalories;
  const fatPercentage = (baseTargetFat * 9) / baseTargetCalories;

  const adjustedTargetProtein = Math.round(
    (adjustedTargetCalories * proteinPercentage) / 4
  );
  const adjustedTargetCarbs = Math.round(
    (adjustedTargetCalories * carbsPercentage) / 4
  );
  const adjustedTargetFat = Math.round(
    (adjustedTargetCalories * fatPercentage) / 9
  );

  const summaryData = {
    calories: {
      consumed: consumedCalories,
      burned: burnedCalories,
      target: adjustedTargetCalories,
    },
    macros: {
      protein: { current: consumedProtein, target: adjustedTargetProtein },
      fat: { current: consumedFat, target: adjustedTargetFat },
      carbs: { current: consumedCarbs, target: adjustedTargetCarbs },
      sugar: { current: consumedSugar, target: baseTargetSugar },
    },
  };

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
  const todayDayName = daysOfWeek[todayDayIndex];

  const todaysWorkout = workoutPlan?.daily_plans.find(
    (day: WorkoutPlan["daily_plans"][0]) =>
      day.day === todayDayName && day.estimated_calories_burned > 0
  );

  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 lg:order-2">
          <Suspense fallback={<NutritionSkeleton />}>
            <NutritionDashboard
              summaryData={summaryData}
              foodLogData={
                foodEntries?.filter((e) => e.meal_type !== "water") || []
              }
              userRecipes={userRecipes}
            />
          </Suspense>
        </div>
        <div className="lg:col-span-1 space-y-6 lg:order-1">
          <Suspense fallback={<SummarySkeleton />}>
            <SummaryCard currentWeight={profile.current_weight_kg} />
          </Suspense>
          <Suspense fallback={<WaterSkeleton />}>
            <WaterTrackerCard
              currentWater={totalWater}
              targetWater={profile.target_water_ml || 2500}
            />
          </Suspense>
          <Suspense fallback={<AiCoachSkeleton />}>
            <AICoachCard
              activityLogData={activityEntries || []}
              todaysWorkout={todaysWorkout}
              savedWorkouts={savedWorkouts as DbSavedWorkout[]}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
