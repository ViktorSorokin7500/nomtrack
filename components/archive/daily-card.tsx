"use client";

import { useState, useTransition } from "react";
import { Card } from "../shared";
import { DailyDetailModal } from "./daily-detail-modal";
import { DayData, Profile, FoodEntry } from "@/types";
import { ARCHIVE_TEXTS } from "./archive-texts";
import toast from "react-hot-toast";
import { getFoodEntriesByDate } from "@/app/actions/food";

interface DailyCardProps {
  day: DayData;
  userProfile: Profile | null;
}

export function DailyCard({ day, userProfile }: DailyCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [foodLog, setFoodLog] = useState<FoodEntry[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const openModal = () => {
    if (!hasFetched) {
      startTransition(async () => {
        const result = await getFoodEntriesByDate(day.fullDate);
        if (result.error) {
          toast.error(ARCHIVE_TEXTS.DAILY_CARD.TOAST_ERROR + result.error);
        } else if (result.success) {
          setFoodLog(result.success);
          setHasFetched(true);
        }
        setIsModalOpen(true);
      });
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card
        className="hover:cursor-pointer hover:shadow-lg transition-shadow z-1"
        onClick={openModal}
      >
        {isPending && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-20">
            {ARCHIVE_TEXTS.DAILY_CARD.LOADING}
          </div>
        )}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">{day.date}</h3>
          <span className="text-sm text-gray-500">
            {new Date(day.fullDate + "T00:00:00Z").getFullYear()}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              {ARCHIVE_TEXTS.DAILY_CARD.CALORIES_CONSUMED}
            </span>
            <span className="font-semibold text-gray-800">
              {day.consumed_calories}
            </span>
          </div>
          {day.end_of_day_weight && (
            <div className="flex justify-between">
              <span className="text-gray-600">
                {ARCHIVE_TEXTS.DAILY_CARD.WEIGHT}:
              </span>
              <span className="font-semibold text-gray-800">
                {day.end_of_day_weight} {ARCHIVE_TEXTS.DAILY_CARD.UNIT_KG}
              </span>
            </div>
          )}
        </div>
      </Card>

      {isModalOpen && (
        <DailyDetailModal
          day={day}
          userProfile={userProfile}
          foodLog={foodLog}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
