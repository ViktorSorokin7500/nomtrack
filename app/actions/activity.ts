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
import { getAiJsonResponse } from "@/lib/ai";
import { WorkoutPlan, AiWorkoutResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { ACTIONS_TEXTS } from "@/components/shared/(texts)/actions-texts";

export async function analyzeAndSaveActivityEntry(text: string) {
  if (!text.trim()) {
    return { error: ACTIONS_TEXTS.DESCRIPTION_EMPTY };
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
      return { error: `${ACTIONS_TEXTS.AI_ERROR}: ${error}` };
    }

    const calories_burned = data?.calories_burned;
    if (!calories_burned || calories_burned <= 0) {
      return {
        error: ACTIONS_TEXTS.ACTIVITY.NOT_AN_ACTIVITY,
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
      throw new Error(ACTIONS_TEXTS.ACTIVITY.SAVE_ERROR + insertError.message);

    revalidatePath("/dashboard");
    return { success: ACTIONS_TEXTS.ACTIVITY.SAVE_SUCCESS };
  } catch (error) {
    let errorMessage = ACTIONS_TEXTS.ACTIVITY.ACTIVITY_ANALIZE_ERROR;
    if (error instanceof Error) errorMessage = error.message;
    return { error: errorMessage };
  }
}

export async function createAndAnalyzeWorkoutPlan(formData: {
  equipmentText: string;
  durationMinutes: number;
}) {
  const { equipmentText, durationMinutes } = formData;
  if (!equipmentText.trim() || !durationMinutes || durationMinutes <= 0) {
    return { error: ACTIONS_TEXTS.ACTIVITY.EQUIPMENT_ERROR };
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
      throw new Error(ACTIONS_TEXTS.ACTIVITY.USER_PROFILE_ERROR);
    }

    const prompt = promptWithWorkoutPlan(
      userProfile,
      equipmentText,
      durationMinutes
    );

    const { data: workoutPlan, error: aiError } =
      await getAiJsonResponse<WorkoutPlan>(prompt);

    if (aiError) {
      return { error: `${ACTIONS_TEXTS.AI_ERROR}: ${aiError}` };
    }

    if (!workoutPlan) {
      return {
        error: ACTIONS_TEXTS.ACTIVITY.AI_NOT_RETURNED,
      };
    }

    const { error: insertError } = await supabase.from("workout_plans").insert([
      {
        user_id: user.id,
        plan_data: workoutPlan,
      },
    ]);

    if (insertError) {
      throw new Error(ACTIONS_TEXTS.ERROR_DB_SAVE + insertError.message);
    }

    revalidatePath("/coach"); // Оновлюємо сторінку
    return { success: ACTIONS_TEXTS.ACTIVITY.DB_SAVE };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ACTIONS_TEXTS.SERVER_ERROR;
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
    let errorMessage = ACTIONS_TEXTS.CHECK_PREMIUM_ERROR;
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
    return { error: ACTIONS_TEXTS.ACTIVITY.TRAINING_ERROR };
  }

  revalidatePath("/dashboard");
  return { success: ACTIONS_TEXTS.ACTIVITY.TRAINING_SUCCESS };
}

export async function createAndAnalyzeWorkout(formData: {
  workoutName: string;
  workoutText: string;
}) {
  const { workoutName, workoutText } = formData;
  if (!workoutName.trim() || !workoutText.trim()) {
    return { error: ACTIONS_TEXTS.ACTIVITY.WORK_OUT_NAME_EMPTY };
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
      throw new Error(ACTIONS_TEXTS.ACTIVITY.USER_PROFILE_ERROR);
    }

    const prompt = promptWithSingleWorkout(workoutText, userProfile);
    const { data: aiWorkout, error: aiError } =
      await getAiJsonResponse<AiWorkoutResponse>(prompt);

    if (aiError) {
      return { error: `${ACTIONS_TEXTS.AI_ERROR} ${aiError}` };
    }

    if (!aiWorkout || aiWorkout.estimated_calories_burned === 0) {
      return {
        error: ACTIONS_TEXTS.ACTIVITY.TRAINING_FAILED,
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
      throw new Error(ACTIONS_TEXTS.ERROR_DB_SAVE + insertError.message);
    }

    revalidatePath("/coach"); // Оновлюємо сторінку коуча після збереження
    return {
      success: `${ACTIONS_TEXTS.ACTIVITY.TRAINING_START} "${workoutName}" ${ACTIONS_TEXTS.ACTIVITY.TRAINING_END}`,
    };
  } catch (error) {
    let errorMessage = ACTIONS_TEXTS.SERVER_ERROR;
    if (error instanceof Error) errorMessage = error.message;
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
      return { error: ACTIONS_TEXTS.ACTIVITY.DB_ERROR + error.message };
    }
    revalidatePath("/dashboard");

    return { success: ACTIONS_TEXTS.DELETE_SUCCESS };
  } catch (e) {
    if (e instanceof Error) {
      return { error: `${ACTIONS_TEXTS.SERVER_ERROR}: ${e.message}` };
    }
    return { error: ACTIONS_TEXTS.SERVER_ERROR };
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
      return { error: ACTIONS_TEXTS.ACTIVITY.DB_ERROR + error.message };
    }
    revalidatePath("/dashboard");

    return { success: ACTIONS_TEXTS.DELETE_SUCCESS };
  } catch (e) {
    if (e instanceof Error) {
      return { error: `${ACTIONS_TEXTS.SERVER_ERROR}: ${e.message}` };
    }
    return { error: ACTIONS_TEXTS.SERVER_ERROR };
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
      return { error: ACTIONS_TEXTS.ACTIVITY.DB_ERROR + error.message };
    }
    revalidatePath("/dashboard");

    return { success: ACTIONS_TEXTS.DELETE_SUCCESS };
  } catch (e) {
    if (e instanceof Error) {
      return { error: `${ACTIONS_TEXTS.SERVER_ERROR}: ${e.message}` };
    }
    return { error: ACTIONS_TEXTS.SERVER_ERROR };
  }
}
