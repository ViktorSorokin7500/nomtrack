"use client";

import { Card } from "../shared";
import { ProgressRing } from "./progress-ring";
import { ProgressBar } from "./progress-bar";
import { MealCard } from "./meal-card";
import { FoodEntryCard } from "./food-entry-card";
import { UserRecipe } from "@/types";
import { useState } from "react";

// Тип для одного запису їжі, що приходить з сервера
import type { FoodEntry } from "@/types";

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

export function NutritionDashboard({
  summaryData,
  foodLogData,
  userRecipes,
}: NutritionDashboardProps) {
  const [hoveredMacro, setHoveredMacro] = useState<string | null>(null);

  const getMacroValue = (macro: "protein" | "carbs" | "fat" | "sugar") => {
    const { current, target } = summaryData.macros[macro];
    if (hoveredMacro === macro) {
      const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
      return `${percentage}%`;
    }
    return `${current}g / ${target}g`;
  };
  // Формуємо динамічний список доступних опцій для випадаючого меню
  const availableMealTypes = [
    { value: "breakfast", label: "Сніданок" },
    { value: "lunch", label: "Обід" },
    { value: "dinner", label: "Вечеря" },
    { value: "snack", label: "Перекус" },
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
            {/* Protein */}
            <div
              onMouseEnter={() => setHoveredMacro("protein")}
              onMouseLeave={() => setHoveredMacro(null)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Білки</span>
                <span className="text-sm text-gray-600">
                  {getMacroValue("protein")}
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.protein.current}
                target={summaryData.macros.protein.target}
                color="bg-yellow-400"
              />
            </div>
            {/* Carbs */}
            <div
              onMouseEnter={() => setHoveredMacro("carbs")}
              onMouseLeave={() => setHoveredMacro(null)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  Вуглеводи
                </span>
                <span className="text-sm text-gray-600">
                  {getMacroValue("carbs")}
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.carbs.current}
                target={summaryData.macros.carbs.target}
                color="bg-green-400"
              />
            </div>
            {/* Fat */}
            <div
              onMouseEnter={() => setHoveredMacro("fat")}
              onMouseLeave={() => setHoveredMacro(null)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Жири</span>
                <span className="text-sm text-gray-600">
                  {getMacroValue("fat")}
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.fat.current}
                target={summaryData.macros.fat.target}
                color="bg-orange-400"
              />
            </div>
            {/* Sugar */}
            {/* <div
              onMouseEnter={() => setHoveredMacro("sugar")}
              onMouseLeave={() => setHoveredMacro(null)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Цукор</span>
                <span className="text-sm text-gray-600">
                  {getMacroValue("sugar")}
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.sugar.current}
                target={summaryData.macros.sugar.target}
                color="bg-sky-300"
              />
            </div> */}
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
