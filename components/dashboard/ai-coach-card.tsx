"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useEffect, useState } from "react";
import {
  analyzeAndSaveActivityEntry,
  deleteEntry,
  logPlannedWorkout,
} from "@/app/actions";
import { Card } from "../shared";
import { Button, SimpleRiseSpinner } from "../ui";
import { ActivityEntryCard } from "./activity-entry-card";
import toast from "react-hot-toast";
import { Coins, Dumbbell, Flame } from "lucide-react";
import { DbSavedWorkout } from "@/types";
import { DASHBOARD_TEXTS } from "./dashboard-text";
import { AI_REQUEST } from "@/lib/const";

const activitySchema = z
  .object({
    mode: z.enum(["ai", "manual", "planned", "saved"]),
    text: z.string().optional(),
    calories: z.coerce.number().optional(),
    selected_workout_id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "ai" && (!data.text || data.text.trim().length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: DASHBOARD_TEXTS.AI_COACH_CARD.Z_ACTIVITY,
        path: ["text"],
      });
    }
    if (data.mode === "manual" && (!data.calories || data.calories <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: DASHBOARD_TEXTS.AI_COACH_CARD.Z_CALORIES,
        path: ["calories"],
      });
    }
    if (data.mode === "saved" && !data.selected_workout_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: DASHBOARD_TEXTS.AI_COACH_CARD.Z_SELECT_WORKOUT,
        path: ["selected_workout_id"],
      });
    }
  });

type ActivitySchema = z.infer<typeof activitySchema>;

type ActivityEntry = {
  id: number;
  entry_text: string;
  calories_burned: number;
};

interface AICoachCardProps {
  activityLogData: ActivityEntry[];
  todaysWorkout?: {
    type: string;
    estimated_calories_burned: number;
    exercises: { name: string }[];
  } | null;
  savedWorkouts: DbSavedWorkout[];
}

