"use client";

import { Card } from "../shared";
import { type DayData, type Profile } from "@/types";
import { ProgressRingArchive } from "./progress-ring-archive";
import { MonthlyReportButton } from "./monthly-report-button";

interface MonthlySummaryCardProps {
  days: DayData[];
  userProfile: Profile;
}

export function MonthlySummaryCard({
  days,
  userProfile,
}: MonthlySummaryCardProps) {
  // Розраховуємо загальні та середні показники
  const totals = days.reduce(
    (acc, day) => {
      acc.consumedCalories += day.consumed_calories;
      acc.targetCalories += day.target_calories;
      acc.consumedProtein += day.consumed_protein_g;
      acc.targetProtein += day.target_protein_g;
      acc.consumedFat += day.consumed_fat_g;
      acc.targetFat += day.target_fat_g;
      acc.consumedCarbs += day.consumed_carbs_g;
      acc.targetCarbs += day.target_carbs_g;
      acc.consumedWater += day.consumed_water_ml;
      acc.targetWater += day.target_water_ml;
      return acc;
    },
    {
      consumedCalories: 0,
      targetCalories: 0,
      consumedProtein: 0,
      targetProtein: 0,
      consumedFat: 0,
      targetFat: 0,
      consumedCarbs: 0,
      targetCarbs: 0,
      consumedWater: 0,
      targetWater: 0,
    }
  );

  const numDays = days.length;
  const averages = {
    calories: Math.round(totals.consumedCalories / numDays),
    protein: Math.round(totals.consumedProtein / numDays),
    fat: Math.round(totals.consumedFat / numDays),
    carbs: Math.round(totals.consumedCarbs / numDays),
    water: Math.round(totals.consumedWater / numDays),
    targetCalories: Math.round(totals.targetCalories / numDays),
    targetProtein: Math.round(totals.targetProtein / numDays),
    targetFat: Math.round(totals.targetFat / numDays),
    targetCarbs: Math.round(totals.targetCarbs / numDays),
    targetWater: Math.round(totals.targetWater / numDays),
  };

  const macros = [
    {
      label: "Калорії",
      current: averages.calories,
      target: averages.targetCalories,
      color: "stroke-orange-400",
      scolor: "stroke-red-400",
      type: "calories",
      unit: "ккал",
    },
    {
      label: "Білки",
      current: averages.protein,
      target: averages.targetProtein,
      color: "stroke-yellow-400",
      scolor: "stroke-yellow-600",
      type: "protein",
      unit: "г",
    },
    {
      label: "Жири",
      current: averages.fat,
      target: averages.targetFat,
      color: "stroke-sky-300",
      scolor: "stroke-blue-900",
      type: "fat",
      unit: "г",
    },
    {
      label: "Вуглеводи",
      current: averages.carbs,
      target: averages.targetCarbs,
      color: "stroke-lime-400",
      scolor: "stroke-green-600",
      type: "carbs",
      unit: "г",
    },
  ];

  return (
    <Card className="p-6 bg-white shadow-sm rounded-lg mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Середні показники за місяць
      </h2>
      <p className="text-gray-600 mb-6">
        Проаналізуйте середній прогрес щодо ваших цілей.
      </p>

      <div className="space-y-4 flex flex-wrap justify-between">
        {macros.map((macro) => (
          <div key={macro.type} className="cursor-pointer">
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
      <MonthlyReportButton daysData={days} userProfile={userProfile} />
    </Card>
  );
}
