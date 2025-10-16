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
import {
  Ingredient,
  NutritionInfo,
  RawSavedFoodData,
  SavedFoodItem,
} from "@/types";
import { revalidatePath } from "next/cache";
import { ACTIONS_TEXTS } from "@/components/shared/(texts)/actions-texts";

export async function analyzeAndSaveFoodEntry(formData: {
  text: string;
  mealType: string;
}) {
  const { text, mealType } = formData;
  if (!text.trim()) return { error: ACTIONS_TEXTS.DESCRIPTION_EMPTY };

  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
    await checkCreditsAndDeduct(user.id, AI_REQUEST, supabase);
    const ingredientPrompt = promptWithIngredients(text);

    const { data, error } = await getAiJsonResponse<{
      ingredients: Ingredient[];
    }>(ingredientPrompt);

    if (error) {
      return { error: ACTIONS_TEXTS.AI_ERROR + error };
    }

    const ingredients = data?.ingredients;
    if (!ingredients || ingredients.length === 0) {
      return { error: ACTIONS_TEXTS.FOOD.NO_INGREDIENTS };
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
        `${
          ACTIONS_TEXTS.FOOD.NUTRITION_ERROR
        } ${await nutritionResponse.text()}`
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
      throw new Error(ACTIONS_TEXTS.ERROR_DB_SAVE + insertError.message);

    revalidatePath("/dashboard");
    return { success: ACTIONS_TEXTS.ADDED_SUCCESS };
  } catch (error) {
    let errorMessage = ACTIONS_TEXTS.SERVER_ERROR;
    if (error instanceof Error) errorMessage = error.message;
    return { error: errorMessage };
  }
}

export async function addManualFoodEntry(entryData: FoodEntryFormSchema) {
  const validationResult = foodEntrySchema.safeParse(entryData);
  if (!validationResult.success) {
    return { error: ACTIONS_TEXTS.FOOD.NO_CORRECT_DATA };
  }

  // Перевіряємо, що ми в правильному режимі
  if (entryData.entry_mode !== "manual") {
    return { error: ACTIONS_TEXTS.FOOD.NOT_IN_MANUAL_MODE };
  }

  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
  } catch (e) {
    let errorMessage = ACTIONS_TEXTS.CHECK_PREMIUM_ERROR;
    if (e instanceof Error) errorMessage = e.message;
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
      // sugar_g,
      weight_eaten,
      servings,
    } = entryData;

    const finalData = {
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      // sugar_g: 0,
    };

    if (calc_mode === "per100g") {
      const multiplier = (weight_eaten || 0) / 100;
      finalData.calories = (calories || 0) * multiplier;
      finalData.protein_g = (protein_g || 0) * multiplier;
      finalData.fat_g = (fat_g || 0) * multiplier;
      finalData.carbs_g = (carbs_g || 0) * multiplier;
      // finalData.sugar_g = (sugar_g || 0) * multiplier;
    } else {
      const servingsCount = servings || 1;
      finalData.calories = (calories || 0) * servingsCount;
      finalData.protein_g = (protein_g || 0) * servingsCount;
      finalData.fat_g = (fat_g || 0) * servingsCount;
      finalData.carbs_g = (carbs_g || 0) * servingsCount;
      // finalData.sugar_g = (sugar_g || 0) * servingsCount;
    }

    const dataToInsert = {
      user_id: user.id,
      entry_text: entry_text,
      meal_type: meal_type,
      calories: Math.round(finalData.calories),
      protein_g: Math.round(finalData.protein_g),
      fat_g: Math.round(finalData.fat_g),
      carbs_g: Math.round(finalData.carbs_g),
      sugar_g: 0,
      water_ml: 0,
    };

    const { error } = await (await supabase)
      .from("food_entries")
      .insert([dataToInsert]);

    if (error) {
      return { error: ACTIONS_TEXTS.ERROR_DB_SAVE + error.message };
    }

    revalidatePath("/dashboard");
    return { success: ACTIONS_TEXTS.ADDED_SUCCESS };
  } catch (e) {
    if (e instanceof Error) {
      return { error: ACTIONS_TEXTS.SERVER_ERROR + e.message };
    }
    return { error: ACTIONS_TEXTS.SERVER_ERROR };
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
    return { error: ACTIONS_TEXTS.FOOD.NOT_ADDED + error.message };
  }

  revalidatePath("/dashboard");
  return {
    success: `${ACTIONS_TEXTS.FOOD.ADDED_START} ${amount} ${ACTIONS_TEXTS.FOOD.ADDED_END}`,
  };
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
      return { error: ACTIONS_TEXTS.FOOD.NO_PRODUCTS_FOUND };
    }

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
    let errorMessage = ACTIONS_TEXTS.CONNOT_CHECK_PREMIUM;
    if (e instanceof Error) errorMessage = e.message;
    return { error: errorMessage };
  }
}

export async function saveGlobalFoodToFavorites(
  foodId: number,
  foodName: string
) {
  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);

    const { error } = await supabase
      .from("user_saved_products")
      .insert([{ user_id: user.id, food_id: foodId }]);

    if (error) {
      if (error.code === "23505") {
        return {
          error: `Продукт "${foodName}" вже збережено у вашому списку.`,
        };
      }
      return { error: ACTIONS_TEXTS.CANNOT_SAVE + error.message };
    }

    revalidatePath("/dashboard");
    return { success: `Продукт "${foodName}" успішно додано до вибраного.` };
  } catch (e) {
    let errorMessage = ACTIONS_TEXTS.CONNOT_CHECK_PREMIUM;
    if (e instanceof Error) errorMessage = e.message;
    return { error: errorMessage };
  }
}

export async function getSavedGlobalFood() {
  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);

    const { data, error } = await supabase.rpc(
      "get_user_saved_products_with_details"
    );

    if (error) {
      if (error.code === "42883") return { success: [] };
      return { error: ACTIONS_TEXTS.FOOD.NO_PRODUCTS_FOUND };
    }

    const formattedData: SavedFoodItem[] = (
      data || ([] as RawSavedFoodData[])
    ).map((item: RawSavedFoodData) => ({
      id: item.id,
      name: item.name,
      calories: item.calories,
      protein: item.protein,
      fat: item.fat,
      carbs: item.carbs,
      is_favorite: true,
    }));

    return { success: formattedData };
  } catch (e) {
    let errorMessage = ACTIONS_TEXTS.CONNOT_CHECK_PREMIUM;
    if (e instanceof Error) errorMessage = e.message;
    return { error: errorMessage };
  }
}

async function _deleteUserEntry(table: string, idKey: string, idValue: number) {
  const { supabase, user } = await getAuthUserOrError();

  try {
    const { error } = await (await supabase)
      .from(table)
      .delete()
      .eq("user_id", user.id)
      .eq(idKey, idValue);

    if (error) {
      return { error: ACTIONS_TEXTS.ERROR_DB_SAVE + error.message };
    }

    revalidatePath("/dashboard");
    return { success: ACTIONS_TEXTS.DELETE_SUCCESS };
  } catch (e) {
    let errorMessage = ACTIONS_TEXTS.SERVER_ERROR;
    if (e instanceof Error) errorMessage = e.message;
    return { error: errorMessage };
  }
}

export async function deleteSavedGlobalFood(foodId: number) {
  return _deleteUserEntry("user_saved_products", "food_id", foodId);
}

export async function deleteFoodEntry(entryId: number) {
  return _deleteUserEntry(
    "food_entries",
    "id", // Стандартний ключ 'id'
    entryId
  );
}
