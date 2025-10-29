"use client";

import React from "react";
import Image from "next/image";
import { Card } from "../shared";
import Man from "../../public/assets/man.png";
import Woman from "../../public/assets/woman.png";
import { ARCHIVE_TEXTS } from "./archive-texts";
import { FoodEntry } from "@/types";
import { Accordion } from "../ui";

interface MeasurementsProps {
  gender: string | null;
  weight: number | null;
  foodLog: FoodEntry[];
  // belly: number | null;
  // waist: number | null;
}

const MEAL_LABELS: { [key: string]: string } = {
  breakfast: ARCHIVE_TEXTS.BODY_MEASUREMENTS.BREAKFAST,
  lunch: ARCHIVE_TEXTS.BODY_MEASUREMENTS.LUNCH,
  dinner: ARCHIVE_TEXTS.BODY_MEASUREMENTS.DINNER,
  snack: ARCHIVE_TEXTS.BODY_MEASUREMENTS.SNACK,
};

export function BodyMeasurements({
  gender,
  weight,
  foodLog,
}: // belly,
// waist,
MeasurementsProps) {
  const measurementsList = [
    {
      id: "weight",
      label: ARCHIVE_TEXTS.BODY_MEASUREMENTS.WEIGHT,
      value: weight,
      unit: ARCHIVE_TEXTS.BODY_MEASUREMENTS.UNIT_KG,
    },
    // {
    //   id: "waist",
    //   label: ARCHIVE_TEXTS.BODY_MEASUREMENTS.WAIST,
    //   value: waist,
    //   unit: ARCHIVE_TEXTS.BODY_MEASUREMENTS.UNIT_CM,
    // },
    // {
    //   id: "belly",
    //   label: ARCHIVE_TEXTS.BODY_MEASUREMENTS.BELLY,
    //   value: belly,
    //   unit: ARCHIVE_TEXTS.BODY_MEASUREMENTS.UNIT_CM,
    // },
  ];

  const groupedFood = foodLog.reduce((acc, entry) => {
    if (!acc[entry.meal_type]) {
      acc[entry.meal_type] = [];
    }
    acc[entry.meal_type].push(entry);
    return acc;
  }, {} as Record<FoodEntry["meal_type"], FoodEntry[]>);

  const mealOrder: FoodEntry["meal_type"][] = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ];

  const hasFoodEntries = foodLog.length > 0;

  return (
    <Card className="p-5 lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col justify-center items-center h-full">
          {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {ARCHIVE_TEXTS.BODY_MEASUREMENTS.TITLE}
          </h3> */}
          <Image
            src={gender === "female" ? Woman : Man}
            alt={ARCHIVE_TEXTS.BODY_MEASUREMENTS.IMAGE_ALT}
            width={300}
            height={500}
            className="object-contain max-h-[450px] w-auto"
            priority
          />

          {measurementsList.map((m) => (
            <div key={m.id} className="p-3 rounded-lg bg-gray-100">
              <div className="flex justify-between items-center gap-x-1">
                <span className="text-gray-600">{m.label}</span>
                <span className="font-bold text-gray-800 text-lg">
                  {m.value
                    ? m.value
                    : ARCHIVE_TEXTS.BODY_MEASUREMENTS.NOT_AVAILABLE}
                  {m.value && (
                    <span className="text-sm text-gray-500 ml-1">{m.unit}</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="">
          <h4 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
            {ARCHIVE_TEXTS.BODY_MEASUREMENTS.TITLE_FOOD_LOG}
          </h4>
          {hasFoodEntries ? (
            <Accordion.Accordion
              type="single"
              collapsible
              className="w-full space-y-2"
            >
              {mealOrder.map((mealType) => {
                const entries = groupedFood[mealType];
                if (!entries || entries.length === 0) return null;

                const mealLabel = MEAL_LABELS[mealType] || mealType;

                return (
                  <Accordion.Item
                    key={mealType}
                    value={mealType}
                    className="border rounded-lg shadow-sm bg-white overflow-hidden" // Стилізація елемента
                  >
                    <Accordion.Trigger className="flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-orange-50/50">
                      <span className="font-bold text-orange-600">
                        {mealLabel}
                      </span>
                    </Accordion.Trigger>
                    <Accordion.Content className="p-4 pt-2 bg-white">
                      <ul className="list-disc list-inside space-y-2 pl-3 text-sm text-gray-700">
                        {entries.map((entry, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{entry.entry_text}</span>
                          </li>
                        ))}
                      </ul>
                    </Accordion.Content>
                  </Accordion.Item>
                );
              })}
            </Accordion.Accordion>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {ARCHIVE_TEXTS.BODY_MEASUREMENTS.NO_FOOD_LOG}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
