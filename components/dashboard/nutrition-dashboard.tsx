"use client";
import { useState } from "react";
import { Locale } from "@/i18n.config";
import { MealCard } from "./meal-card";
import { Card } from "../shared";
import { ProgressRing } from "./progress-ring";
import { ProgressBar } from "./progress-bar";

interface NutritionDashboardProps {
  summaryData: {
    calories: { current: number; target: number };
    macros: {
      protein: { current: number; target: number };
      carbs: { current: number; target: number };
      fat: { current: number; target: number };
    };
  };
  foodLogData: Array<{
    name: string;
    calories: number;
    foods: Array<{
      name: string;
      description: string;
      calories: number;
      macros: { protein: number; carbs: number; fat: number };
      icon: string;
      iconBg: string;
    }>;
    isPlanned?: boolean;
  }>;
  aiMessages: Array<{
    id: string;
    text: string;
  }>;
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
          Daily Nutrition
        </h1>
        <p className="text-gray-500 font-light">
          Track your meals and nutrition intake
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-light text-gray-700 mb-4">
          Daily Progress
        </h2>
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm text-gray-500">Calories</span>
              <div>
                <span className="text-lg font-medium text-gray-800">
                  {summaryData.calories.current}
                </span>
                <span className="text-sm text-gray-500">
                  {" "}
                  / {summaryData.calories.target} kcal
                </span>
              </div>
            </div>
            <div className="h-2 bg-stone-100 overflow-hidden rounded-sm">
              <div
                className="h-full rounded-sm transition-all duration-500 bg-orange-200"
                style={{
                  width: `${
                    (summaryData.calories.current /
                      summaryData.calories.target) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm text-gray-500">Protein</span>
              <div>
                <span className="text-lg font-medium text-gray-800">
                  {summaryData.macros.protein.current}
                </span>
                <span className="text-sm text-gray-500">
                  {" "}
                  / {summaryData.macros.protein.target}g
                </span>
              </div>
            </div>
            <div className="h-2 bg-stone-100 overflow-hidden rounded-sm">
              <div
                className="h-full rounded-sm transition-all duration-500 bg-green-300"
                style={{
                  width: `${
                    (summaryData.macros.protein.current /
                      summaryData.macros.protein.target) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm text-gray-500">Fat</span>
              <div>
                <span className="text-lg font-medium text-gray-800">
                  {summaryData.macros.fat.current}
                </span>
                <span className="text-sm text-gray-500">
                  {" "}
                  / {summaryData.macros.fat.target}g
                </span>
              </div>
            </div>
            <div className="h-2 bg-stone-100 overflow-hidden rounded-sm">
              <div
                className="h-full rounded-sm transition-all duration-500 bg-yellow-200"
                style={{
                  width: `${
                    (summaryData.macros.fat.current /
                      summaryData.macros.fat.target) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm text-gray-500">Carbs</span>
              <div>
                <span className="text-lg font-medium text-gray-800">
                  {summaryData.macros.carbs.current}
                </span>
                <span className="text-sm text-gray-500">
                  {" "}
                  / {summaryData.macros.carbs.target}g
                </span>
              </div>
            </div>
            <div className="h-2 bg-stone-100 overflow-hidden rounded-sm">
              <div
                className="h-full rounded-sm transition-all duration-500 bg-sky-200"
                style={{
                  width: `${
                    (summaryData.macros.carbs.current /
                      summaryData.macros.carbs.target) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div> */}
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
            />
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={handleAddSnack}
            className="bg-white border border-gray-200 hover:border-green-300 text-gray-700 px-6 py-3 rounded-lg font-medium focus:outline-none shadow-sm"
          >
            + Add Snack
          </button>
        </div>
      </div>
    </Card>
  );
}
