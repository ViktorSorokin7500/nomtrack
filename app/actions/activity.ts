"use server";
import {
  getAuthUserOrError,
  checkPremiumStatus,
  checkCreditsAndDeduct,
} from "@/lib/billing";
import { AI_REQUEST, AI_ANALYZE } from "@/lib/const";
import {
  promptWithActivity,
  promptWithWorkoutPlan,
  promptWithSingleWorkout,
} from "@/lib/prompts";
import { getAiJsonResponse } from "@/lib/utils";
import { WorkoutPlan, AiWorkoutResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function analyzeAndSaveActivityEntry(text: string) {
  if (!text.trim()) {
    return { error: "Опис активності не може бути порожнім" };
  }

  const { supabase, user } = await getAuthUserOrError();

  // Промпт для аналізу активності
  const prompt = promptWithActivity(text);

  try {
    await checkPremiumStatus(user.id, supabase);
    await checkCreditsAndDeduct(user.id, AI_REQUEST, supabase);
    const { data, error } = await getAiJsonResponse<{
      calories_burned: number;
    }>(prompt);

    if (error) {
      return { error: `Помилка аналізу ШІ: ${error}` };
    }

    const calories_burned = data?.calories_burned;
    if (!calories_burned || calories_burned <= 0) {
      return {
        error:
          "Це не схоже на фізичну активність. Спробуйте описати її інакше.",
      };
    }

    const { error: insertError } = await (await supabase)
      .from("activity_entries")
      .insert([
        {
          user_id: user.id,
          entry_text: text,
          calories_burned: calories_burned || 0,
        },
      ]);

    if (insertError)
      throw new Error("Помилка збереження активності: " + insertError.message);

    revalidatePath("/dashboard");
    return { success: "Активність успішно додано!" };
  } catch (error) {
    let errorMessage = "Не вдалося проаналізувати активність.";
    if (error instanceof Error) errorMessage = error.message;
    console.error("Помилка в analyzeAndSaveActivityEntry:", error);
    return { error: errorMessage };
  }
}

export async function createAndAnalyzeWorkoutPlan(formData: {
  equipmentText: string;
  durationMinutes: number;
}) {
  const { equipmentText, durationMinutes } = formData;
  if (!equipmentText.trim() || !durationMinutes || durationMinutes <= 0) {
    return { error: "Будь ласка, вкажіть наявний інвентар та тривалість." };
  }

  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
    await checkCreditsAndDeduct(user.id, AI_ANALYZE, supabase);

    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!userProfile) {
      throw new Error("Не вдалося завантажити профіль користувача.");
    }

    const prompt = promptWithWorkoutPlan(
      userProfile,
      equipmentText,
      durationMinutes
    );

    const { data: workoutPlan, error: aiError } =
      await getAiJsonResponse<WorkoutPlan>(prompt);

    if (aiError) {
      return { error: `Помилка аналізу ШІ: ${aiError}` };
    }

    if (!workoutPlan) {
      return {
        error: "ШІ не повернув жодного плану тренувань. Спробуйте ще раз.",
      };
    } // Зберігаємо план у новій таблиці

    const { error: insertError } = await supabase.from("workout_plans").insert([
      {
        user_id: user.id,
        plan_data: workoutPlan, // Зберігаємо JSON об'єкт
      },
    ]);

    if (insertError) {
      throw new Error("Помилка збереження плану в БД: " + insertError.message);
    }

    revalidatePath("/coach"); // Оновлюємо сторінку
    return { success: "План тренувань успішно згенеровано та збережено!" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Невідома помилка на сервері.";
    console.error("Помилка в createAndAnalyzeWorkoutPlan:", error);
    return { error: errorMessage };
  }
}

