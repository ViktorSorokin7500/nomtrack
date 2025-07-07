"use client";

import { MealCard } from "./meal-card";
import { Card } from "../shared";
import { ProgressRing } from "./progress-ring";
import { ProgressBar } from "./progress-bar";
import { FoodEntryCard } from "./food-entry-card";

// Тип для одного запису їжі, що приходить з сервера
type FoodEntry = {
  id: number;
  created_at: string;
  user_id: string;
  entry_text: string;
  meal_type: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  sugar_g: number;
  water_ml: number;
};

// Типи для пропсів компонента
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
  foodLogData: FoodEntry[];
}

// Визначаємо прийоми їжі, які ми будемо показувати на дашборді
const mealTypes = [
  { name: "Breakfast", color: "bg-red-100" },
  { name: "Lunch", color: "bg-green-200" },
  { name: "Dinner", color: "bg-yellow-200" },
  { name: "Snack", color: "bg-sky-200" },
];

export function NutritionDashboard({
  summaryData,
  foodLogData,
}: NutritionDashboardProps) {
  // Розраховуємо чисті спожиті калорії
  const netCalories =
    summaryData.calories.consumed - summaryData.calories.burned;

  return (
    <Card className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          Щоденник харчування
        </h1>
        <p className="text-gray-500 font-light">
          Записуй прийоми їжі та слідкуй за прогресом
        </p>
      </header>

      {/* Блок з прогресом, що використовує реальні дані */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-light text-gray-700 mb-4">
          Денний прогрес
        </h2>
        <div className="flex items-center justify-between mb-8">
          <ProgressRing
            current={netCalories}
            target={summaryData.calories.target}
          />
          <div className="flex-1 ml-6 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Білки</span>
                <span className="text-sm text-gray-600">
                  {summaryData.macros.protein.current}г /{" "}
                  {summaryData.macros.protein.target}г
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
                <span className="text-sm font-medium text-gray-600">
                  Вуглеводи
                </span>
                <span className="text-sm text-gray-600">
                  {summaryData.macros.carbs.current}г /{" "}
                  {summaryData.macros.carbs.target}г
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
                <span className="text-sm font-medium text-gray-600">Жири</span>
                <span className="text-sm text-gray-600">
                  {summaryData.macros.fat.current}г /{" "}
                  {summaryData.macros.fat.target}г
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
        {/* Динамічно рендеримо блоки для кожного типу їжі */}
        {mealTypes.map((meal) => {
          // Фільтруємо записи, що відповідають поточному типу прийому їжі
          const entriesForMeal = foodLogData.filter(
            (entry) => entry.meal_type === meal.name.toLowerCase()
          );

          return (
            <div key={meal.name}>
              {/* Якщо є збережені записи, показуємо їх */}
              {entriesForMeal.length > 0 && (
                <div className="space-y-2 mb-4">
                  {entriesForMeal.map((entry) => (
                    <FoodEntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              )}

              {/* Завжди показуємо картку-форму для додавання нового запису */}
              <MealCard mealName={meal.name} headerColor={meal.color} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
