"use client";

import { Card } from "../shared";
import { Dumbbell, Flame } from "lucide-react";
import { Accordion } from "../ui";
import { WorkoutListProps } from "@/types";

// Додаємо новий тип для нашого компонента

export function WorkoutList({ savedWorkouts, plans }: WorkoutListProps) {
  if (savedWorkouts.length === 0 && plans.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500">
          Поки що немає збережених тренувань або планів.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Збережені тренування</h2>
      <Accordion.Accordion type="single" collapsible className="w-full">
        {savedWorkouts.length > 0 && (
          <Accordion.Item
            value="saved-workouts"
            className="border-b border-orange-200"
          >
            <Accordion.Trigger className="flex justify-between items-center p-4 hover:bg-orange-50 transition-colors rounded-lg">
              <span className="font-semibold text-lg text-stone-800">
                Мої тренування
              </span>
            </Accordion.Trigger>
            <Accordion.Content className="p-4 pt-0 space-y-4">
              {savedWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="p-4 border rounded-lg bg-gray-50/70"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Dumbbell size={20} className="text-orange-600" />
                      <span className="font-semibold">
                        {workout.workout_name}
                      </span>
                    </div>
                    <div className="flex items-center text-red-500 text-sm font-medium">
                      <Flame className="size-4 mr-1" />
                      {workout.estimated_calories_burned} ккал
                    </div>
                  </div>
                  <ul className="text-sm mt-2 space-y-1 text-gray-600">
                    {workout.workout_data.map((exercise, index) => (
                      <li key={index}>
                        - {exercise.name}
                        {exercise.sets &&
                          exercise.reps &&
                          ` (${exercise.sets} x ${exercise.reps})`}
                        {exercise.duration_min &&
                          ` (${exercise.duration_min} хв)`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        )}
      </Accordion.Accordion>
    </Card>
  );
}