export async function logPlannedWorkout(entryData: {
  entryText: string;
  caloriesBurned: number;
}) {
  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
  } catch (e) {
    let errorMessage = "Не вдалося додати тренування. Ваша підписка вичерпана.";
    if (e instanceof Error) errorMessage = e.message;
    return { error: errorMessage };
  }

  const { error: insertError } = await (await supabase)
    .from("activity_entries")
    .insert([
      {
        user_id: user.id,
        entry_text: entryData.entryText,
        calories_burned: entryData.caloriesBurned,
      },
    ]);

  if (insertError) {
    console.error("Помилка збереження активності з плану:", insertError);
    return { error: "Не вдалося додати тренування з плану." };
  }

  revalidatePath("/dashboard");
  return { success: "Тренування успішно додано!" };
}

export async function createAndAnalyzeWorkout(formData: {
  workoutName: string;
  workoutText: string;
}) {
  const { workoutName, workoutText } = formData;
  if (!workoutName.trim() || !workoutText.trim()) {
    return { error: "Назва та опис тренування не можуть бути порожніми." };
  }

  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
    await checkCreditsAndDeduct(user.id, AI_REQUEST, supabase);

    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!userProfile) {
      throw new Error("Не вдалося завантажити профіль користувача.");
    }

    const prompt = promptWithSingleWorkout(workoutText, userProfile);
    const { data: aiWorkout, error: aiError } =
      await getAiJsonResponse<AiWorkoutResponse>(prompt);

    if (aiError) {
      return { error: `Помилка аналізу ШІ: ${aiError}` };
    }

    if (!aiWorkout || aiWorkout.estimated_calories_burned === 0) {
      return {
        error:
          "Не вдалося розпізнати тренування. Спробуйте описати його інакше.",
      };
    }

    const { error: insertError } = await (await supabase)
      .from("user_workouts")
      .insert([
        {
          user_id: user.id,
          workout_name: workoutName,
          estimated_calories_burned: aiWorkout.estimated_calories_burned,
          workout_data: aiWorkout.exercises,
        },
      ]);

    if (insertError) {
      throw new Error(
        "Помилка збереження тренування в БД: " + insertError.message
      );
    }

    revalidatePath("/coach"); // Оновлюємо сторінку коуча після збереження
    return { success: `Тренування "${workoutName}" успішно збережено!` };
  } catch (error) {
    let errorMessage = "Сталася невідома помилка.";
    if (error instanceof Error) errorMessage = error.message;
    console.error("Повна помилка в createAndAnalyzeWorkout:", error);
    return { error: errorMessage };
  }
}

export async function deleteActivity(activityId: number) {
  const { supabase, user } = await getAuthUserOrError();

  try {
    const { error } = await (await supabase)
      .from("activity_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("id", activityId);

    if (error) {
      return { error: "Помилка бази даних: " + error.message };
    }
    revalidatePath("/dashboard");

    return { success: "Запис видалено!" };
  } catch (e) {
    if (e instanceof Error) {
      return { error: `Невідома помилка на сервері: ${e.message}` };
    }
    return { error: "Невідома помилка на сервері." };
  }
}

export async function deleteWorkoutPlan(planId: number) {
  const { supabase, user } = await getAuthUserOrError();

  try {
    const { error } = await (await supabase)
      .from("workout_plans")
      .delete()
      .eq("user_id", user.id)
      .eq("id", planId);

    if (error) {
      return { error: "Помилка бази даних: " + error.message };
    }
    revalidatePath("/dashboard");

    return { success: "Запис видалено!" };
  } catch (e) {
    if (e instanceof Error) {
      return { error: `Невідома помилка на сервері: ${e.message}` };
    }
    return { error: "Невідома помилка на сервері." };
  }
}

export async function deleteUserWorkout(workoutId: number) {
  const { supabase, user } = await getAuthUserOrError();

  try {
    const { error } = await (await supabase)
      .from("user_workouts")
      .delete()
      .eq("user_id", user.id)
      .eq("id", workoutId);

    if (error) {
      return { error: "Помилка бази даних: " + error.message };
    }
    revalidatePath("/dashboard");

    return { success: "Запис видалено!" };
  } catch (e) {
    if (e instanceof Error) {
      return { error: `Невідома помилка на сервері: ${e.message}` };
    }
    return { error: "Невідома помилка на сервері." };
  }
}
