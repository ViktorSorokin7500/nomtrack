"use client";
import { Card } from "../shared";
import { useEffect } from "react";
import Chart from "chart.js/auto";
import { DoughnutController, ArcElement, Legend, Tooltip } from "chart.js";
import { MealCategory } from "./meal-category";
import { Dish } from "./nutrition-archive";

// Регистрация компонентов Chart.js
Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

interface Day {
  date: string;
  fullDate: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  meals?: Array<{
    type: string;
    dishes: Dish[];
  }>;
}

interface DailyDetailModalProps {
  day: Day;
  onClose: () => void;
}

export function DailyDetailModal({ day, onClose }: DailyDetailModalProps) {
  const proteinGoal = 120; // Пример целевых значений
  const fatGoal = 70;
  const carbsGoal = 250;

  useEffect(() => {
    const ctx = document.getElementById("macro-chart") as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["protein", "fat", "carbs"],
        datasets: [
          {
            data: [day.protein, day.fats, day.carbs],
            backgroundColor: ["#3B82F6", "#F59E0B", "#10B981"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });

    return () => chart.destroy();
  }, [day]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {day.date}, {new Date(day.fullDate).getFullYear()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label={"close"}
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              dailySummary
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">totalCalories</span>
                  <span className="font-bold text-gray-800">
                    {day.calories} kcal
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">protein</span>
                  <span className="font-bold text-gray-800">
                    {day.protein}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(day.protein / proteinGoal) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {Math.round((day.protein / proteinGoal) * 100)}% ofDailyGoal
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">fat</span>
                  <span className="font-bold text-gray-800">{day.fats}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(day.fats / fatGoal) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {Math.round((day.fats / fatGoal) * 100)}% ofDailyGoal
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">carbs</span>
                  <span className="font-bold text-gray-800">{day.carbs}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(day.carbs / carbsGoal) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {Math.round((day.carbs / carbsGoal) * 100)}% ofDailyGoal
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-5 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              macroDistribution
            </h3>
            <div className="h-64">
              <canvas id="macro-chart" />
            </div>
          </Card>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">meals</h3>
          <div className="space-y-4">
            {day.meals && day.meals.length > 0 ? (
              day.meals.map((meal, index) => (
                <MealCategory
                  key={index}
                  type={meal.type}
                  dishes={meal.dishes}
                />
              ))
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                <p>noMealData</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
