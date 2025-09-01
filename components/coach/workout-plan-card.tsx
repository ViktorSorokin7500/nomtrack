// components/coach/workout-plan-card.tsx
"use client";

import { Card } from "../shared/card";
import { Accordion } from "../ui";
import { Flame, Dumbbell, Clock } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { WorkoutPlan } from "@/types";

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  isHistory?: boolean;
  createdAt?: string;
}

export function WorkoutPlanCard({
  plan,
  isHistory = false,
  createdAt,
}: WorkoutPlanCardProps) {
  const formattedDate = createdAt
    ? format(new Date(createdAt), "d MMMM yyyy", { locale: uk })
    : "";
  const header = isHistory ? `План від ${formattedDate}` : plan.plan_title;

  return (
    <Card>
      <h2
        className={`text-2xl font-bold text-center mb-6 text-stone-900 ${
          isHistory ? "text-xl" : "text-2xl"
        }`}
      >
        {header}
      </h2>

      <p className="text-center text-gray-600 mb-6">
        {plan.general_recommendations}
      </p>

      <Accordion.Accordion type="single" collapsible className="w-full">
        {plan.daily_plans.map((dayPlan) => (
          <Accordion.Item
            key={dayPlan.day}
            value={dayPlan.day}
            className="border-b-2 border-orange-100"
          >
            <Accordion.Trigger className="flex justify-between items-center p-4 hover:bg-orange-50 transition-colors rounded-lg">
              <div className="flex flex-col items-start">
                <span className="font-semibold text-lg text-stone-800">
                  {dayPlan.day} ({dayPlan.type})
                </span>
              </div>

              {dayPlan.estimated_calories_burned > 0 && (
                <div className="flex items-center text-sm text-red-500">
                  <Flame className="size-4 mr-1" />
                  {dayPlan.estimated_calories_burned} ккал
                </div>
              )}
            </Accordion.Trigger>
            <Accordion.Content className="p-4 pt-0">
              <ul className="space-y-3">
                {dayPlan.exercises.length > 0 ? (
                  dayPlan.exercises.map((exercise, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg flex items-start space-x-3"
                    >
                      <Dumbbell className="size-5 text-orange-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800">
                          {exercise.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {exercise.sets && exercise.reps && (
                            <span>
                              {exercise.sets} підходи по {exercise.reps}
                              повторень
                            </span>
                          )}

                          {exercise.duration_min && (
                            <span className="flex items-center">
                              <Clock className="size-4 mr-1" />
                              {exercise.duration_min} хв
                            </span>
                          )}

                          {exercise.duration_sec && (
                            <span className="flex items-center">
                              <Clock className="size-4 mr-1" />
                              {exercise.duration_sec} сек
                            </span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Відпочинок</p>
                )}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Accordion>
    </Card>
  );
}
