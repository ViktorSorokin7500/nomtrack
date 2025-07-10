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
    const ingredientPrompt = `You are a nutritional assistant that analyzes a user's meal description and outputs a flat JSON list of ingredients with estimated weights in grams.

Your step-by-step logic:
1. If the input is not in English, detect the language and translate it to English before analysis.
2. If the user explicitly lists ingredients and quantities, use them as-is.
3. If the user provides a common dish name (e.g. "Borscht", "Caesar salad") without ingredients, deconstruct it into typical ingredients with approximate weights per standard portion. Adjust portion size if words like “large” or “small” are present.
4. Exclude emotional, irrelevant, or decorative phrases.
5. Output ONLY a valid JSON object in the format below.

JSON format:
{
  "ingredients": [
    { "name": "<english_food_item_name>", "weight_g": <integer> }
  ]
}

--- Examples ---

User Text: "my custom soup: 150g chicken broth, 50g chicken, 50g noodles"  
JSON:
{
  "ingredients": [
    { "name": "chicken broth", "weight_g": 150 },
    { "name": "chicken", "weight_g": 50 },
    { "name": "noodles", "weight_g": 50 }
  ]
}

User Text: "a large Chicken Kyiv"  
JSON:
{
  "ingredients": [
    { "name": "chicken fillet", "weight_g": 200 },
    { "name": "butter", "weight_g": 40 },
    { "name": "breadcrumbs", "weight_g": 30 },
    { "name": "egg", "weight_g": 25 }
  ]
}

--- Now analyze the following ---

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

export async function addWeightEntry(weight: number) {
  if (weight <= 0) {
    return { error: "Вага має бути позитивним числом." };
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return { error: "Ви не авторизовані" };
  }

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

export async function analyzeAndSaveActivityEntry(text: string) {
  if (!text.trim()) {
    return { error: "Опис активності не може бути порожнім" };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return { error: "Ви не авторизовані" };
  }

  // Промпт для аналізу активності
  const prompt = `You are a fitness analysis API.

Your job is to analyze a user's physical activity description and estimate the total number of calories burned. Follow this exact logic:

1. If the user's input is not in English, translate it to English before analyzing.
2. Estimate calories burned based on the activity type and duration.
3. If the input is vague or missing key data (e.g. no duration), make a realistic assumption based on common values.

Return ONLY a valid JSON object in the following format:
{
  "calories_burned": <integer>
}

--- Examples ---

User Text: "Running for 30 minutes"  
Your JSON Response: { "calories_burned": 350 }

User Text: "Силове тренування в залі 1 годину"  
Your JSON Response: { "calories_burned": 400 }

--- Now analyze the following ---
  User Text: "${text}"
  Your JSON Response:`;

  try {
    const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "google/gemma-3n-E4B-it",
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      return { error: "ШІ не повернув результат" };
    }
    const { calories_burned } = JSON.parse(content);

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
