"use server";

import { revalidatePath } from "next/cache";
import {
  type FoodEntryFormSchema,
  foodEntrySchema,
  nutritionTargetsSchema,
  personalInfoSchema,
} from "@/lib/validators";
import {
  AiRecipeResponse,
  AiWorkoutResponse,
  DailySummary,
  Ingredient,
  NormalizedIngredient,
  NutritionInfo,
  Profile,
  TotalNutrition,
  WorkoutPlan,
} from "@/types";
import {
  promptWithActivity,
  promptWithIngredients,
  promptWithMonthlyReport,
  promptWithRecipe,
  promptWithSingleWorkout,
  promptWithWorkoutPlan,
} from "@/lib/prompts";
import { getAiJsonResponse } from "@/lib/utils";
import { AiReportData } from "@/components/archive/report-display";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supabase = SupabaseClient<any, "public", any>;
const AI_REQUEST = 1;
const AI_ANALYZE = 5;

export async function getAuthUserOrError() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) throw new Error("Ви не авторизовані");
  return { supabase: await supabase, user };
}

export async function checkPremiumStatus(user_id: string, supabase: Supabase) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("premium_expires_at")
    .eq("id", user_id)
    .single();

  if (error) {
    throw new Error("Не вдалося перевірити статус підписки.");
  }

  // Перевіряємо, чи підписка існує і чи вона ще не вичерпана
  if (
    !profile?.premium_expires_at ||
    new Date(profile.premium_expires_at) < new Date()
  ) {
    throw new Error("Ваша підписка вичерпана. Будь ласка, оновіть її.");
  }
}

export async function checkCreditsAndDeduct(
  user_id: string,
  cost: number,
  supabase: Supabase
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("ai_credits_left")
    .eq("id", user_id)
    .single();

  if (error) {
    throw new Error("Не вдалося перевірити кількість токенів.");
  }

  if ((profile?.ai_credits_left || 0) < cost) {
    throw new Error(
      `Недостатньо токенів. Потрібно: ${cost}, доступно: ${
        profile?.ai_credits_left || 0
      }.`
    );
  }

  const newCredits = (profile?.ai_credits_left || 0) - cost;
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ ai_credits_left: newCredits })
    .eq("id", user_id);

  if (updateError) {
    throw new Error("Не вдалося оновити кількість токенів.");
  }
}

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

// Нова Server Action для оновлення харчових цілей
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

export async function analyzeAndSaveFoodEntry(formData: {
  text: string;
  mealType: string;
}) {
  const { text, mealType } = formData;
  if (!text.trim()) return { error: "Текст не може бути порожнім" };

  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
    await checkCreditsAndDeduct(user.id, AI_REQUEST, supabase);
    const ingredientPrompt = promptWithIngredients(text);

    const { data, error } = await getAiJsonResponse<{
      ingredients: Ingredient[];
    }>(ingredientPrompt);

    if (error) {
      return { error: `Помилка аналізу ШІ: ${error}` };
    }

    const ingredients = data?.ingredients;
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
  const { supabase, user } = await getAuthUserOrError();

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

export async function addManualFoodEntry(entryData: FoodEntryFormSchema) {
  const validationResult = foodEntrySchema.safeParse(entryData);
  if (!validationResult.success) {
    console.error("Помилка серверної валідації:", validationResult.error);
    return { error: "Некоректні дані, надіслані на сервер." };
  }

  // Перевіряємо, що ми в правильному режимі
  if (entryData.entry_mode !== "manual") {
    return { error: "Неправильний режим для цього екшену" };
  }

  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
  } catch (e) {
    let errorMessage = "Не вдалося перевірити підписку.";
    if (e instanceof Error) errorMessage = e.message;
    console.error("Помилка перевірки підписки в addManualFoodEntry:", e);
    return { error: errorMessage };
  }

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

    const { error } = await (await supabase)
      .from("food_entries")
      .insert([dataToInsert]);

    if (error) {
      console.error("ПОМИЛКА ЗАПИСУ В SUPABASE:", error);
      return { error: "Помилка бази даних: " + error.message };
    }

    revalidatePath("/dashboard");
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

  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
    await checkCreditsAndDeduct(user.id, AI_REQUEST, supabase);
    const initialIngredientLines = ingredientsText
      .split(/,|\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (initialIngredientLines.length === 0) {
      return { error: "Список інгредієнтів порожній або некоректний." };
    }

    // Крок 1: Робимо запит до ШІ з нашим безпечним типом AiRecipeResponse
    const batchPrompt = promptWithRecipe(initialIngredientLines.join("\n"));
    const { data: aiData, error: aiError } =
      await getAiJsonResponse<AiRecipeResponse>(batchPrompt);

    if (aiError) {
      return { error: `Помилка аналізу ШІ: ${aiError}` };
    }

    // Крок 2: Визначаємо масив інгредієнтів, незалежно від формату відповіді ШІ
    let normalizedIngredients: NormalizedIngredient[];

    if (aiData === null) {
      // Спочатку перевіряємо на null, щоб уникнути помилок
      throw new Error("ШІ повернув порожню відповідь (null).");
    }

    if (Array.isArray(aiData)) {
      // Випадок 1: ШІ повернув просто масив [...]
      // Тут все безпечно, TypeScript знає, що aiData - це масив.
      normalizedIngredients = aiData;
    } else {
      // Випадок 2: ШІ повернув об'єкт {...}
      // TypeScript тепер знає, що aiData - це об'єкт, а не null.

      // Шукаємо назву ключа, за яким знаходиться масив
      const arrayKey = Object.keys(aiData).find((key) =>
        Array.isArray(aiData[key])
      );

      if (arrayKey) {
        // Якщо ключ знайдено, безпечно отримуємо масив за цим ключем.
        // Завдяки індексній сигнатурі в типі ця помилка зникає.
        normalizedIngredients = aiData[arrayKey];
      } else {
        // Якщо в об'єкті немає жодного масиву
        throw new Error("Не вдалося знайти масив інгредієнтів у відповіді ШІ.");
      }
    }

    if (!normalizedIngredients || normalizedIngredients.length === 0) {
      return {
        error: "Не вдалося розпізнати інгредієнти у вашому запиті.",
      };
    }

    // Крок 3: Отримуємо дані про харчування для кожного інгредієнта
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

    // Крок 4: Підсумовуємо всі поживні речовини
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

    // Крок 5: Розраховуємо значення на 100г і готуємо дані для збереження
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

    // Крок 6: Зберігаємо рецепт в базу даних
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
    console.error("Повна помилка в createAndAnalyzeRecipe:", error);
    return { error: errorMessage };
  }
}

