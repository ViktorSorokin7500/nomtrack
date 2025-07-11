"use client";

import React from "react";
import Image from "next/image";
import { Card } from "../shared";
import Man from "../../public/assets/man.png";
import Woman from "../../public/assets/woman.png";

interface MeasurementsProps {
  gender: string | null;
  weight: number | null;
  belly: number | null;
  waist: number | null;
}

export function BodyMeasurements({
  gender,
  weight,
  belly,
  waist,
}: MeasurementsProps) {
  const measurementsList = [
    { id: "weight", label: "Вага", value: weight, unit: "кг" },
    { id: "waist", label: "Талія", value: waist, unit: "см" },
    { id: "belly", label: "Живіт", value: belly, unit: "см" },
  ];

  return (
    <Card className="p-5 lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Заміри тіла</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center items-center h-full">
          <Image
            src={gender === "female" ? Woman : Man}
            alt="Модель тіла"
            width={300}
            height={500}
            className="object-contain max-h-[450px] w-auto"
            priority
          />
        </div>
        <div className="space-y-3">
          {measurementsList.map((m) => (
            <div key={m.id} className="p-3 rounded-lg bg-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{m.label}</span>
                <span className="font-bold text-gray-800 text-lg">
                  {m.value ? m.value : "N/A"}
                  {m.value && (
                    <span className="text-sm text-gray-500 ml-1">{m.unit}</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
