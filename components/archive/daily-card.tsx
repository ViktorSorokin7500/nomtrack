"use client";
import { useState } from "react";
import { Card } from "../shared";
import { DailyDetailModal } from "./daily-detail-modal";

interface Day {
  date: string;
  fullDate: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  sugar: number;
  water: number;
  weight: number;
  belly: number;
  waist: number;
}

interface DailyCardProps {
  day: Day;
}

export function DailyCard({ day }: DailyCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card
        className="hover:cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">{day.date}</h3>
          <span className="text-sm text-gray-500">
            {new Date(day.fullDate).getFullYear()}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Calories:</span>
            <span className="font-semibold text-gray-800">{day.calories}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Weight:</span>
            <span className="font-semibold text-gray-800">{day.weight}kg</span>
          </div>
        </div>
      </Card>
      {isModalOpen && (
        <DailyDetailModal day={day} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
