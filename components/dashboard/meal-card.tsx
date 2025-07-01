"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MealCardProps {
  mealName: string;
  calories: number;
  macros: { protein: number; carbs: number; fat: number };
  headerColor: string;
  isSnack?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function MealCard({
  mealName,
  calories,
  macros,
  headerColor,
  isSnack,
  onRemove,
  className,
}: MealCardProps) {
  const [foodDescription, setFoodDescription] = useState("");
  const [results, setResults] = useState({
    calories: calories || 0,
    protein: macros?.protein || 0,
    fat: macros?.fat || 0,
    carbs: macros?.carbs || 0,
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodDescription.trim()) {
      alert("Please enter a meal description");
      return;
    }
    console.log(`Analyzing ${mealName}:`, foodDescription);
    // Заглушка для API-запиту
    setResults({
      calories: calories || 0,
      protein: macros?.protein || 0,
      fat: macros?.fat || 0,
      carbs: macros?.carbs || 0,
    });
    setFoodDescription("");
  };

  const handleClear = () => {
    setFoodDescription("");
    setResults({ calories: 0, protein: 0, fat: 0, carbs: 0 });
    console.log(`Cleared ${mealName}`);
  };

  return (
    <div
      className={cn(
        "meal-card bg-white rounded-xl shadow-sm overflow-hidden",
        className
      )}
    >
      <div
        className={`px-6 py-3 flex justify-between items-center ${headerColor}`}
      >
        <h3 className="text-lg font-medium text-gray-700">{mealName}</h3>
        {isSnack && onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="p-6">
        <textarea
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 text-gray-700 focus:outline-none focus:border-green-300"
          rows={2}
          placeholder={`Describe your ${mealName.toLowerCase()} (e.g., '${
            mealName === "Snack"
              ? "Greek yogurt with honey and berries"
              : mealName === "Breakfast"
              ? "Two eggs, avocado toast with olive oil, orange juice"
              : mealName === "Lunch"
              ? "Chicken salad with olive oil dressing, whole grain bread"
              : "Grilled salmon, steamed vegetables, quinoa"
          }')`}
          data-meal={mealName.toLowerCase()}
        ></textarea>

        <div className="flex justify-between mb-4">
          <button
            onClick={handleAnalyze}
            className="bg-green-300 hover:bg-opacity-80 text-gray-700 px-4 py-2 rounded-lg font-medium focus:outline-none"
          >
            Analyze
          </button>
          <button
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg font-medium focus:outline-none"
          >
            Clear
          </button>
        </div>

        <div className={results.calories > 0 ? "" : "hidden"}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-gray-500">Calories</span>
                <span className="text-sm font-medium text-gray-700">
                  {results.calories} kcal
                </span>
              </div>
              <div className="h-2 bg-stone-100 overflow-hidden rounded-sm">
                <div
                  className="h-full rounded-sm transition-all duration-500 bg-orange-200"
                  style={{ width: `${(results.calories / 2000) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-gray-500">Protein</span>
                <span className="text-sm font-medium text-gray-700">
                  {results.protein}g
                </span>
              </div>
              <div className="h-2 bg-stone-100 overflow-hidden rounded-sm">
                <div
                  className="h-full rounded-sm transition-all duration-500 bg-green-300"
                  style={{ width: `${(results.protein / 120) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-gray-500">Fat</span>
                <span className="text-sm font-medium text-gray-700">
                  {results.fat}g
                </span>
              </div>
              <div className="h-2 bg-stone-100 overflow-hidden rounded-sm">
                <div
                  className="h-full rounded-sm transition-all duration-500 bg-yellow-200"
                  style={{ width: `${(results.fat / 70) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-gray-500">Carbs</span>
                <span className="text-sm font-medium text-gray-700">
                  {results.carbs}g
                </span>
              </div>
              <div className="h-2 bg-stone-100 overflow-hidden rounded-sm">
                <div
                  className="h-full rounded-sm transition-all duration-500 bg-sky-200"
                  style={{ width: `${(results.carbs / 250) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
