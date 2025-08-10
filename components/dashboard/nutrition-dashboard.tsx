"use client";

import { Card } from "../shared";
import { ProgressRing } from "./progress-ring";
import { ProgressBar } from "./progress-bar";
import { MealCard } from "./meal-card";
import { FoodEntryCard } from "./food-entry-card";
import { UserRecipe } from "@/types";

// Тип для одного запису їжі, що приходить з сервера
type FoodEntry = {
  id: number;
  meal_type: string;
  entry_text: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  sugar_g: number;
};

// Типи для пропсів, які компонент отримує від сторінки
interface NutritionDashboardProps {
  summaryData: {
    calories: {
      consumed: number;
      burned: number;
      target: number;
    };
    macros: {
      protein: { current: number; target: number };
      carbs: { current: number; target: number };
      fat: { current: number; target: number };
      sugar: { current: number; target: number };
    };
  };
  foodLogData: FoodEntry[];
  userRecipes: UserRecipe[];
}

const MAIN_MEALS = ["breakfast", "lunch", "dinner"];

export function NutritionDashboard({
  summaryData,
  foodLogData,
  userRecipes,
}: NutritionDashboardProps) {
  // Визначаємо, які основні прийоми їжі вже були додані сьогодні
  const loggedMealTypes = foodLogData.map((entry) => entry.meal_type);

  // Формуємо динамічний список доступних опцій для випадаючого меню
  const availableMealTypes = [
    { value: "snack", label: "Snack" }, // Снек доступний завжди
    ...MAIN_MEALS.filter((meal) => !loggedMealTypes.includes(meal)) // Залишаємо тільки ті, яких ще не було
      .map((meal) => ({
        value: meal,
        label: meal.charAt(0).toUpperCase() + meal.slice(1), // Робимо першу літеру великою
      })),
  ];

  return (
    <Card className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">Food Log</h1>
        <p className="text-gray-500 font-light">
          Track meals to follow your progress
        </p>
      </header>

      {/* Блок з прогресом, що використовує реальні дані */}
      <Card className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-light text-gray-700 mb-4">
          Today&apos;s Summary
        </h2>
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <ProgressRing
            current={summaryData.calories.consumed}
            target={summaryData.calories.target}
          />
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  Protein
                </span>
                <span className="text-sm text-gray-600">
                  {summaryData.macros.protein.current}g /{" "}
                  {summaryData.macros.protein.target}g
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.protein.current}
                target={summaryData.macros.protein.target}
                color="bg-yellow-400"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Carbs</span>
                <span className="text-sm text-gray-600">
                  {summaryData.macros.carbs.current}g /{" "}
                  {summaryData.macros.carbs.target}g
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.carbs.current}
                target={summaryData.macros.carbs.target}
                color="bg-green-400"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Fat </span>
                <span className="text-sm text-gray-600">
                  {summaryData.macros.fat.current}g /{" "}
                  {summaryData.macros.fat.target}g
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.fat.current}
                target={summaryData.macros.fat.target}
                color="bg-orange-400"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Sugar</span>
                <span className="text-sm text-gray-600">
                  {summaryData.macros.sugar.current}g /{" "}
                  {summaryData.macros.sugar.target}g
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.sugar.current}
                target={summaryData.macros.sugar.target}
                color="bg-sky-300"
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {/* Рендеримо вже існуючі записи, якщо вони є */}
        {foodLogData.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
              Today&apos;s Log
            </h3>
            {foodLogData.map((entry) => (
              <FoodEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Завжди показуємо одну універсальну картку для додавання нового запису */}
        <MealCard
          availableMealTypes={availableMealTypes}
          userRecipes={userRecipes}
        />
      </div>
    </Card>
  );
}
