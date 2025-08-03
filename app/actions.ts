"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import Together from "together-ai";
import { type FoodEntryFormSchema } from "@/lib/validators";

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
  serving_size_g?: number;
};

interface TotalNutrition {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  sugar_g: number;
  total_weight_g: number;
}

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
5. Output ONLY a valid JSON object in the format below without any additional text or explanations.
I will kill you if you will return anything else than JSON.
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
      model: "Qwen/Qwen2-72B-Instruct",
      response_format: { type: "json_object" },
    });

    let aiContent = aiResponse.choices?.[0]?.message?.content;

    if (!aiContent) return { error: "ШІ не розпізнам інгредієнти" };

    aiContent = aiContent.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "");

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
4. If the text is NOT a physical activity (e.g., "hello world", "2+2", "what is the weather"), return 0 for calories_burned.
I will kill you if you will return anything else than JSON.
Return ONLY a valid JSON, without any additional text. The JSON should be an object in the following format:
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
      model: "Qwen/Qwen2-72B-Instruct",
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return { error: "ШІ не повернув результат" };
    }

    const startIndex = content.indexOf("{");
    const endIndex = content.lastIndexOf("}");

    // 2. Перевіряємо, чи знайдено JSON
    if (startIndex === -1 || endIndex === -1) {
      console.error("Не знайдено JSON у відповіді від AI:", content);
      return { error: "Некоректна відповідь від AI. Спробуйте ще раз." };
    }

    // 3. Вирізаємо чисту JSON-строку
    const jsonString = content.substring(startIndex, endIndex + 1);

    const { calories_burned } = JSON.parse(jsonString);
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

export async function addManualFoodEntry(entryData: FoodEntryFormSchema) {
  console.log("--- Server Action 'addManualFoodEntry' запущено ---");
  console.log("Отримані дані з форми:", entryData);

  // Перевіряємо, що ми в правильному режимі
  if (entryData.entry_mode !== "manual") {
    return { error: "Неправильний режим для цього екшену" };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    console.error("Помилка: Користувач не авторизований.");
    return { error: "Ви не авторизовані" };
  }

  // Використовуємо 'try...catch' для відлову будь-яких непередбачуваних помилок
  try {
    const {
      entry_text,
      meal_type,
      calc_mode,
      calories,
      protein_g,
      fat_g,
      carbs_g,
      sugar_g,
      weight_eaten,
      servings,
    } = entryData;

    const finalData = {
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      sugar_g: 0,
    };

    // --- ЛОГІКА РОЗРАХУНКУ ---
    if (calc_mode === "per100g") {
      const multiplier = (weight_eaten || 0) / 100;
      finalData.calories = (calories || 0) * multiplier;
      finalData.protein_g = (protein_g || 0) * multiplier;
      finalData.fat_g = (fat_g || 0) * multiplier;
      finalData.carbs_g = (carbs_g || 0) * multiplier;
      finalData.sugar_g = (sugar_g || 0) * multiplier;
    } else {
      // Режим "на порцію"
      const servingsCount = servings || 1;
      finalData.calories = (calories || 0) * servingsCount;
      finalData.protein_g = (protein_g || 0) * servingsCount;
      finalData.fat_g = (fat_g || 0) * servingsCount;
      finalData.carbs_g = (carbs_g || 0) * servingsCount;
      finalData.sugar_g = (sugar_g || 0) * servingsCount;
    }

    console.log("Дані після розрахунку:", finalData);

    const dataToInsert = {
      user_id: user.id,
      entry_text: entry_text,
      meal_type: meal_type,
      calories: Math.round(finalData.calories),
      protein_g: Math.round(finalData.protein_g),
      fat_g: Math.round(finalData.fat_g),
      carbs_g: Math.round(finalData.carbs_g),
      sugar_g: Math.round(finalData.sugar_g),
      water_ml: 0,
    };

    console.log("Об'єкт для запису в БД:", dataToInsert);

    const { error } = await (await supabase)
      .from("food_entries")
      .insert([dataToInsert]);

    if (error) {
      console.error("ПОМИЛКА ЗАПИСУ В SUPABASE:", error);
      return { error: "Помилка бази даних: " + error.message };
    }

    revalidatePath("/dashboard");
    console.log("--- Запис успішно додано! ---");
    return { success: "Запис успішно додано!" };
  } catch (e) {
    console.error("КРИТИЧНА ПОМИЛКА В ЕКШЕНІ addManualFoodEntry:", e);
    if (e instanceof Error) {
      return { error: `Невідома помилка на сервері: ${e.message}` };
    }
    return { error: "Невідома помилка на сервері." };
  }
}

