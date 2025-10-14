"use server";
import { ACTIONS_TEXTS } from "@/components/shared/(texts)/actions-texts";
import { getAuthUserOrError } from "@/lib/billing";
import { nutritionTargetsSchema, personalInfoSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
export async function updatePersonalInfo(formData: {
  full_name?: string;
  current_weight_kg: number;
  height_cm: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
}) {
  const { supabase, user } = await getAuthUserOrError();

  const result = personalInfoSchema.safeParse(formData);
  if (!result.success) {
    return {
      error: ACTIONS_TEXTS.UNCORRECT_DATA + result.error.flatten().fieldErrors,
    };
  }

  const { error } = await (await supabase)
    .from("profiles")
    .update(formData)
    .eq("id", user.id);

  if (error) {
    return { error: ACTIONS_TEXTS.CANNOT_SAVE + error.message };
  }

  revalidatePath("/settings");

  return { success: ACTIONS_TEXTS.PROFILE_REFRESH };
}

export async function updateNutritionTargets(formData: unknown) {
  const { supabase, user } = await getAuthUserOrError();

  // Валідація даних
  const result = nutritionTargetsSchema.safeParse(formData);
  if (!result.success) {
    return { error: ACTIONS_TEXTS.UNCORRECT_DATA + result.error.message };
  }

  // Оновлення даних в таблиці profiles
  const { error } = await (await supabase)
    .from("profiles")
    .update(result.data)
    .eq("id", user.id);

  if (error) {
    return { error: ACTIONS_TEXTS.CANNOT_SAVE + error.message };
  }

  revalidatePath("/settings");

  return { success: ACTIONS_TEXTS.PROFILE.UPDATE_SUCCESS };
}

export async function addWeightEntry(weight: number) {
  if (weight <= 0) {
    return { error: ACTIONS_TEXTS.PROFILE.WEIGHT_POSITIVE };
  }

  const { supabase, user } = await getAuthUserOrError();

  // Створюємо запис у новій таблиці
  const { error } = await (await supabase).from("body_measurements").insert([
    {
      user_id: user.id,
      weight_kg: weight,
    },
  ]);

  if (error) {
    return { error: ACTIONS_TEXTS.CANNOT_SAVE + error.message };
  }

  const { error: profileError } = await (await supabase)
    .from("profiles")
    .update({ current_weight_kg: weight })
    .eq("id", user.id);

  if (profileError) {
    console.error(profileError);
  }

  revalidatePath("/dashboard");
  return {
    success: `${ACTIONS_TEXTS.PROFILE.WEIGHT_START} ${weight} ${ACTIONS_TEXTS.PROFILE.WEIGHT_END}`,
  };
}
