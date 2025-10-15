"use client";

import { Card } from "../shared/card";
import { Accordion } from "../ui";
import { Flame, Dumbbell, Clock } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { WorkoutPlan } from "@/types";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { deleteEntry } from "@/app/actions";
import { COACH_TEXTS } from "./coach-text";

interface WorkoutPlanCardProps {
  id: number;
  plan: WorkoutPlan;
  isHistory?: boolean;
  createdAt?: string;
}

export function WorkoutPlanCard({
  id,
  plan,
  isHistory = false,
  createdAt,
}: WorkoutPlanCardProps) {
  const formattedDate = createdAt
    ? format(new Date(createdAt), "d MMMM yyyy", { locale: uk })
    : "";
  const header = isHistory
    ? `${COACH_TEXTS.WORKOUT_PLAN_CARD.PLAN_FROM} ${formattedDate}`
    : plan.plan_title;

  const [isPending, startTransition] = useTransition();

  const handleDeleteActivity = (activityId: number) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold">
            {COACH_TEXTS.WORKOUT_PLAN_CARD.DELETE_TRAINING}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                startTransition(() => {
                  deleteEntry("workout_plans", activityId).then((res) => {
                    if (res.error) {
                      toast.error(res.error);
                    } else {
                      toast.success(
                        res.success ||
                          COACH_TEXTS.WORKOUT_PLAN_CARD.DELETE_SUCCESS
                      );
                    }
                  });
                });
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              {COACH_TEXTS.WORKOUT_PLAN_CARD.CONFIRM_DELETE}
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
            >
              {COACH_TEXTS.WORKOUT_PLAN_CARD.CANCEL}
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

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
                  {dayPlan.estimated_calories_burned}{" "}
                  {COACH_TEXTS.WORKOUT_PLAN_CARD.UNIT_KILOCALORIE}
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
                              {exercise.sets}{" "}
                              {COACH_TEXTS.WORKOUT_PLAN_CARD.TIMES}{" "}
                              {exercise.reps}
                              {COACH_TEXTS.WORKOUT_PLAN_CARD.REPS}
                            </span>
                          )}

                          {exercise.duration_min && (
                            <span className="flex items-center">
                              <Clock className="size-4 mr-1" />
                              {exercise.duration_min}{" "}
                              {COACH_TEXTS.WORKOUT_PLAN_CARD.UNIT_MINUTES}
                            </span>
                          )}

                          {exercise.duration_sec && (
                            <span className="flex items-center">
                              <Clock className="size-4 mr-1" />
                              {exercise.duration_sec}{" "}
                              {COACH_TEXTS.WORKOUT_PLAN_CARD.UNIT_SECONDS}
                            </span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">
                    {COACH_TEXTS.WORKOUT_PLAN_CARD.REST}
                  </p>
                )}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Accordion>
      <div className="flex justify-between">
        <div />
        <button
          onClick={() => handleDeleteActivity(id)}
          disabled={isPending}
          className="rounded scale-110 text-white disabled:opacity-50 transition-colors cursor-pointer z-50 bg-red-500 p-1 hover:bg-red-600"
          aria-label="Delete Activity"
        >
          {COACH_TEXTS.WORKOUT_PLAN_CARD.DELETE}
        </button>
      </div>
    </Card>
  );
}