export async function createAndAnalyzeRecipe(formData: {
  recipeName: string;
  ingredientsText: string;
}) {
  const { recipeName, ingredientsText } = formData;
  if (!recipeName.trim() || !ingredientsText.trim()) {
    return { error: "Назва та інгредієнти не можуть бути порожніми." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Ви не авторизовані" };

  try {
    const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });
    const initialIngredientLines = ingredientsText
      .split(/,|\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (initialIngredientLines.length === 0) {
      return { error: "Список інгредієнтів порожній або некоректний." };
    }

    // 1. НАЙБІЛЬШ ПРОСУНУТИЙ ПРОМПТ
    const batchPrompt = `
      Analyze the following list of recipe ingredients. Your task is to normalize each ingredient into its English name and its total weight in GRAMS.

      Follow these rules:
      1. If you see "кг", "kg", or same meaninig, multiply the number by 1000 to get grams. (e.g., "2 кг муки" -> weightGrams: 2000).
      2. For items by count (like eggs, onions, etc.), use a standard average weight to calculate the total weight in grams. (e.g., "8 large eggs" -> assume 60g per egg -> weightGrams: 480).
      3. For liquids in "ml", assume density is 1 g/ml. (e.g., "200 ml milk" -> weightGrams: 200).
      4. The 'ingredientName' should be a clean, simple English name suitable for an API query (e.g., "cauliflower", "large eggs", "milk").
      5. If the input text does not appear to be a list of ingredients, or if it's nonsensical, return an empty JSON array: []
      I will kill you if you will return anything else than JSON.
      Return the output ONLY as a valid JSON array of objects. Each object must have two keys: "ingredientName" (string) and "weightGrams" (number).

      Input List:
      ${initialIngredientLines.join("\n")}

      JSON Output:
    `;

    // 2. Робимо ОДИН запит до AI
    const batchResponse = await together.chat.completions.create({
      messages: [{ role: "user", content: batchPrompt }],
      model: "Qwen/Qwen2-72B-Instruct",
      response_format: { type: "json_object" },
    });
    let responseContent = batchResponse.choices?.[0]?.message?.content;
    console.log("responseContent actions =>", responseContent);

    if (!responseContent) throw new Error("AI не повернув результат.");

    responseContent = responseContent.replace(
      /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,
      ""
    );

    let normalizedIngredients: {
      ingredientName: string;
      weightGrams: number;
    }[];
    try {
      const startIndex = responseContent.indexOf("[");
      const endIndex = responseContent.lastIndexOf("]");
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("Не вдалося знайти JSON масив у відповіді AI.");
      }
      const jsonString = responseContent.substring(startIndex, endIndex + 1);
      const parsedJson = JSON.parse(jsonString);

      if (Array.isArray(parsedJson)) {
        normalizedIngredients = parsedJson;
      } else {
        const arrayKey = Object.keys(parsedJson).find((k) =>
          Array.isArray(parsedJson[k])
        );
        if (!arrayKey)
          throw new Error(
            "JSON від AI не є масивом і не містить масиву всередині."
          );
        normalizedIngredients = parsedJson[arrayKey];
      }
    } catch (e) {
      console.error("Помилка парсингу JSON від AI:", responseContent);
      console.error("Помилка:", e);
      throw new Error(
        "Не вдалося обробити відповідь від AI. Спробуйте змінити інгредієнти."
      );
    }

    if (!normalizedIngredients || normalizedIngredients.length === 0) {
      return {
        error:
          "Не вдалося розпізнати інгредієнти. Будь ласка, введіть список продуктів та їх вагу.",
      };
    }

    // 3. Обробляємо кожен нормалізований інгредієнт
    const nutritionPromises = normalizedIngredients.map(
      async (item): Promise<TotalNutrition> => {
        const actualWeight = item.weightGrams;
        if (!item.ingredientName || actualWeight <= 0) {
          return {
            calories: 0,
            protein_g: 0,
            fat_g: 0,
            carbs_g: 0,
            sugar_g: 0,
            total_weight_g: 0,
          };
        }

        // Робимо запит до CalorieNinjas лише за назвою, щоб отримати дані на 100 г
        const nutritionResponse = await fetch(
          `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(
            item.ingredientName
          )}`,
          { headers: { "X-Api-Key": process.env.CALORIENINJAS_API_KEY! } }
        );
        if (!nutritionResponse.ok) {
          console.warn(
            `Помилка CalorieNinjas для '${item.ingredientName}', ігноруємо.`
          );
          return {
            calories: 0,
            protein_g: 0,
            fat_g: 0,
            carbs_g: 0,
            sugar_g: 0,
            total_weight_g: actualWeight,
          };
        }
        console.log("nutritionResponse actions=>", nutritionResponse);

        const nutritionData: { items: NutritionInfo[] } =
          await nutritionResponse.json();
        if (nutritionData.items.length === 0) {
          console.warn(
            `CalorieNinjas не розпізнав '${item.ingredientName}', ігноруємо.`
          );
          return {
            calories: 0,
            protein_g: 0,
            fat_g: 0,
            carbs_g: 0,
            sugar_g: 0,
            total_weight_g: actualWeight,
          };
        }

        const nutritionPer100g = nutritionData.items[0];
        const multiplier = actualWeight / 100.0;

        return {
          calories: (nutritionPer100g.calories || 0) * multiplier,
          protein_g: (nutritionPer100g.protein_g || 0) * multiplier,
          fat_g: (nutritionPer100g.fat_total_g || 0) * multiplier,
          carbs_g: (nutritionPer100g.carbohydrates_total_g || 0) * multiplier,
          sugar_g: (nutritionPer100g.sugar_g || 0) * multiplier,
          total_weight_g: actualWeight,
        };
      }
    );

    const allNutritionData = await Promise.all(nutritionPromises);
    console.log("allNutritionData actions =>", allNutritionData);

    const finalTotals = allNutritionData.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein_g += item.protein_g;
        acc.fat_g += item.fat_g;
        acc.carbs_g += item.carbs_g;
        acc.sugar_g += item.sugar_g;
        acc.total_weight_g += item.total_weight_g;
        return acc;
      },
      {
        calories: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_g: 0,
        sugar_g: 0,
        total_weight_g: 0,
      }
    );

    if (finalTotals.total_weight_g < 1) {
      return { error: "Не вдалося визначити вагу інгредієнтів." };
    }

    const multiplier = 100 / finalTotals.total_weight_g;
    const recipeData = {
      user_id: user.id,
      recipe_name: recipeName,
      total_weight_g: Math.round(finalTotals.total_weight_g),
      calories_per_100g: Math.round(finalTotals.calories * multiplier),
      protein_per_100g: parseFloat(
        (finalTotals.protein_g * multiplier).toFixed(1)
      ),
      fat_per_100g: parseFloat((finalTotals.fat_g * multiplier).toFixed(1)),
      carbs_per_100g: parseFloat((finalTotals.carbs_g * multiplier).toFixed(1)),
      sugar_per_100g: parseFloat((finalTotals.sugar_g * multiplier).toFixed(1)),
      ingredients_text: ingredientsText,
    };

    const { error: insertError } = await supabase
      .from("user_recipes")
      .insert([recipeData]);
    if (insertError) {
      throw new Error(
        "Помилка збереження рецепта в БД: " + insertError.message
      );
    }

    revalidatePath("/recipes");
    return { success: `Рецепт "${recipeName}" успішно збережено!` };
  } catch (error) {
    let errorMessage = "Сталася невідома помилка.";
    if (error instanceof Error) errorMessage = error.message;
    console.error("Помилка в createAndAnalyzeRecipe:", error);
    return { error: errorMessage };
  }
}

