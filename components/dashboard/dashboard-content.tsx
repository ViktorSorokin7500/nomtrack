import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { DbSavedWorkout, WorkoutPlan } from "@/types";
import {
  LazyAICoachCard,
  LazyNutritionDashboard,
  LazySummaryCard,
  LazyWaterTracker,
} from ".";
import { COMMON_TEXTS } from "../shared/(texts)/app-texts";

export async function DashboardContent() {
  const supabase = createClient();
  const { data: userData } = await (await supabase).auth.getUser();
  const user = userData.user;

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
    COMMON_TEXTS.SUNDAY,
    COMMON_TEXTS.MONDAY,
    COMMON_TEXTS.TUESDAY,
    COMMON_TEXTS.WEDNESDAY,
    COMMON_TEXTS.THURSDAY,
    COMMON_TEXTS.FRIDAY,
    COMMON_TEXTS.SATURDAY,
  ];
  const todayDayName = daysOfWeek[todayDayIndex];

  const todaysWorkout = workoutPlan?.daily_plans.find(
    (day: WorkoutPlan["daily_plans"][0]) =>
      day.day === todayDayName && day.estimated_calories_burned > 0
  );

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 lg:order-2">
        <LazyNutritionDashboard
          summaryData={summaryData}
          foodLogData={
            foodEntries?.filter((e) => e.meal_type !== "water") || []
          }
          userRecipes={userRecipes}
        />
      </div>
      <div className="lg:col-span-1 space-y-6 lg:order-1">
        <LazySummaryCard currentWeight={profile.current_weight_kg} />
        <LazyWaterTracker
          currentWater={totalWater}
          targetWater={profile.target_water_ml || 2500}
        />
        <LazyAICoachCard
          activityLogData={activityEntries || []}
          todaysWorkout={todaysWorkout}
          savedWorkouts={savedWorkouts as DbSavedWorkout[]}
        />
      </div>
    </div>
  );
}
