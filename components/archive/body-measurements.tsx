"use client";

import React from "react";
import Image from "next/image";
import { Card } from "../shared";
import Man from "../../public/assets/man.png";
import Woman from "../../public/assets/woman.png";

interface MeasurementsProps {
  weight: number;
  belly: number;
  waist: number;
}

export function BodyMeasurements({ weight, belly, waist }: MeasurementsProps) {
  const measurementsList = [
    { id: "weight", label: "Weight", value: weight, unit: "kg" },
    { id: "waist", label: "Waist", value: waist, unit: "sm" },
    { id: "belly", label: "Belly", value: belly, unit: "sm" },
  ];

  const gender = "female";

  return (
    <Card className="p-5 lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Body Measurements
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center items-center h-full">
          <Image
            src={gender === "female" ? Woman : Man}
            alt="Модель тела"
            width={300}
            height={500}
            className="object-contain max-h-[450px] w-auto"
            priority
          />
        </div>

        <div className="space-y-3">
          {measurementsList.map((m) => (
            <div key={m.id} className="p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{m.label}</span>
                <span className="font-bold text-gray-800 text-lg">
                  {m.value}
                  <span className="text-sm text-gray-500 ml-1">{m.unit}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
