"use client";

import { useState, useTransition } from "react";
import { Modal } from "../ui";
import { deleteRecipe } from "@/app/actions";
import toast from "react-hot-toast";
import { RECIPES_TEXTS } from "./recipes-text";
import { capitalize } from "@/utils/stringExtensions";

type Recipe = {
  id: string;
  recipe_name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
  sugar_per_100g: number;
  ingredients_text: string;
  total_weight_g: number;
};

interface RecipeListProps {
  recipes: Recipe[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleDeleteConfirmation = (recipeId: string) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold">{RECIPES_TEXTS.DELETE_WARNING}</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                startTransition(() => {
                  deleteRecipe(recipeId).then((res) => {
                    if (res.error) {
                      toast.error(res.error);
                    } else {
                      toast.success(
                        res.success || RECIPES_TEXTS.RECIPE_WAS_DELETED
                      );
                    }
                  });
                });
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              {RECIPES_TEXTS.CONFIRM_DELETE}
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {RECIPES_TEXTS.CANCEL}
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
      }
    );
  };

  return (
    <>
      <div className="space-y-4 md:max-h-[500] overflow-y-auto pr-2">
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
            >
              <div className="flex-grow">
                <h3 className="font-bold">{recipe.recipe_name}</h3>
                <p className="text-sm text-gray-500">
                  {capitalize(RECIPES_TEXTS.PER_100G)}: {recipe.total_weight_g}
                  {RECIPES_TEXTS.UNIT_GRAM}: {recipe.calories_per_100g}{" "}
                  {RECIPES_TEXTS.UNIT_KILOCALORIE},{" "}
                  {RECIPES_TEXTS.PROTEIN_SHORT}: {recipe.protein_per_100g}
                  {RECIPES_TEXTS.UNIT_GRAM}, {RECIPES_TEXTS.FAT_SHORT}:{" "}
                  {recipe.fat_per_100g}
                  {RECIPES_TEXTS.UNIT_GRAM}, {RECIPES_TEXTS.CARBOHYDRATE_SHORT}:{" "}
                  {recipe.carbs_per_100g}
                  {RECIPES_TEXTS.UNIT_GRAM},
                  {/* {RECIPES_TEXTS.SUGAR_SHORT}:{" "}
                  {recipe.sugar_per_100g}
                  {RECIPES_TEXTS.UNIT_GRAM} */}
                </p>
              </div>

              <div className="flex items-center ml-4">
                <button
                  onClick={() => setSelectedRecipe(recipe)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                  aria-label="View Recipe Details"
                >
                  📖
                </button>

                <button
                  onClick={() => handleDeleteConfirmation(recipe.id)}
                  disabled={isPending}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors"
                  aria-label="Delete Recipe"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            {RECIPES_TEXTS.NO_RECIPES}
          </p>
        )}
      </div>

      <Modal isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)}>
        {selectedRecipe && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{selectedRecipe.recipe_name}</h2>

            <div>
              <h4 className="font-semibold">
                {RECIPES_TEXTS.NUTRITIONAL_VALUES} ({RECIPES_TEXTS.PER_100G}):
              </h4>
              <p className="text-gray-700">
                {selectedRecipe.calories_per_100g}{" "}
                {RECIPES_TEXTS.UNIT_KILOCALORIE} | {RECIPES_TEXTS.PROTEIN}:{" "}
                {selectedRecipe.protein_per_100g}
                {RECIPES_TEXTS.UNIT_GRAM} | {RECIPES_TEXTS.FAT}:{" "}
                {selectedRecipe.fat_per_100g}
                {RECIPES_TEXTS.UNIT_GRAM} | {RECIPES_TEXTS.CARBOHYDRATE}:{" "}
                {selectedRecipe.carbs_per_100g}
                {RECIPES_TEXTS.UNIT_GRAM}
                {/* | {RECIPES_TEXTS.SUGAR}:{" "}
                {selectedRecipe.sugar_per_100g}
                {RECIPES_TEXTS.UNIT_GRAM} */}
              </p>
            </div>

            <p className="text-sm text-gray-600">
              {RECIPES_TEXTS.TOTAL_WEIGHT_OF_MEAL}
              <strong>
                {selectedRecipe.total_weight_g}
                {RECIPES_TEXTS.UNIT_GRAM}
              </strong>
            </p>

            <div>
              <h4 className="font-semibold">{RECIPES_TEXTS.INGREDIENTS}:</h4>
              <pre className="p-3 bg-gray-100 rounded-md whitespace-pre-wrap text-sm font-sans">
                {selectedRecipe.ingredients_text}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
