"use client";

import { useState, useTransition } from "react";
import { Modal } from "../ui";
import { deleteRecipe } from "@/app/actions";
import toast from "react-hot-toast";

// Описуємо тип нашого рецепта, щоб TypeScript нам допомагав
type Recipe = {
  id: string;
  recipe_name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
  ingredients_text: string;
  total_weight_g: number;
};

interface RecipeListProps {
  recipes: Recipe[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  // Стан для зберігання даних ВИБРАНОГО рецепта. Якщо null - модальне вікно закрите.
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleDeleteConfirmation = (recipeId: string) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold">
            Ви впевнені, що хочете видалити цей рецепт?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                startTransition(() => {
                  // Викликаємо серверну дію при підтвердженні
                  deleteRecipe(recipeId).then((res) => {
                    if (res.error) {
                      toast.error(res.error); // Показуємо помилку, якщо вона є
                    } else {
                      toast.success(res.success || "Рецепт видалено!"); // Повідомлення про успіх
                    }
                  });
                });
                toast.dismiss(t.id); // Закриваємо поточне сповіщення
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              Так, видалити
            </button>
            <button
              onClick={() => toast.dismiss(t.id)} // Просто закриваємо сповіщення
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Скасувати
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000, // Сповіщення буде висіти 6 секунд, якщо нічого не робити
      }
    );
  };

  return (
    <>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            // Тепер цей div - просто контейнер, без onClick
            <div
              key={recipe.id}
              className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
            >
              {/* Інформація про рецепт */}
              <div className="flex-grow">
                <h3 className="font-bold">{recipe.recipe_name}</h3>
                <p className="text-sm text-gray-500">
                  На 100г: {recipe.calories_per_100g} ккал, Б:{" "}
                  {recipe.protein_per_100g}г, Ж: {recipe.fat_per_100g}г, В:{" "}
                  {recipe.carbs_per_100g}г
                </p>
              </div>

              {/* Контейнер для кнопок дій */}
              <div className="flex items-center ml-4">
                {/* Кнопка "Переглянути" для відкриття модального вікна */}
                <button
                  onClick={() => setSelectedRecipe(recipe)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                  aria-label="Переглянути деталі рецепта"
                >
                  📖
                </button>

                {/* Кнопка видалення */}
                <button
                  onClick={() => handleDeleteConfirmation(recipe.id)}
                  disabled={isPending}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors"
                  aria-label="Видалити рецепт"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            У вас ще немає збережених рецептів.
          </p>
        )}
      </div>

      {/* Модальне вікно, яке рендериться, тільки якщо рецепт вибрано */}
      <Modal isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)}>
        {selectedRecipe && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{selectedRecipe.recipe_name}</h2>

            <div>
              <h4 className="font-semibold">Поживна цінність (на 100г):</h4>
              <p className="text-gray-700">
                {selectedRecipe.calories_per_100g} ккал | Б:{" "}
                {selectedRecipe.protein_per_100g}г | Ж:{" "}
                {selectedRecipe.fat_per_100g}г | В:{" "}
                {selectedRecipe.carbs_per_100g}г
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Загальна вага страви:{" "}
              <strong>{selectedRecipe.total_weight_g} г</strong>
            </p>

            <div>
              <h4 className="font-semibold">Склад:</h4>
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
