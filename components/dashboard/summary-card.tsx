// components/dashboard/SummaryCard.tsx

"use client";

import { useState } from "react";
import { Card } from "../shared";

// 1. Спрощуємо пропси. Тепер нам потрібна лише поточна вага.
interface SummaryCardProps {
  currentWeight: number | null;
}

export function SummaryCard({ currentWeight }: SummaryCardProps) {
  const [weightInput, setWeightInput] = useState("");

  const handleAddWeight = () => {
    if (!weightInput) return;
    console.log("Зберегти нову вагу:", weightInput);
    // TODO: Тут буде виклик Server Action для збереження ваги
    setWeightInput("");
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-stone-900">Прогрес ваги</h2>
        {/* Можна показувати поточну дату */}
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* 2. Прибрали весь блок з калоріями. Залишили лише вагу. */}
      <div className="mb-8">
        <div className="bg-green-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="bg-green-200 rounded-full p-2 mr-3">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-stone-900">Weight Tracking</h4>
              {/* 3. Показуємо реальну поточну вагу з профілю */}
              <div className="text-xs text-gray-600 mt-1">
                Поточна вага:
                <span className="font-bold ml-1">
                  {currentWeight ? `${currentWeight} kg` : "Не вказано"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Форма для введення ваги залишається без змін */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-medium text-stone-900 mb-3">
          Внести сьогоднішню вагу
        </h3>
        <div className="flex items-end gap-3">
          <div className="flex-grow">
            <label
              htmlFor="weightInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Вага (kg)
            </label>
            <input
              id="weightInput"
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Напр., 85.5"
            />
          </div>
          <button
            onClick={handleAddWeight}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Зберегти
          </button>
        </div>
      </div>
    </Card>
  );
}
