"use client";
import { FoodItem } from "./food-item";
import { useState } from "react";

interface Meal {
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
}

interface MealSectionProps {
  meal: Meal;
  icon: React.ReactNode;
}

export function MealSection({ meal, icon }: MealSectionProps) {
  const [foodDescription, setFoodDescription] = useState("");

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodDescription.trim()) {
      alert("emptyDescription");
      return;
    }
    console.log("Sending to AI for analysis:", foodDescription);
    // Заглушка для отправки в ИИ
    // Например: await fetch("/api/analyze-food", { method: "POST", body: JSON.stringify({ description: foodDescription }) });
    setFoodDescription(""); // Очистить поле после отправки
  };

  const handleAddFood = () => {
    console.log("Add food clicked");
    // Заглушка для добавления еды
    setFoodDescription("");
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-gray-200">{icon}</div>
          <h3 className="font-medium text-stone-900">{meal.name}</h3>
        </div>
        <div className="text-sm text-gray-500">
          {meal.calories} cal {meal.isPlanned && "(planned)"}
        </div>
      </div>

      {meal.foods.length > 0 ? (
        <div className="space-y-3">
          {meal.foods.map((food, index) => (
            <FoodItem key={index} {...food} />
          ))}
        </div>
      ) : (
        <form
          onSubmit={handleAnalyze}
          className="bg-white rounded-xl p-6 shadow-md text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h4 className="font-medium text-gray-600 mb-1">planDinner</h4>
          <p className="text-sm text-gray-500 mb-4">addFoods</p>
          <textarea
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            placeholder="describeFood"
            className="w-full h-24 border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-200 resize-none"
            aria-label="describeFood"
          />
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={handleAddFood}
              className="bg-green-200 hover:bg-green-300 text-stone-900 px-4 py-2 rounded-full text-sm transition-all"
            >
              addFood
            </button>
            <button
              type="submit"
              className="bg-orange-200 hover:bg-orange-300 text-stone-900 px-4 py-2 rounded-full text-sm transition-all"
            >
              analyze
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
