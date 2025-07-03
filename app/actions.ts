"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import Together from "together-ai";

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

const together = new Together({
  apiKey: process.env.TOGETHER_AI_API_KEY,
});

export async function analyzeFoodEntry(text: string) {
  if (!text.trim()) {
    return { error: "Текст не може бути порожнім" };
  }

  const prompt = `You are an expert nutrition analysis API. Your task is to analyze the user-provided text describing a meal, calculate the total nutritional values, and return them ONLY in a specific JSON format. Your entire response must be just the JSON object. The required JSON format is:
  {
    "calories": <integer>, "protein": <integer>, "fat": <integer>, "carbs": <integer>, "sugar": <integer>, "water": <integer>
  }
  If a nutrient cannot be determined, its value should be 0.  
  User Text: "${text}"
  Your JSON Response:`;

  try {
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "google/gemma-3n-E4B-it",
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      return { error: "ШІ не повернув результат" };
    }

    const parsedData = JSON.parse(content);
    return { data: parsedData, error: null };
  } catch (error) {
    console.error("Помилка API Together AI:", error);
    return { error: "Не вдалося проаналізувати запис. Спробуйте пізніше." };
  }
}

export async function addWaterEntry(amount: number) {
  if (amount <= 0) {
    return { error: "Кількість має бути позитивною." };
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return { error: "Ви не авторизовані" };
  }

  const { error } = await (await supabase).from("food_entries").insert([
    {
      user_id: user.id,
      entry_text: `${amount}ml of water`,
      meal_type: "water",
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      sugar_g: 0,
      water_ml: amount,
    },
  ]);

  if (error) {
    return { error: "Не вдалося додати запис: " + error.message };
  }

  revalidatePath("/dashboard");
  return { success: `Додано ${amount} мл води!` };
}
