// components/dashboard/WaterTrackerCard.tsx

"use client";

import { useOptimistic, useTransition } from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { addWaterEntry } from "@/app/actions";

interface WaterTrackerProps {
  currentWater: number;
  targetWater: number;
}

const waterAmounts = [100, 150, 200, 250];

export function WaterTrackerCard({
  currentWater,
  targetWater,
}: WaterTrackerProps) {
  const [isPending, startTransition] = useTransition();

  // Ініціалізуємо useOptimistic для миттєвого оновлення
  const [optimisticWater, addOptimisticWater] = useOptimistic(
    currentWater,
    (state, amount: number) => state + amount
  );

  const handleAddWater = async (amount: number) => {
    // Миттєво оновлюємо UI
    startTransition(() => {
      addOptimisticWater(amount);
    });

    // У фоні відправляємо запит на сервер
    await addWaterEntry(amount);
  };

  // Розраховуємо прогрес на основі ОПТИМІСТИЧНОГО значення
  const progressPercent = Math.min((optimisticWater / targetWater) * 100, 100);

  return (
    <Card className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-medium text-stone-900 mb-4">Трекер води</h2>

      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
          {/* Показуємо оптимістичне значення */}
          <span className="text-lg font-bold text-blue-500">
            {optimisticWater.toLocaleString()} мл
          </span>
          <span className="text-sm text-gray-500">
            Ціль: {targetWater.toLocaleString()} мл
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-400 h-2.5 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">Швидко додати:</p>
        <div className="flex justify-center gap-1 sm:gap-2">
          {waterAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => handleAddWater(amount)}
              disabled={isPending}
            >
              +{amount} мл
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
