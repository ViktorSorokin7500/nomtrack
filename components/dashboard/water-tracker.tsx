"use client";

import { useOptimistic, useTransition, useState } from "react";
import { Card } from "../shared";
import { Button, SimpleRiseSpinner } from "../ui";
import { addWaterEntry } from "@/app/actions";
import toast from "react-hot-toast";
import { DASHBOARD_TEXTS } from "./dashboard-text";

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

  const handleUpdateWater = async (amount: number) => {
    if (optimisticWater + amount < 0) {
      toast.error(DASHBOARD_TEXTS.WATER_TRACKER_CARD.TOAST_ERROR);
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
      handleUpdateWater(amount);
      setCustomAmount("");
    }
  };

  const progressPercent = Math.min((optimisticWater / targetWater) * 100, 100);

  return (
    <Card className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-medium text-stone-900 mb-4">
        {DASHBOARD_TEXTS.WATER_TRACKER_CARD.TITLE}
      </h2>

      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-lg font-bold text-blue-500">
            {optimisticWater.toLocaleString("uk-UA")}{" "}
            {DASHBOARD_TEXTS.WATER_TRACKER_CARD.UNIT_ML}
          </span>
          <span className="text-sm text-gray-500">
            {DASHBOARD_TEXTS.WATER_TRACKER_CARD.GOAL}{" "}
            {targetWater.toLocaleString("uk-UA")}{" "}
            {DASHBOARD_TEXTS.WATER_TRACKER_CARD.UNIT_ML}
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
          <p className="text-sm text-gray-600 mb-2">
            {DASHBOARD_TEXTS.WATER_TRACKER_CARD.QUICK_ADD}
          </p>
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
                {amount > 0 ? `+${amount}` : amount}{" "}
                {DASHBOARD_TEXTS.WATER_TRACKER_CARD.UNIT_ML}
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
              <SimpleRiseSpinner className="bg-blue-500 w-[53px]" />
            ) : (
              DASHBOARD_TEXTS.WATER_TRACKER_CARD.SUBMIT_BUTTON
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
