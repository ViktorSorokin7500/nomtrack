import { Card } from "../shared";
import { MealSection } from "./meal-section";

interface FoodLogCardProps {
  meals: Array<{
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
}

export function FoodLogCard({ meals }: FoodLogCardProps) {
  const mealIcons = {
    Breakfast: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-stone-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    Lunch: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-stone-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    Dinner: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-stone-900">title</h2>
        <div className="flex space-x-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm transition-all">
            day
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm transition-all">
            week
          </button>
          <button className="bg-orange-200 text-white px-3 py-1 rounded-full text-sm transition-all">
            today
          </button>
        </div>
      </div>

      {meals.map((meal, index) => (
        <MealSection
          key={index}
          meal={meal}
          icon={
            mealIcons[meal.name as keyof typeof mealIcons] ||
            mealIcons.Breakfast
          }
        />
      ))}
    </Card>
  );
}
