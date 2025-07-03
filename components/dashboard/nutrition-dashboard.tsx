"use client";
import { useState } from "react";
import { Locale } from "@/i18n.config";
import { MealCard } from "./meal-card";
import { Card } from "../shared";
import { ProgressRing } from "./progress-ring";
import { ProgressBar } from "./progress-bar";

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
    };
  };
  foodLogData: Array<any>; // Поки що any, ми його не використовуємо
  lang: Locale;
}

export function NutritionDashboard({
  summaryData,
  foodLogData,
  lang,
}: NutritionDashboardProps) {
  const [snacks, setSnacks] = useState([
    {
      name: "Snack 1",
      calories: 0,
      macros: { protein: 0, carbs: 0, fat: 0 },
    },
  ]);
  console.log(lang);

  const handleAddSnack = () => {
    setSnacks((prev) => [
      ...prev,
      {
        name: `Snack ${prev.length + 1}`,
        calories: 0,
        macros: { protein: 0, carbs: 0, fat: 0 },
      },
    ]);
  };

  const handleRemoveSnack = (index: number) => {
    setSnacks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          Daily Nutritionss
        </h1>
        <p className="text-gray-500 font-light">
          Track your meals and nutrition intake
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-light text-gray-700 mb-4">
          Daily Progress
        </h2>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-stone-900">Summary</h2>
          <div className="text-sm text-gray-500">June 15, 2023</div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <ProgressRing
            current={summaryData.calories.current}
            target={summaryData.calories.target}
          />
          <div className="flex-1 ml-6 space-y-4">
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
                color="bg-yellow-200"
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
                color="bg-green-200"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Fat</span>
                <span className="text-sm text-gray-600">
                  {summaryData.macros.fat.current}g /{" "}
                  {summaryData.macros.fat.target}g
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.fat.current}
                target={summaryData.macros.fat.target}
                color="bg-orange-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {foodLogData.map((meal, index) => (
          <MealCard
            key={index}
            mealName={meal.name}
            calories={meal.calories}
            macros={{
              protein: meal.foods.reduce(
                (sum, food) => sum + food.macros.protein,
                0
              ),
              carbs: meal.foods.reduce(
                (sum, food) => sum + food.macros.carbs,
                0
              ),
              fat: meal.foods.reduce((sum, food) => sum + food.macros.fat, 0),
            }}
            headerColor={
              meal.name === "Breakfast"
                ? "bg-red-100"
                : meal.name === "Lunch"
                ? "bg-green-200"
                : "bg-yellow-200"
            }
          />
        ))}
        <div id="snacks-container">
          {snacks.map((snack, index) => (
            <MealCard
              key={index}
              mealName={snack.name}
              calories={snack.calories}
              macros={snack.macros}
              headerColor="bg-sky-200"
              isSnack
              onRemove={() => handleRemoveSnack(index)}
              className="mb-4"
            />
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={handleAddSnack}
            className="cursor-pointer bg-white border border-gray-200 hover:border-green-300 text-gray-700 px-6 py-3 rounded-lg font-medium focus:outline-none shadow-sm"
          >
            + Add Snack
          </button>
        </div>
      </div>
    </Card>
  );
}