export async function deleteRecipe(recipeId: string) {
  if (!recipeId) {
    return { error: "ID рецепта не вказано." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Ви не авторизовані." };
  }

  // Видаляємо рецепт, але ТІЛЬКИ якщо він належить поточному користувачу
  // Це важливий крок для безпеки!
  const { error } = await supabase
    .from("user_recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Помилка видалення рецепта:", error);
    return { error: "Не вдалося видалити рецепт." };
  }

  // Оновлюємо кеш сторінки, щоб список оновився
  revalidatePath("/recipes");

  return { success: "Рецепт успішно видалено." };
}

export async function deleteFoodEntry(entryId: number) {
  console.log(`--- Server Action 'deleteFoodEntry' для ID: ${entryId} ---`);

  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    console.error("Помилка видалення: Користувач не авторизований.");
    return { error: "Ви не авторизовані" };
  }

  try {
    const { error } = await (
      await supabase
    )
      .from("food_entries")
      .delete()
      .eq("user_id", user.id) // Дуже важливо: перевіряємо, що користувач видаляє СВІЙ запис
      .eq("id", entryId);

    if (error) {
      console.error("ПОМИЛКА ВИДАЛЕННЯ З SUPABASE:", error);
      return { error: "Помилка бази даних: " + error.message };
    }

    revalidatePath("/dashboard");
    console.log("--- Запис успішно видалено! ---");
    return { success: "Запис видалено!" };
  } catch (e) {
    console.error("КРИТИЧНА ПОМИЛКА В ЕКШЕНІ deleteFoodEntry:", e);
    if (e instanceof Error) {
      return { error: `Невідома помилка на сервері: ${e.message}` };
    }
    return { error: "Невідома помилка на сервері." };
  }
}
