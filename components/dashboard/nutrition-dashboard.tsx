"use client";

import { Card } from "../shared";
import { ProgressRing } from "./progress-ring";
import { ProgressBar } from "./progress-bar";
import { MealCard } from "./meal-card";
import { FoodEntryCard } from "./food-entry-card";
import { UserRecipe } from "@/types";
import { useState } from "react";

import type { FoodEntry } from "@/types";
import { Accordion } from "../ui";
import { DASHBOARD_TEXTS } from "./dashboard-text";

interface NutritionDashboardProps {
  summaryData: {
    calories: {
      consumed: number;
      burned: number;
      target: number;
    };
    macros: {
      protein: { current: number; target: number };
      carbs: { current: number; target: number };
      fat: { current: number; target: number };
      sugar: { current: number; target: number };
    };
  };
  foodLogData: FoodEntry[];
  userRecipes: UserRecipe[];
}

export function NutritionDashboard({
  summaryData,
  foodLogData,
  userRecipes,
}: NutritionDashboardProps) {
  const [hoveredMacro, setHoveredMacro] = useState<string | null>(null);

  const getMacroValue = (macro: "protein" | "carbs" | "fat" | "sugar") => {
    const { current, target } = summaryData.macros[macro];
    if (hoveredMacro === macro) {
      const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
      return `${percentage}%`;
    }
    return `${current}${DASHBOARD_TEXTS.NUTRION_DASHBOARD.UNIT_GRAM} / ${target}${DASHBOARD_TEXTS.NUTRION_DASHBOARD.UNIT_GRAM}`;
  };
  const availableMealTypes = [
    { value: "breakfast", label: DASHBOARD_TEXTS.NUTRION_DASHBOARD.BRACKFAST },
    { value: "lunch", label: DASHBOARD_TEXTS.NUTRION_DASHBOARD.LUNCH },
    { value: "dinner", label: DASHBOARD_TEXTS.NUTRION_DASHBOARD.DINNER },
    { value: "snack", label: DASHBOARD_TEXTS.NUTRION_DASHBOARD.SNACK },
  ];

  return (
    <Card className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          {DASHBOARD_TEXTS.NUTRION_DASHBOARD.FOOD_JOURNAL}
        </h1>
        <p className="text-gray-500 font-light">
          {DASHBOARD_TEXTS.NUTRION_DASHBOARD.TRACK_PROGRESS}
        </p>
      </header>

      <Card className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-light text-gray-700 mb-4">
          {DASHBOARD_TEXTS.NUTRION_DASHBOARD.TODAY_SUMMARY}
        </h2>
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <ProgressRing
            current={summaryData.calories.consumed}
            target={summaryData.calories.target}
          />
          <div className="flex-1 space-y-4">
            <div
              onMouseEnter={() => setHoveredMacro("protein")}
              onMouseLeave={() => setHoveredMacro(null)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  {DASHBOARD_TEXTS.NUTRION_DASHBOARD.PROTEIN}
                </span>
                <span className="text-sm text-gray-600">
                  {getMacroValue("protein")}
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.protein.current}
                target={summaryData.macros.protein.target}
                color="bg-yellow-400"
              />
            </div>
            <div
              onMouseEnter={() => setHoveredMacro("carbs")}
              onMouseLeave={() => setHoveredMacro(null)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  {DASHBOARD_TEXTS.NUTRION_DASHBOARD.CARBOHYDRATE}
                </span>
                <span className="text-sm text-gray-600">
                  {getMacroValue("carbs")}
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.carbs.current}
                target={summaryData.macros.carbs.target}
                color="bg-green-400"
              />
            </div>
            <div
              onMouseEnter={() => setHoveredMacro("fat")}
              onMouseLeave={() => setHoveredMacro(null)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  {DASHBOARD_TEXTS.NUTRION_DASHBOARD.FAT}
                </span>
                <span className="text-sm text-gray-600">
                  {getMacroValue("fat")}
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.fat.current}
                target={summaryData.macros.fat.target}
                color="bg-orange-400"
              />
            </div>
            {/* <div
              onMouseEnter={() => setHoveredMacro("sugar")}
              onMouseLeave={() => setHoveredMacro(null)}
              className="cursor-pointer"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">{DASHBOARD_TEXTS.NUTRION_DASHBOARD.SUGAR}</span>
                <span className="text-sm text-gray-600">
                  {getMacroValue("sugar")}
                </span>
              </div>
              <ProgressBar
                current={summaryData.macros.sugar.current}
                target={summaryData.macros.sugar.target}
                color="bg-sky-300"
              />
            </div> */}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {foodLogData.length > 0 && (
          <Accordion.Accordion
            type="single"
            collapsible
            defaultValue="food-log"
          >
            <Accordion.Item
              value="food-log"
              className="border-b-2 border-orange-100"
            >
              <Accordion.Trigger className="font-semibold text-gray-800 text-lg hover:no-underline">
                {DASHBOARD_TEXTS.NUTRION_DASHBOARD.TODAY_JOURNAL}
              </Accordion.Trigger>
              <Accordion.Content className="pt-2">
                <div className="space-y-3">
                  {foodLogData.map((entry) => (
                    <FoodEntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Accordion>
        )}

        <MealCard
          availableMealTypes={availableMealTypes}
          userRecipes={userRecipes}
        />
      </div>
    </Card>
  );
}
