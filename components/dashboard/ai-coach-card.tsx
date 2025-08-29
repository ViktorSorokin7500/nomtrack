"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeAndSaveActivityEntry, logPlannedWorkout } from "@/app/actions";
import { useTransition, useState } from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { ActivityEntryCard } from "./activity-entry-card";
import toast from "react-hot-toast";
import { Coins, Dumbbell, Flame } from "lucide-react";

// Типи для пропсів
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
    exercises: {
      name: string;
    }[];
  } | null;
}

const activitySchema = z.object({
  text: z
    .string()
    .min(3, { message: "Опишіть, будь ласка, активність детальніше" }),
});
type ActivitySchema = z.infer<typeof activitySchema>;

export function AICoachCard({
  activityLogData,
  todaysWorkout,
}: AICoachCardProps) {
  const [isPending, startTransition] = useTransition();
  const [usePlanned, setUsePlanned] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
  });

  const onSubmit = async (data: ActivitySchema) => {
    startTransition(async () => {
      let result;
      if (usePlanned && todaysWorkout) {
        // Логіка для запланованого тренування
        result = await logPlannedWorkout({
          entryText: `${todaysWorkout.type} тренування`,
          caloriesBurned: todaysWorkout.estimated_calories_burned,
        });
      } else {
        // Логіка для ручного введення
        result = await analyzeAndSaveActivityEntry(data.text);
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Активність успішно додано!");
        reset();
        setUsePlanned(false); // Скидаємо стан
      }
    });
  };

  return (
    <Card>
      {activityLogData.length > 0 && (
        <div className="py-2 border-b border-gray-200">
          <h3 className="text-lg font-medium text-stone-900 mb-3">
            Активність за сьогодні
          </h3>
          <div className="space-y-2">
            {activityLogData.map((entry) => (
              <ActivityEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      <div className="py-2">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-medium text-stone-900">
            Відстеження активності
          </h2>
          <span className="flex gap-0.5 ml-1 text-green-500">
            <Coins className="size-5" />1
          </span>
        </div>

        {todaysWorkout?.estimated_calories_burned !== undefined &&
          todaysWorkout.estimated_calories_burned > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-stone-700 mb-2">
                Заплановано на сьогодні:
              </p>
              <div
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  usePlanned
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setUsePlanned(!usePlanned)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Dumbbell size={20} className="text-orange-600" />
                    <span className="font-semibold text-stone-800">
                      {todaysWorkout.type} тренування
                    </span>
                  </div>
                  <div className="flex items-center text-red-500 text-sm font-medium">
                    <Flame className="size-4 mr-1" />
                    {todaysWorkout.estimated_calories_burned} ккал
                  </div>
                </div>
              </div>
              {usePlanned && (
                <div className="text-xs text-gray-500 mt-2">
                  Буде додано як Тренування ({todaysWorkout.type}).
                </div>
              )}
            </div>
          )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!usePlanned && (
            <textarea
              {...register("text")}
              rows={2}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="Легкі садові роботи (полив) протягом 60 хвилин."
              disabled={usePlanned}
            />
          )}
          {errors.text && !usePlanned && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <span className="w-[53px] flex items-center justify-center gap-2 animate-pulse">
                  <div className="size-1 rounded-full bg-white animate-bounce" />
                  <div className="size-1 rounded-full bg-white animate-bounce delay-150" />
                  <div className="size-1 rounded-full bg-white animate-bounce delay-300" />
                </span>
              ) : (
                "Додати"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
