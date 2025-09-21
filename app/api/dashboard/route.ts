/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [
      profileRes,
      foodEntriesRes,
      activityEntriesRes,
      userRecipesRes,
      savedWorkoutsRes,
      latestPlanRes,
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

    const profile = profileRes?.data ?? null;
    if (!profile || profile.current_weight_kg == null) {
      return NextResponse.json({ redirectTo: "/settings" }, { status: 200 });
    }

    const foodEntries = foodEntriesRes?.data ?? [];
    const activityEntries = activityEntriesRes?.data ?? [];
    const userRecipes = userRecipesRes?.data ?? [];
    const savedWorkouts = savedWorkoutsRes?.data ?? [];
    const latestPlan = latestPlanRes?.data ?? null;

    // Безпечні підрахунки: приводимо до чисел і замінюємо null/undefined на 0
    const toNum = (v: unknown) => {
      if (typeof v === "number") return v;
      if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      }
      return 0;
    };

    const consumedCalories = foodEntries.reduce(
      (s: number, e: any) => s + toNum(e?.calories),
      0
    );
    const consumedProtein = foodEntries.reduce(
      (s: number, e: any) => s + toNum(e?.protein_g),
      0
    );
    const consumedFat = foodEntries.reduce(
      (s: number, e: any) => s + toNum(e?.fat_g),
      0
    );
    const consumedCarbs = foodEntries.reduce(
      (s: number, e: any) => s + toNum(e?.carbs_g),
      0
    );
    const consumedSugar = foodEntries.reduce(
      (s: number, e: any) => s + toNum(e?.sugar_g),
      0
    );
    const totalWater = foodEntries.reduce(
      (s: number, e: any) => s + toNum(e?.water_ml),
      0
    );
    const burnedCalories = activityEntries.reduce(
      (s: number, e: any) => s + toNum(e?.calories_burned),
      0
    );

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
      (workoutPlan?.daily_plans ?? []).find(
        (d: any) =>
          d?.day === todayDayName && toNum(d?.estimated_calories_burned) > 0
      ) ?? null;

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
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      status: 200,
    });
  } catch (err) {
    console.error("API /api/dashboard error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
