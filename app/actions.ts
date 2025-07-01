"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Наша Server Action для оновлення особистих даних
export async function updatePersonalInfo(formData: {
  full_name?: string;
  current_weight_kg: number;
  height_cm: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return { error: "Ви не авторизовані" };
  }

  const { error } = await (
    await supabase
  )
    .from("profiles")
    .update(formData) // Оновлюємо переданими даними з форми
    .eq("id", user.id); // Тільки для поточного користувача

  if (error) {
    return { error: "Не вдалося зберегти профіль: " + error.message };
  }

  // Очищуємо кеш, щоб сторінка показала оновлені дані
  revalidatePath("/settings");

  return { success: "Профіль успішно оновлено!" };
}

const nutritionTargetsSchema = z.object({
  target_calories: z.coerce.number().positive().int(),
  target_protein_g: z.coerce.number().positive().int(),
  target_carbs_g: z.coerce.number().positive().int(),
  target_fat_g: z.coerce.number().positive().int(),
  target_water_ml: z.coerce.number().positive().int(),
});

// Нова Server Action для оновлення харчових цілей
export async function updateNutritionTargets(formData: unknown) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return { error: "Ви не авторизовані" };
  }

  // Валідація даних
  const result = nutritionTargetsSchema.safeParse(formData);
  if (!result.success) {
    return { error: "Неправильні дані. " + result.error.message };
  }

  // Оновлення даних в таблиці profiles
  const { error } = await (await supabase)
    .from("profiles")
    .update(result.data)
    .eq("id", user.id);

  if (error) {
    return { error: "Не вдалося зберегти цілі: " + error.message };
  }

  revalidatePath("/settings");

  return { success: "Харчові цілі успішно оновлено!" };
}
