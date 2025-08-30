"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useEffect } from "react";
import {
  analyzeAndSaveActivityEntry,
  deleteActivity,
  logPlannedWorkout,
} from "@/app/actions";
import { Card } from "../shared";
import { Button } from "../ui";
import { ActivityEntryCard } from "./activity-entry-card";
import toast from "react-hot-toast";
import { Coins, Dumbbell, Flame } from "lucide-react";

// ---- schema ----
const activitySchema = z
  .object({
    mode: z.enum(["ai", "manual", "planned"]),
    text: z.string().optional(),
    calories: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "ai" && (!data.text || data.text.trim().length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Будь ласка, опишіть вашу активність для аналізу.",
        path: ["text"],
      });
    }
    if (data.mode === "manual" && (!data.calories || data.calories <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Будь ласка, вкажіть спалені калорії.",
        path: ["calories"],
      });
    }
  });
type ActivitySchema = z.infer<typeof activitySchema>;

// ---- props ----
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
}

// ---- component ----
export function AICoachCard({
  activityLogData,
  todaysWorkout,
}: AICoachCardProps) {
  const [isPending, startTransition] = useTransition();

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
    },
  });

  const currentMode = useWatch({ control, name: "mode" });

  // вибір режиму при маунті/оновленні
  useEffect(() => {
    if (todaysWorkout && todaysWorkout.estimated_calories_burned > 0) {
      setValue("mode", "planned");
    } else {
      setValue("mode", "ai");
    }
  }, [todaysWorkout, setValue]);

  const onSubmit = async (data: ActivitySchema) => {
    startTransition(async () => {
      let result;
      if (data.mode === "planned" && todaysWorkout) {
        result = await logPlannedWorkout({
          entryText: `${todaysWorkout.type} тренування`,
          caloriesBurned: todaysWorkout.estimated_calories_burned,
        });
      } else if (data.mode === "manual") {
        result = await logPlannedWorkout({
          entryText: `Ручний запис (${data.calories} ккал)`,
          caloriesBurned: data.calories!,
        });
      } else {
        result = await analyzeAndSaveActivityEntry(data.text!);
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Активність успішно додано!");
        reset({ mode: "ai", text: "", calories: undefined });
      }
    });
  };

  const handleDeleteActivity = (activityId: number) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold">
            Ви впевнені, що хочете видалити цю активність?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                startTransition(() => {
                  deleteActivity(activityId).then((res) => {
                    if (res.error) {
                      toast.error(res.error);
                    } else {
                      toast.success(res.success || "Активність видалено!");
                    }
                  });
                });
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Так, видалити
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
            >
              Скасувати
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const isButtonDisabled = isPending || (currentMode !== "planned" && !isValid);

  return (
    <Card>
      {activityLogData.length > 0 && (
        <div className="py-2 border-b border-gray-200">
          <h3 className="text-lg font-medium mb-3">Активність за сьогодні</h3>
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
        <h2 className="text-xl font-medium mb-4">Відстеження активності</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* radio */}
          <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
            <label className="flex-1 cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm flex justify-center items-center">
              <input
                type="radio"
                value="ai"
                {...register("mode")}
                checked={currentMode === "ai"}
                className="sr-only"
              />
              ШІ Аналіз
              <span className="ml-1 text-green-500 flex items-center gap-1">
                <Coins className="size-4" />
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
              Ввести вручну
            </label>
          </div>

          {todaysWorkout && todaysWorkout.estimated_calories_burned > 0 && (
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
                      {todaysWorkout.type} тренування
                    </span>
                  </div>
                  <div className="flex items-center text-red-500 text-sm font-medium">
                    <Flame className="size-4 mr-1" />
                    {todaysWorkout.estimated_calories_burned} ккал
                  </div>
                </div>
              </div>
            </label>
          )}

          {/* inputs */}
          {currentMode === "ai" && (
            <textarea
              {...register("text")}
              rows={2}
              className="w-full p-3 border rounded-lg"
              placeholder="Легкі садові роботи протягом 60 хвилин."
            />
          )}
          {currentMode === "manual" && (
            <input
              type="number"
              step="1"
              placeholder="Спалені калорії"
              {...register("calories")}
              className="w-full p-3 border rounded-lg"
            />
          )}

          {/* errors */}
          {errors.text && currentMode === "ai" && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}
          {errors.calories && currentMode === "manual" && (
            <p className="text-red-500 text-sm">{errors.calories.message}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isButtonDisabled}>
              {isPending ? "..." : "Додати"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
