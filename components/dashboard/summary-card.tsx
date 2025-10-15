"use client";

import { useState, useTransition } from "react";
import { Card } from "../shared";
import { Button, SimpleRiseSpinner } from "../ui";
import { addWeightEntry } from "@/app/actions"; // Імпортуємо нову дію
import toast from "react-hot-toast";
import { DASHBOARD_TEXTS } from "./dashboard-text";

interface SummaryCardProps {
  currentWeight: number | null;
}

export function SummaryCard({ currentWeight }: SummaryCardProps) {
  const [weightInput, setWeightInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddWeight = () => {
    const weightValue = parseFloat(weightInput);
    if (!weightValue || weightValue <= 0) {
      toast.error(DASHBOARD_TEXTS.SUMMARY_CARD.TOAST_ERROR);
      return;
    }

    startTransition(async () => {
      const result = await addWeightEntry(weightValue);
      if (result?.error) {
        toast.success("Error: " + result.error);
      } else {
        setWeightInput("");
        toast.success(
          result.success || DASHBOARD_TEXTS.SUMMARY_CARD.TOAST_SUCCESS
        );
      }
    });
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-stone-900">
          {DASHBOARD_TEXTS.SUMMARY_CARD.TITLE}
        </h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("uk-UA")}
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-green-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="bg-green-200 rounded-full p-2 mr-3" />
            <div className="flex-1">
              <h4 className="font-medium text-stone-900">
                {DASHBOARD_TEXTS.SUMMARY_CARD.WEIGHT_PROGRESS}
              </h4>
              <div className="text-xs text-gray-600 mt-1">
                {DASHBOARD_TEXTS.SUMMARY_CARD.CURRENT_WEIGHT}
                <span className="font-bold ml-1">
                  {currentWeight
                    ? `${currentWeight.toLocaleString("uk-UA")} ${
                        DASHBOARD_TEXTS.SUMMARY_CARD.UNIT_KG
                      }`
                    : DASHBOARD_TEXTS.SUMMARY_CARD.NOT_AVAILABLE}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-medium text-stone-900 mb-3">
          {DASHBOARD_TEXTS.SUMMARY_CARD.ENTER_TODAY_WEIGHT}
        </h3>
        <div className="flex items-end gap-3">
          <div className="flex-grow">
            <label
              htmlFor="weightInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {DASHBOARD_TEXTS.SUMMARY_CARD.WEIGHT} (
              {DASHBOARD_TEXTS.SUMMARY_CARD.UNIT_KG})
            </label>
            <input
              id="weightInput"
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="85.5"
            />
          </div>
          <Button
            onClick={handleAddWeight}
            disabled={isPending}
            className="my-1"
          >
            {isPending ? (
              <SimpleRiseSpinner className="w-[67px]" />
            ) : (
              DASHBOARD_TEXTS.SUMMARY_CARD.SAVE_BUTTON
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