export function AICoachCard({
  activityLogData,
  todaysWorkout,
  savedWorkouts,
}: AICoachCardProps) {
  const [isPending, startTransition] = useTransition();
  const [currentTodaysWorkout, setCurrentTodaysWorkout] =
    useState(todaysWorkout);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
    setValue,
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
    mode: "onChange",
    defaultValues: {
      mode: "ai",
      text: "",
      calories: undefined,
      selected_workout_id: "",
    },
  });

  const currentMode = useWatch({ control, name: "mode" });
  const selectedWorkoutId = useWatch({ control, name: "selected_workout_id" });

  useEffect(() => {
    if (
      currentTodaysWorkout &&
      currentTodaysWorkout.estimated_calories_burned > 0
    ) {
      setValue("mode", "planned");
    } else {
      setValue("mode", "ai");
    }
  }, [currentTodaysWorkout, setValue]);

  const onSubmit = async (data: ActivitySchema) => {
    startTransition(async () => {
      let result;
      if (data.mode === "planned" && currentTodaysWorkout) {
        result = await logPlannedWorkout({
          entryText: `${currentTodaysWorkout.type} ${DASHBOARD_TEXTS.AI_COACH_CARD.TRANING} (${currentTodaysWorkout.estimated_calories_burned} ${DASHBOARD_TEXTS.AI_COACH_CARD.UNIT_CALORIES})`,
          caloriesBurned: currentTodaysWorkout.estimated_calories_burned,
        });
      } else if (data.mode === "manual") {
        result = await logPlannedWorkout({
          entryText: `${DASHBOARD_TEXTS.AI_COACH_CARD.MANUAL_ENTER} (${data.calories} ${DASHBOARD_TEXTS.AI_COACH_CARD.UNIT_CALORIES})`,
          caloriesBurned: data.calories!,
        });
      } else if (data.mode === "saved") {
        const selectedWorkout = savedWorkouts.find(
          (w) => String(w.id) === data.selected_workout_id
        );
        if (selectedWorkout) {
          result = await logPlannedWorkout({
            entryText: selectedWorkout.workout_name,
            caloriesBurned: selectedWorkout.estimated_calories_burned,
          });
        } else {
          toast.error(DASHBOARD_TEXTS.AI_COACH_CARD.TOAST_ERROR);
          return;
        }
      } else {
        result = await analyzeAndSaveActivityEntry(data.text!);
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(DASHBOARD_TEXTS.AI_COACH_CARD.TOAST_SUCCESS);
        reset({
          mode: "ai",
          text: "",
          calories: undefined,
          selected_workout_id: "",
        });
        if (data.mode === "planned") {
          setCurrentTodaysWorkout(null);
        }
      }
    });
  };

  const handleDeleteActivity = (activityId: number) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold">
            {DASHBOARD_TEXTS.AI_COACH_CARD.DELETE_ACTIVITY}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                startTransition(() => {
                  deleteEntry("activity_entries", activityId).then((res) => {
                    if (res.error) {
                      toast.error(res.error);
                    } else {
                      toast.success(
                        res.success || DASHBOARD_TEXTS.AI_COACH_CARD.DELETED
                      );
                    }
                  });
                });
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              {DASHBOARD_TEXTS.AI_COACH_CARD.CONFIRM_DELETE}
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
            >
              {DASHBOARD_TEXTS.AI_COACH_CARD.CANCEL}
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const isButtonDisabled =
    isPending ||
    (currentMode !== "planned" && currentMode !== "saved" && !isValid) ||
    (currentMode === "saved" && !selectedWorkoutId);

  return (
    <Card>
      {activityLogData.length > 0 && (
        <div className="py-2 border-b border-gray-200">
          <h3 className="text-lg font-medium mb-3">
            {DASHBOARD_TEXTS.AI_COACH_CARD.TODAY_ACTIVITY}
          </h3>
          <div className="space-y-2">
            {activityLogData.map((entry) => (
              <ActivityEntryCard
                key={entry.id}
                entry={entry}
                handleDeleteActivity={handleDeleteActivity}
                isPending={isPending}
              />
            ))}
          </div>
        </div>
      )}

      <div className="py-2">
        <h2 className="text-xl font-medium mb-4">
          {DASHBOARD_TEXTS.AI_COACH_CARD.ALL_ACTIVITY}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
            <label className="flex-1 cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm flex justify-center items-center">
              <input
                type="radio"
                value="ai"
                {...register("mode")}
                checked={currentMode === "ai"}
                className="sr-only"
              />
              {DASHBOARD_TEXTS.AI_COACH_CARD.AI_ANALISIS}
              <span className="ml-1 text-green-500 flex items-center gap-1">
                <Coins className="size-4" /> {AI_REQUEST}
              </span>
            </label>

            <label className="flex-1 cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm flex justify-center items-center">
              <input
                type="radio"
                value="manual"
                {...register("mode")}
                checked={currentMode === "manual"}
                className="sr-only"
              />
              {DASHBOARD_TEXTS.AI_COACH_CARD.MANUAL_ENTER}
            </label>

            {savedWorkouts.length > 0 && (
              <label className="flex-1 cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm flex justify-center items-center">
                <input
                  type="radio"
                  value="saved"
                  {...register("mode")}
                  checked={currentMode === "saved"}
                  className="sr-only"
                />
                {DASHBOARD_TEXTS.AI_COACH_CARD.MY_ENTER}
              </label>
            )}
          </div>

          {currentTodaysWorkout &&
            currentTodaysWorkout.estimated_calories_burned > 0 && (
              <label className="block cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm">
                <input
                  type="radio"
                  value="planned"
                  {...register("mode")}
                  checked={currentMode === "planned"}
                  className="sr-only"
                />
                <div
                  className={`p-3 rounded-lg border transition-colors ${
                    currentMode === "planned"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Dumbbell size={20} className="text-orange-600" />
                      <span className="font-semibold">
                        {currentTodaysWorkout.type}{" "}
                        {DASHBOARD_TEXTS.AI_COACH_CARD.TRANING}
                      </span>
                    </div>
                    <div className="flex items-center text-red-500 text-sm font-medium">
                      <Flame className="size-4 mr-1" />
                      {currentTodaysWorkout.estimated_calories_burned}{" "}
                      {DASHBOARD_TEXTS.AI_COACH_CARD.UNIT_CALORIES}
                    </div>
                  </div>
                </div>
              </label>
            )}

          {currentMode === "ai" && (
            <textarea
              {...register("text")}
              rows={2}
              className="w-full p-3 border rounded-lg"
              placeholder={DASHBOARD_TEXTS.AI_COACH_CARD.AI_PLACEHOLDER}
            />
          )}
          {currentMode === "manual" && (
            <input
              type="number"
              step="1"
              placeholder={DASHBOARD_TEXTS.AI_COACH_CARD.MANUAL_PLACEHOLDER}
              {...register("calories", { valueAsNumber: true })}
              className="w-full p-3 border rounded-lg"
            />
          )}

          {currentMode === "saved" && savedWorkouts.length > 0 && (
            <select
              {...register("selected_workout_id")}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">
                {DASHBOARD_TEXTS.AI_COACH_CARD.SELECT_WORKOUT}
              </option>
              {savedWorkouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.workout_name} ({workout.estimated_calories_burned}{" "}
                  {DASHBOARD_TEXTS.AI_COACH_CARD.UNIT_CALORIES})
                </option>
              ))}
            </select>
          )}

          {errors.text && currentMode === "ai" && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}
          {errors.calories && currentMode === "manual" && (
            <p className="text-red-500 text-sm">{errors.calories.message}</p>
          )}
          {errors.selected_workout_id && currentMode === "saved" && (
            <p className="text-red-500 text-sm">
              {errors.selected_workout_id.message}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isButtonDisabled}>
              {isPending ? (
                <SimpleRiseSpinner className="w-[53px]" />
              ) : (
                DASHBOARD_TEXTS.AI_COACH_CARD.SUBMIT_BUTTON
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
