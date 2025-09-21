// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FoodEntry, UserRecipe, DbSavedWorkout, WorkoutPlan } from "@/types";

type ActivityEntry = {
  id: string;
  user_id: string;
  calories_burned: number | null;
  created_at: string;
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Сьогоднішній діапазон дат
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Всі запити паралельно
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
        .select(
          "id, workout_name, estimated_calories_burned, created_at, workout_data"
        )
        .eq("user_id", user.id),
      supabase
        .from("workout_plans")
        .select("plan_data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
    ]);

    // Якщо профіль порожній — редірект
    if (!profile || profile.current_weight_kg == null) {
      return NextResponse.json({ redirectTo: "/settings" }, { status: 200 });
    }

    // Дані з таблиць
    const foodEntries: FoodEntry[] = foodEntriesResult.data ?? [];
    const activityEntries: ActivityEntry[] = activityEntriesResult.data ?? [];
    const userRecipes: UserRecipe[] = userRecipesResult.data ?? [];
    const savedWorkouts: DbSavedWorkout[] = savedWorkoutsResult.data ?? [];

    // Підрахунки
    const consumedCalories = foodEntries.reduce(
      (s, e) => s + (e.calories ?? 0),
      0
    );
    const consumedProtein = foodEntries.reduce(
      (s, e) => s + (e.protein_g ?? 0),
      0
    );
    const consumedFat = foodEntries.reduce((s, e) => s + (e.fat_g ?? 0), 0);
    const consumedCarbs = foodEntries.reduce((s, e) => s + (e.carbs_g ?? 0), 0);
    const consumedSugar = foodEntries.reduce((s, e) => s + (e.sugar_g ?? 0), 0);
    const totalWater = foodEntries.reduce((s, e) => s + (e.water_ml ?? 0), 0);

    const burnedCalories = activityEntries.reduce(
      (s, e) => s + (e.calories_burned ?? 0),
      0
    );

    // Цілі
    const baseTargetCalories = profile.target_calories ?? 2000;
    const baseTargetProtein = profile.target_protein_g ?? 120;
    const baseTargetCarbs = profile.target_carbs_g ?? 250;
    const baseTargetFat = profile.target_fat_g ?? 70;
    const baseTargetSugar = profile.target_sugar_g ?? 30;

    const adjustedTargetCalories = baseTargetCalories + burnedCalories;
    const proteinPct = (baseTargetProtein * 4) / baseTargetCalories;
    const carbsPct = (baseTargetCarbs * 4) / baseTargetCalories;
    const fatPct = (baseTargetFat * 9) / baseTargetCalories;

    const summaryData = {
      calories: {
        consumed: consumedCalories,
        burned: burnedCalories,
        target: adjustedTargetCalories,
      },
      macros: {
        protein: {
          current: consumedProtein,
          target: Math.round((adjustedTargetCalories * proteinPct) / 4),
        },
        fat: {
          current: consumedFat,
          target: Math.round((adjustedTargetCalories * fatPct) / 9),
        },
        carbs: {
          current: consumedCarbs,
          target: Math.round((adjustedTargetCalories * carbsPct) / 4),
        },
        sugar: { current: consumedSugar, target: baseTargetSugar },
      },
    };

    // Тренування
    const daysOfWeek = [
      "Неділя",
      "Понеділок",
      "Вівторок",
      "Середа",
      "Четвер",
      "П'ятниця",
      "Субота",
    ];
    const todayDayName = daysOfWeek[new Date().getDay()];
    const workoutPlan = latestPlan?.plan_data ?? null;

    const todaysWorkout =
      workoutPlan?.daily_plans?.find(
        (d: WorkoutPlan["daily_plans"][0]) =>
          d.day === todayDayName && d.estimated_calories_burned > 0
      ) ?? null;

    // Відповідь
    const payload = {
      profile,
      foodEntries,
      activityEntries,
      userRecipes,
      savedWorkouts,
      summaryData,
      todaysWorkout,
      totalWater,
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store" },
      status: 200,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
