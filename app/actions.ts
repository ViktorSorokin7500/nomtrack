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

type NutritionInfo = {
  name: string;
  calories: number;
  protein_g: number;
  fat_total_g: number;
  carbohydrates_total_g: number;
  sugar_g: number;
};

type Ingredient = {
  name: string;
  weight_g: number;
};

type AiIngredientsResponse = {
  ingredients: Ingredient[];
};

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

export async function analyzeAndSaveFoodEntry(formData: {
  text: string;
  mealType: string;
}) {
  const { text, mealType } = formData;
  if (!text.trim()) return { error: "Текст не може бути порожнім" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Ви не авторизовані" };

  try {
    const ingredientPrompt = `You are an ingredient parsing API. Your only job is to extract food items and their weights in grams from the user's text. Return ONLY a JSON object.

Your logic MUST be as follows:
1. First, detect the language of the user's text.
2. If the text is not in English, you MUST translate it to English before parsing. All subsequent analysis MUST be based on the English translation.
3. Your final output MUST be only a single JSON object with a key "ingredients", which is an array of objects. Each object must contain "name" (in English) and "weight_g".

The required JSON format:
{
  "ingredients": [
    { "name": "<english_food_item_name>", "weight_g": <integer> }
  ]
}

If no ingredients can be found, return an empty array: { "ingredients": [] }.

---
Example 1:
User Text: "200g of 9% cottage cheese and one apple (around 150g)"
Your JSON Response:
{
  "ingredients": [
    { "name": "cottage cheese 9%", "weight_g": 200 },
    { "name": "apple", "weight_g": 150 }
  ]
}
---
Example 2 (Non-English):
User Text: "200г творога 9% і одне яблуко"
Your JSON Response:
{
  "ingredients": [
    { "name": "cottage cheese 9%", "weight_g": 200 },
    { "name": "apple", "weight_g": 150 }
  ]
}
---

Now, analyze the following text.

User Text: ${text}
Your JSON Response:`;

    console.log(text);

    const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });
    const aiResponse = await together.chat.completions.create({
      messages: [{ role: "user", content: ingredientPrompt }],
      model: "google/gemma-3n-E4B-it",
      response_format: { type: "json_object" },
    });

    const aiContent = aiResponse.choices?.[0]?.message?.content;
    if (!aiContent) return { error: "ШІ не розпізнам інгредієнти" };

    const { ingredients } = JSON.parse(aiContent) as AiIngredientsResponse;
    if (!ingredients || ingredients.length === 0) {
      return { error: "Не вдалося знайти інгредієнти у вашому запиті." };
    }

    const query = ingredients
      .map((ing) => `${ing.weight_g}g ${ing.name}`)
      .join(" and ");

    const nutritionResponse = await fetch(
      `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: { "X-Api-Key": process.env.CALORIENINJAS_API_KEY! },
      }
    );

    if (!nutritionResponse.ok) {
      throw new Error(
        `Помилка API CalorieNinjas: ${await nutritionResponse.text()}`
      );
    }

    const nutritionData: { items: NutritionInfo[] } =
      await nutritionResponse.json();

    const totals = {
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      sugar_g: 0,
      water_ml: 0,
    };

    for (const item of nutritionData.items) {
      totals.calories += item.calories;
      totals.protein_g += item.protein_g;
      totals.fat_g += item.fat_total_g;
      totals.carbs_g += item.carbohydrates_total_g;
      totals.sugar_g += item.sugar_g;
    }

    const { error: insertError } = await supabase.from("food_entries").insert([
      {
        user_id: user.id,
        entry_text: text,
        meal_type: mealType.toLowerCase(),
        calories: Math.round(totals.calories),
        protein_g: Math.round(totals.protein_g),
        fat_g: Math.round(totals.fat_g),
        carbs_g: Math.round(totals.carbs_g),
        sugar_g: Math.round(totals.sugar_g),
        water_ml: 0,
      },
    ]);

    if (insertError)
      throw new Error("Помилка збереження в БД: " + insertError.message);

    revalidatePath("/dashboard");
    return { success: "Запис успішно додано!" };
  } catch (error) {
    let errorMessage = "Сталася невідома помилка.";
    if (error instanceof Error) errorMessage = error.message;
    console.error("Повна помилка в analyzeAndSaveFoodEntry:", error);
    return { error: errorMessage };
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
