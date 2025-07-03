"use client";
import { useState, useEffect } from "react";
import { Card } from "../shared";

interface PhysicalActivity {
  name: string;
  description: string;
  calories: number;
}

interface FoodLog {
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

// Based on your recent protein intake, I recommend adding more lean protein sources to your lunch. This will help support your muscle gain goals.

export function AICoachCard({ foodLogData = [] }: { foodLogData?: FoodLog[] }) {
  const [activities, setActivities] = useState<PhysicalActivity[]>([]);
  const [inputText, setInputText] = useState("");
  const [dailyData, setDailyData] = useState<{
    activities: PhysicalActivity[];
    foodLog: FoodLog[];
    date: string;
  }>({
    activities: [],
    foodLog: foodLogData,
    date: new Date().toLocaleDateString(),
  });

  // Заглушка для ИИ: считает калории по описанию
  const estimateCaloriesBurned = (description: string): number => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("бег")) return 300;
    if (lowerDesc.includes("ходьба")) return 150;
    if (lowerDesc.includes("велосипед")) return 200;
    if (lowerDesc.includes("плавание")) return 250;
    return 100; // По умолчанию
  };

  const handleAddActivity = () => {
    if (inputText.trim()) {
      const newActivityNumber = activities.length
        ? Math.max(
            ...activities.map((act, i) =>
              parseInt(act.name.split(" ")[2] || `${i + 1}`)
            )
          ) + 1
        : 1;
      const newActivity = {
        name: `Физическая нагрузка ${newActivityNumber}`,
        description: inputText,
        calories: estimateCaloriesBurned(inputText),
      };
      setActivities((prev) => [...prev, newActivity]);
      setDailyData((prev) => ({
        ...prev,
        activities: [...prev.activities, newActivity],
      }));
      setInputText("");
    }
  };

  const handleRemoveActivity = (index: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
    setDailyData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  // Сброс данных после 23:59
  // useEffect(() => {
  //   const checkReset = () => {
  //     const now = new Date();
  //     const currentDate = now.toLocaleDateString();
  //     if (currentDate !== dailyData.date) {
  //       setActivities([]);
  //       setDailyData({
  //         activities: [],
  //         foodLog: foodLogData, // Сохраняем еду из пропса
  //         date: currentDate,
  //       });
  //     }
  //   };

  //   const interval = setInterval(checkReset, 60000); // Проверка каждую минуту
  //   return () => clearInterval(interval);
  // }, [dailyData.date, foodLogData]);

  // // Обновление еды, если foodLogData меняется
  // useEffect(() => {
  //   setDailyData((prev) => ({
  //     ...prev,
  //     foodLog: foodLogData || [],
  //   }));
  // }, [foodLogData]);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-stone-900">AI Тренер</h2>
        <div className="bg-yellow-200 text-xs font-medium text-stone-900 px-2 py-1 rounded-full">
          Питание и тренировки
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div className="bg-gray-100 rounded-xl rounded-tl-none p-4">
          <p className="text-sm text-gray-700">
            Based on your recent protein intake, I recommend adding more lean
            protein sources to your lunch. This will help support your muscle
            gain goals.
          </p>
        </div>
      </div>

      <div id="activities-container" className="space-y-4 mb-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                {activity.name}
              </h3>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-sm text-gray-500">
                {activity.calories} ккал потрачено
              </p>
            </div>
            <button
              onClick={() => handleRemoveActivity(index)}
              className="cursor-pointer text-red-500 hover:text-red-700 font-medium text-sm"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <input
          type="text"
          placeholder="Введите описание активности (например, Бег 30 мин)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-green-200"
        />
        <button
          onClick={handleAddActivity}
          className="cursor-pointer bg-yellow-200 hover:bg-yellow-300 text-stone-900 px-4 py-2 border-4 border-yellow-300 rounded-r-full transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </Card>
  );
}
