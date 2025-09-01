"use server";
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
    return { error: "Неправильні дані: " + result.error.flatten().fieldErrors };
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

export async function updateNutritionTargets(formData: unknown) {
  const { supabase, user } = await getAuthUserOrError();

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

export async function addWeightEntry(weight: number) {
  if (weight <= 0) {
    return { error: "Вага має бути позитивним числом." };
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
    return { error: "Не вдалося зберегти вагу: " + error.message };
  }

  // Також оновлюємо поточну вагу в профілі користувача
  const { error: profileError } = await (await supabase)
    .from("profiles")
    .update({ current_weight_kg: weight })
    .eq("id", user.id);

  if (profileError) {
    // Ця помилка менш критична, можна просто залогувати
    console.error("Не вдалося оновити вагу в профілі:", profileError);
  }

  revalidatePath("/dashboard");
  return { success: `Вагу ${weight} кг збережено!` };
}
