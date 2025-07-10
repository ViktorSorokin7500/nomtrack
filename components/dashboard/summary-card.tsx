// components/dashboard/SummaryCard.tsx

"use client";

import { useState, useTransition } from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { addWeightEntry } from "@/app/actions"; // Імпортуємо нову дію

interface SummaryCardProps {
  currentWeight: number | null;
}

export function SummaryCard({ currentWeight }: SummaryCardProps) {
  const [weightInput, setWeightInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddWeight = () => {
    const weightValue = parseFloat(weightInput);
    if (!weightValue || weightValue <= 0) {
      alert("Введіть коректну вагу.");
      return;
    }

    startTransition(async () => {
      const result = await addWeightEntry(weightValue);
      if (result?.error) {
        alert("Помилка: " + result.error);
      } else {
        setWeightInput(""); // Очищуємо поле після успішного збереження
        alert(result.success);
      }
    });
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-stone-900">Прогрес ваги</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-green-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="bg-green-200 rounded-full p-2 mr-3">
              {/* SVG icon */}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-stone-900">Weight Tracking</h4>
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
          <Button onClick={handleAddWeight} disabled={isPending}>
            {isPending ? "Збереження..." : "Зберегти"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
