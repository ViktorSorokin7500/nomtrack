"use client";
import { useEffect } from "react";
import { Card } from "../shared";
import { BodyMeasurements } from "./body-measurements";

// import { MealCategory } from "./meal-category";

interface Day {
  date: string;
  fullDate: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  sugar: number;
  water: number;
  weight: number;
  belly: number;
  waist: number;
}

interface DailyDetailModalProps {
  day: Day;
  onClose: () => void;
}

export function DailyDetailModal({ day, onClose }: DailyDetailModalProps) {
  const proteinGoal = 120;
  const fatGoal = 70;
  const carbsGoal = 250;
  const sugarGoal = 30;
  const waterGoal = 3500;

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-orange-50 px-2 bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
      <Card className="w-full max-w-4xl max-h-[98vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {day.date}, {new Date(day.fullDate).getFullYear()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="close"
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
                    style={{
                      width: `${
                        (proteinGoal > day.protein
                          ? day.protein / proteinGoal
                          : 1) * 100
                      }%`,
                    }}
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
                    style={{
                      width: `${
                        (fatGoal > day.fats ? day.fats / fatGoal : 1) * 100
                      }%`,
                    }}
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
                    style={{
                      width: `${
                        (carbsGoal > day.carbs ? day.carbs / carbsGoal : 0) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {Math.round((day.carbs / carbsGoal) * 100)}% ofDailyGoal
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">sugar</span>
                  <span className="font-bold text-gray-800">{day.sugar}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-stone-400 h-2 rounded-full"
                    style={{
                      width: `${
                        (sugarGoal > day.sugar ? day.sugar / sugarGoal : 1) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {Math.round((day.sugar / sugarGoal) * 100)}% ofDailyGoal
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">water</span>
                  <span className="font-bold text-gray-800">{day.water}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full"
                    style={{
                      width: `${
                        (waterGoal > day.water ? day.water / waterGoal : 1) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {Math.round((day.water / waterGoal) * 100)}% ofDailyGoal
                </div>
              </div>
            </div>
          </Card>
          <BodyMeasurements
            weight={day.weight}
            belly={day.belly}
            waist={day.waist}
          />
        </div>
        {/* <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">meals</h3>
          <div className="space-y-4">
            {day.meals && day.meals.length > 0 ? (
              day.meals.map((meal, index) => (
                <MealCategory
                  key={index}
                  type={meal.type}
                  cal={meal.cal}
                  protein={meal.protein}
                  carbs={meal.carbs}
                  fat={meal.fat}
                />
              ))
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                <p>noMealData</p>
              </div>
            )}
          </div>
        </div> */}
      </Card>
    </div>
  );
}
