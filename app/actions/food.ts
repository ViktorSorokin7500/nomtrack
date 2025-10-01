"use server";
import {
  checkCreditsAndDeduct,
  checkPremiumStatus,
  getAuthUserOrError,
} from "@/lib/billing";
import { AI_REQUEST } from "@/lib/const";
import { promptWithIngredients } from "@/lib/prompts";
import { getAiJsonResponse } from "@/lib/ai";
import { FoodEntryFormSchema, foodEntrySchema } from "@/lib/validators";
import { Ingredient, NutritionInfo } from "@/types";
import { revalidatePath } from "next/cache";

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
