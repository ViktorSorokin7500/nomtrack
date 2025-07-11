"use client";

import { useState } from "react";
import { Card } from "../shared";
import { DailyDetailModal } from "./daily-detail-modal";
import { DayData, Profile } from "@/types";

interface DailyCardProps {
  day: DayData;
  userProfile: Profile | null;
}

export function DailyCard({ day, userProfile }: DailyCardProps) {
  // Стан для контролю видимості модального вікна
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
            {new Date(day.fullDate + "T00:00:00Z").getFullYear()}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Калорії (спожито):</span>
            <span className="font-semibold text-gray-800">
              {day.consumed_calories}
            </span>
          </div>
          {day.end_of_day_weight && (
            <div className="flex justify-between">
              <span className="text-gray-600">Вага:</span>
              <span className="font-semibold text-gray-800">
                {day.end_of_day_weight} kg
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Модальне вікно, яке з'являється при натисканні на картку */}
      {isModalOpen && (
        <DailyDetailModal
          day={day}
          userProfile={userProfile}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