export async function deleteRecipe(recipeId: string) {
  if (!recipeId) {
    return { error: "ID рецепта не вказано." };
  }

  const { supabase, user } = await getAuthUserOrError();

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
  const { supabase, user } = await getAuthUserOrError();

  try {
    const { error } = await (await supabase)
      .from("food_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("id", entryId);

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

export async function searchGlobalFood(searchTerm: string) {
  if (!searchTerm || searchTerm.length < 2) {
    return { success: [] };
  }

  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
    const { data, error } = await supabase.rpc("search_products", {
      search_term: searchTerm,
    });

    if (error) {
      console.error("Помилка пошуку в БД:", error);
      return { error: "Не вдалося знайти продукти. Спробуйте пізніше." };
    }

    // Прибираємо зайві дані, залишаємо тільки потрібні поля
    const formattedData = data.map(
      (item: {
        id: number;
        name: string;
        calories: number | null;
        protein: number | null;
        fat: number | null;
        carbs: number | null;
      }) => ({
        id: item.id,
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        fat: item.fat,
        carbs: item.carbs,
      })
    );

    return { success: formattedData };
  } catch (e) {
    let errorMessage = "Не вдалося перевірити підписку.";
    if (e instanceof Error) errorMessage = e.message;
    console.error("Повна помилка в searchGlobalFood:", e);
    // ЗМІНА: Повертаємо об'єкт з помилкою
    return { error: errorMessage };
  }
}

export async function analyzeMonthlyData(
  daysData: DailySummary[],
  userProfile: Profile
) {
  const prompt = promptWithMonthlyReport(daysData, userProfile);
  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
    await checkCreditsAndDeduct(user.id, AI_ANALYZE, supabase);

    const { data: reportData, error } = await getAiJsonResponse<AiReportData>(
      prompt
    );

    if (error) {
      return { error: `Помилка аналізу ШІ: ${error}` };
    }

    // ЗМІНА: ПЕРЕВІРЯЄМО, ЧИ ДАНІ ПРИЙШЛИ
    if (!reportData) {
      return { error: "ШІ не повернув звіт." };
    }

    // ЗМІНА: ПОВЕРТАЄМО ПОВНИЙ ОБ'ЄКТ
    return { success: reportData };
  } catch (e) {
    console.error("Помилка в analyzeMonthlyData:", e);
    const errorMessage =
      e instanceof Error ? e.message : "Невідома помилка на сервері.";
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
