"use client";

import { useEffect } from "react";
import { Card } from "../shared";
import { BodyMeasurements } from "./body-measurements";
import { ProgressBar } from "../dashboard/progress-bar"; // Перевикористовуємо наш ProgressBar
import { DayData, Profile } from "@/types";

interface DailyDetailModalProps {
  day: DayData;
  userProfile: Profile | null;
  onClose: () => void;
}

export function DailyDetailModal({
  day,
  userProfile,
  onClose,
}: DailyDetailModalProps) {
  // Блокуємо скрол на фоні, поки модальне вікно відкрите
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    // Оверлей, що затемнює фон
    <div
      className="fixed inset-0 bg-orange-50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-4xl max-h-[95vh] overflow-y-auto p-6"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Summary for {day.date},{" "}
            {new Date(day.fullDate + "T00:00:00Z").getFullYear()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl cursor-pointer"
            aria-label="close"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ліва колонка з основними показниками */}
          <div className="p-5 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Food</h3>
            <div className="space-y-4">
              {/* Калорії */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-bold text-gray-800">
                    {day.consumed_calories} / {day.target_calories} kcal
                  </span>
                </div>
                <ProgressBar
                  current={day.consumed_calories}
                  target={day.target_calories}
                  color="bg-orange-400"
                />
              </div>
              {/* Білки */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-bold text-gray-800">
                    {day.consumed_protein_g} / {day.target_protein_g} g
                  </span>
                </div>
                <ProgressBar
                  current={day.consumed_protein_g}
                  target={day.target_protein_g}
                  color="bg-yellow-400"
                />
              </div>
              {/* Жири */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Fat</span>
                  <span className="font-bold text-gray-800">
                    {day.consumed_fat_g} / {day.target_fat_g} g
                  </span>
                </div>
                <ProgressBar
                  current={day.consumed_fat_g}
                  target={day.target_fat_g}
                  color="bg-orange-300"
                />
              </div>
              {/* Вуглеводи */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-bold text-gray-800">
                    {day.consumed_carbs_g} / {day.target_carbs_g} g
                  </span>
                </div>
                <ProgressBar
                  current={day.consumed_carbs_g}
                  target={day.target_carbs_g}
                  color="bg-green-400"
                />
              </div>
              {/* Цукор */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Sugar</span>
                  <span className="font-bold text-gray-800">
                    {day.consumed_sugar_g} / {day.target_sugar_g} g
                  </span>
                </div>
                <ProgressBar
                  current={day.consumed_sugar_g}
                  target={day.target_sugar_g}
                  color="bg-stone-400"
                />
              </div>
              {/* Вода */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Water</span>
                  <span className="font-bold text-gray-800">
                    {day.consumed_water_ml} / {day.target_water_ml} ml
                  </span>
                </div>
                <ProgressBar
                  current={day.consumed_water_ml}
                  target={day.target_water_ml}
                  color="bg-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Права колонка з замірами тіла */}
          <BodyMeasurements
            gender={userProfile?.gender || "male"}
            weight={day.end_of_day_weight}
            belly={day.end_of_day_belly}
            waist={day.end_of_day_waist}
          />
        </div>
      </Card>
    </div>
  );
}
