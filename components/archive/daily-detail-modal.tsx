"use client";

import { useEffect } from "react";
import { Card } from "../shared";
import { BodyMeasurements } from "./body-measurements";
import { DayData, FoodEntry, Profile } from "@/types";
import { ProgressRingArchive } from "./progress-ring-archive";
import { ARCHIVE_TEXTS } from "./archive-texts";

interface DailyDetailModalProps {
  day: DayData;
  userProfile: Profile | null;
  foodLog: FoodEntry[];
  onClose: () => void;
}

export function DailyDetailModal({
  day,
  userProfile,
  onClose,
  foodLog,
}: DailyDetailModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const date = new Date(day.fullDate);
  const longFormattedDate = date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const macros = [
    {
      label: ARCHIVE_TEXTS.DAILY_DETAILS.CALORIES,
      current: day.consumed_calories,
      target: day.target_calories,
      color: "stroke-orange-400",
      scolor: "stroke-red-400",
      type: "calories",
      unit: ARCHIVE_TEXTS.DAILY_DETAILS.UNIT_KILOCALORIE,
    },
    {
      label: ARCHIVE_TEXTS.DAILY_DETAILS.PROTEIN,
      current: day.consumed_protein_g,
      target: day.target_protein_g,
      color: "stroke-yellow-400",
      scolor: "stroke-yellow-600",
      type: "protein",
      unit: ARCHIVE_TEXTS.DAILY_DETAILS.UNIT_GRAM,
    },
    {
      label: ARCHIVE_TEXTS.DAILY_DETAILS.FAT,
      current: day.consumed_fat_g,
      target: day.target_fat_g,
      color: "stroke-sky-300",
      scolor: "stroke-blue-900",
      type: "fat",
      unit: ARCHIVE_TEXTS.DAILY_DETAILS.UNIT_GRAM,
    },
    {
      label: ARCHIVE_TEXTS.DAILY_DETAILS.CARBOHYDRATE,
      current: day.consumed_carbs_g,
      target: day.target_carbs_g,
      color: "stroke-lime-400",
      scolor: "stroke-green-600",
      type: "carbs",
      unit: ARCHIVE_TEXTS.DAILY_DETAILS.UNIT_GRAM,
    },
    // {
    //   label: ARCHIVE_TEXTS.DAILY_DETAILS.SUGAR,
    //   current: day.consumed_sugar_g,
    //   target: day.target_sugar_g,
    //   color: "stroke-stone-400",
    //   scolor: "stroke-stone-600",
    //   type: "sugar",
    //   unit: ARCHIVE_TEXTS.DAILY_DETAILS.UNIT_GRAM,
    // },
    {
      label: ARCHIVE_TEXTS.DAILY_DETAILS.WATER,
      current: day.consumed_water_ml,
      target: day.target_water_ml,
      color: "stroke-blue-400",
      scolor: "stroke-sky-600",
      type: "water",
      unit: ARCHIVE_TEXTS.DAILY_DETAILS.UNIT_ML,
    },
  ];

  return (
    // Оверлей, що затемнює фон
    <div
      className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-4xl max-h-[95vh] overflow-y-auto p-6 z-50"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {ARCHIVE_TEXTS.DAILY_DETAILS.TITLE}
            {longFormattedDate}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl cursor-pointer"
            aria-label="close"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="p-5 rounded-lg bg-gray-50 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {ARCHIVE_TEXTS.DAILY_DETAILS.GOALS}
            </h3>
            <div className="flex items-center justify-center flex-wrap gap-2">
              {macros.map((macro) => (
                <div key={macro.type} className="">
                  <ProgressRingArchive
                    label={macro.label}
                    current={macro.current}
                    target={macro.target}
                    color={macro.color}
                    scolor={macro.scolor}
                  />
                </div>
              ))}
            </div>
          </div>

          <BodyMeasurements
            gender={userProfile?.gender || "male"}
            weight={day.end_of_day_weight}
            foodLog={foodLog}
            // belly={day.end_of_day_belly}
            // waist={day.end_of_day_waist}
          />
        </div>
      </Card>
    </div>
  );
}
