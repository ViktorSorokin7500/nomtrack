"use client";

import { useOptimistic, useTransition, useState } from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { addWaterEntry } from "@/app/actions";
import toast from "react-hot-toast";

interface WaterTrackerProps {
  currentWater: number;
  targetWater: number;
}

const quickAddAmounts = [-50, 250, 500];

export function WaterTrackerCard({
  currentWater,
  targetWater,
}: WaterTrackerProps) {
  const [isPending, startTransition] = useTransition();
  const [customAmount, setCustomAmount] = useState("");

  const [optimisticWater, addOptimisticWater] = useOptimistic(
    currentWater,
    (state, amount: number) => {
      const newState = state + amount;
      return newState < 0 ? 0 : newState;
    }
  );

  // 1. Централізована функція, яка тепер містить перевірку
  const handleUpdateWater = async (amount: number) => {
    // Ця перевірка тепер працює для ВСІХ кнопок та поля вводу
    if (optimisticWater + amount < 0) {
      toast.error("Water amount cannot be negative.");
      return;
    }

    startTransition(() => {
      addOptimisticWater(amount);
    });

    const result = await addWaterEntry(amount);
    if (result?.error) {
      toast.error(result.error);
    }
  };

  const handleAddCustomAmount = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount !== 0) {
      // 2. Тепер ця функція просто викликає основний обробник
      handleUpdateWater(amount);
      setCustomAmount("");
    }
  };

  const progressPercent = Math.min((optimisticWater / targetWater) * 100, 100);

  return (
    <Card className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-medium text-stone-900 mb-4">
        Відстеження води
      </h2>

      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
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
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Швидко додати:</p>
          <div className="flex justify-center gap-2">
            {quickAddAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => handleUpdateWater(amount)}
                disabled={isPending}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
              >
                {/* 3. Невеличке покращення: додаємо '+' для позитивних значень */}
                {amount > 0 ? `+${amount}` : amount} мл
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="350"
            className="w-full px-4 py-2 border rounded-md text-center"
            disabled={isPending}
          />
          <Button
            onClick={handleAddCustomAmount}
            disabled={isPending || customAmount === ""}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isPending ? (
              <span className="w-[53px] flex items-center justify-center gap-2 animate-pulse">
                <div className="size-1 rounded-full bg-white animate-bounce" />
                <div className="size-1 rounded-full bg-white animate-bounce delay-150" />
                <div className="size-1 rounded-full bg-white animate-bounce delay-300" />
              </span>
            ) : (
              "Додати"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
