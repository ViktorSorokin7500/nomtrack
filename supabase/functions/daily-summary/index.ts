import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Daily summary function started.");

Deno.serve(async (_req) => {
  try {
    const supabaseAdmin: SupabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Визначаємо часові рамки для "вчорашнього дня"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

    // Отримуємо список унікальних користувачів, які мали активність вчора
    const { data: activeUsers, error: usersError } = await supabaseAdmin
      .from("food_entries")
      .select("user_id")
      .gte("created_at", startOfYesterday.toISOString())
      .lte("created_at", endOfYesterday.toISOString());

    if (usersError) throw usersError;

    const uniqueUserIds = [
      ...new Set(activeUsers.map((u: { user_id: string }) => u.user_id)),
    ];
    console.log(`Found ${uniqueUserIds.length} active users for yesterday.`);

    // Для кожного активного користувача рахуємо підсумки
    for (const userId of uniqueUserIds) {
      // Готуємо запити
      const foodPromise = supabaseAdmin
        .from("food_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startOfYesterday.toISOString())
        .lte("created_at", endOfYesterday.toISOString());

      const activityPromise = supabaseAdmin
        .from("activity_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startOfYesterday.toISOString())
        .lte("created_at", endOfYesterday.toISOString());

      const measurementPromise = supabaseAdmin
        .from("body_measurements")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startOfYesterday.toISOString())
        .lte("created_at", endOfYesterday.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      const profilePromise = supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // Виконуємо всі запити паралельно
      const [
        { data: foodEntries },
        { data: activityEntries },
        { data: measurementEntries },
        { data: profile },
      ] = await Promise.all([
        foodPromise,
        activityPromise,
        measurementPromise,
        profilePromise,
      ]);

      // Розрахунки
      const consumedCalories =
        foodEntries?.reduce(
          (s: number, e: { calories: number }) => s + (e.calories || 0),
          0
        ) || 0;
      const consumedProtein =
        foodEntries?.reduce(
          (s: number, e: { protein_g: number }) => s + (e.protein_g || 0),
          0
        ) || 0;
      const consumedFat =
        foodEntries?.reduce(
          (s: number, e: { fat_g: number }) => s + (e.fat_g || 0),
          0
        ) || 0;
      const consumedCarbs =
        foodEntries?.reduce(
          (s: number, e: { carbs_g: number }) => s + (e.carbs_g || 0),
          0
        ) || 0;
      const consumedSugar =
        foodEntries?.reduce(
          (s: number, e: { sugar_g: number }) => s + (e.sugar_g || 0),
          0
        ) || 0;
      const consumedWater =
        foodEntries?.reduce(
          (s: number, e: { water_ml: number }) => s + (e.water_ml || 0),
          0
        ) || 0;
      const burnedCalories =
        activityEntries?.reduce(
          (s: number, e: { calories_burned: number }) =>
            s + (e.calories_burned || 0),
          0
        ) || 0;

      const baseTargetCalories = profile?.target_calories || 0;
      const proteinPercentage =
        baseTargetCalories > 0
          ? ((profile?.target_protein_g || 0) * 4) / baseTargetCalories
          : 0;
      const carbsPercentage =
        baseTargetCalories > 0
          ? ((profile?.target_carbs_g || 0) * 4) / baseTargetCalories
          : 0;
      const fatPercentage =
        baseTargetCalories > 0
          ? ((profile?.target_fat_g || 0) * 9) / baseTargetCalories
          : 0;

      const targetCalories = baseTargetCalories + burnedCalories;
      const targetProtein = Math.round(
        (targetCalories * proteinPercentage) / 4
      );
      const targetCarbs = Math.round((targetCalories * carbsPercentage) / 4);
      const targetFat = Math.round((targetCalories * fatPercentage) / 9);

      // Готуємо об'єкт для вставки в архів
      const summaryPayload = {
        user_id: userId,
        date: startOfYesterday.toISOString().split("T")[0],
        consumed_calories: consumedCalories,
        target_calories: targetCalories,
        consumed_protein_g: consumedProtein,
        target_protein_g: targetProtein,
        consumed_fat_g: consumedFat,
        target_fat_g: targetFat,
        consumed_carbs_g: consumedCarbs,
        target_carbs_g: targetCarbs,
        consumed_sugar_g: consumedSugar,
        target_sugar_g: profile?.target_sugar_g || 30,
        consumed_water_ml: consumedWater,
        target_water_ml: profile?.target_water_ml || 2500,
        end_of_day_weight: measurementEntries?.[0]?.weight_kg || null,
        end_of_day_belly: measurementEntries?.[0]?.belly_cm || null,
        end_of_day_waist: measurementEntries?.[0]?.waist_cm || null,
      };

      // Вставляємо підсумок в архів
      const { error: insertError } = await supabaseAdmin
        .from("daily_summaries")
        .insert(summaryPayload);

      if (insertError) {
        console.error(
          `Failed to insert summary for user ${userId}:`,
          insertError
        );
      } else {
        console.log(`Successfully created summary for user ${userId}.`);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Daily summaries completed for ${uniqueUserIds.length} users.`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
