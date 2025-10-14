"use server";
import {
  getAuthUserOrError,
  checkPremiumStatus,
  checkCreditsAndDeduct,
} from "@/lib/billing";
import { AI_REQUEST } from "@/lib/const";
import { promptWithRecipe } from "@/lib/prompts";
import { getAiJsonResponse } from "@/lib/ai";
import {
  AiRecipeResponse,
  NormalizedIngredient,
  TotalNutrition,
  NutritionInfo,
} from "@/types";
import { revalidatePath } from "next/cache";
import { ACTIONS_TEXTS } from "@/components/shared/(texts)/actions-texts";

export async function createAndAnalyzeRecipe(formData: {
  recipeName: string;
  ingredientsText: string;
}) {
  const { recipeName, ingredientsText } = formData;

  if (!recipeName.trim() || !ingredientsText.trim()) {
    return { error: ACTIONS_TEXTS.DESCRIPTION_EMPTY };
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
      return { error: ACTIONS_TEXTS.RECIPES.UMPTY_INGREDIENTS };
    }

    // Крок 1: Робимо запит до ШІ з нашим безпечним типом AiRecipeResponse
    const batchPrompt = promptWithRecipe(initialIngredientLines.join("\n"));
    const { data: aiData, error: aiError } =
      await getAiJsonResponse<AiRecipeResponse>(batchPrompt);

    if (aiError) {
      return { error: `${ACTIONS_TEXTS.AI_ERROR} ${aiError}` };
    }

    // Крок 2: ОНОВЛЕНА ЛОГІКА: універсальна обробка відповіді AI
    let normalizedIngredients: NormalizedIngredient[] = [];

    if (!aiData) {
      throw new Error(ACTIONS_TEXTS.RECIPES.UMPTY_AI);
    }

    if (Array.isArray(aiData)) {
      normalizedIngredients = aiData;
    } else if (
      typeof aiData === "object" &&
      "ingredients" in aiData &&
      Array.isArray(aiData.ingredients)
    ) {
      normalizedIngredients = aiData.ingredients;
    } else {
      // Якщо AI повернув один об'єкт, поміщаємо його в масив
      normalizedIngredients = [aiData as unknown as NormalizedIngredient];
    }

    if (!normalizedIngredients || normalizedIngredients.length === 0) {
      return {
        error: ACTIONS_TEXTS.RECIPES.NORMALIZED_ERROR,
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
            `${ACTIONS_TEXTS.RECIPES.CN_ERROR_START} '${item.ingredientName}'${ACTIONS_TEXTS.RECIPES.CN_ERROR_END}`
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
            `${ACTIONS_TEXTS.RECIPES.CN_ERROR_START} '${item.ingredientName}'${ACTIONS_TEXTS.RECIPES.CN_ERROR_END}`
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
      return { error: ACTIONS_TEXTS.RECIPES.WEIGHT_ERROR };
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
      throw new Error(ACTIONS_TEXTS.ERROR_DB_SAVE + insertError.message);
    }

    revalidatePath("/recipes");
    return {
      success: `${ACTIONS_TEXTS.RECIPES.RECIPE_START} "${recipeName}" ${ACTIONS_TEXTS.RECIPES.RECIPE_END}`,
    };
  } catch (error) {
    let errorMessage = ACTIONS_TEXTS.SERVER_ERROR;
    if (error instanceof Error) errorMessage = error.message;
    return { error: errorMessage };
  }
}

export async function deleteRecipe(recipeId: string) {
  if (!recipeId) {
    return { error: ACTIONS_TEXTS.RECIPES.NOT_FOUND_ID };
  }

  const { supabase, user } = await getAuthUserOrError();

  const { error } = await supabase
    .from("user_recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", user.id);

  if (error) {
    return { error: ACTIONS_TEXTS.RECIPES.DELETED_ERROR };
  }

  // Оновлюємо кеш сторінки, щоб список оновився
  revalidatePath("/recipes");

  return { success: ACTIONS_TEXTS.RECIPES.RECEPE_ADD_SUCCESS };
}
