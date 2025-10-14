// components/coach/workout-plan-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAndAnalyzeWorkoutPlan } from "@/app/actions";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Card } from "../shared/card";
import { Button } from "../ui/button";
import { Coins } from "lucide-react";
import { SimpleRiseSpinner } from "../ui";
import { AI_ANALYZE } from "@/lib/const";
import { COACH_TEXTS } from "./coach-text";

const formSchema = z.object({
  equipmentText: z
    .string()
    .min(3, { message: COACH_TEXTS.WORKOUT_PLAN_FORM.Z_TEXT }),
  durationMinutes: z.coerce
    .number()
    .min(15, { message: COACH_TEXTS.WORKOUT_PLAN_FORM.Z_DURATION }),
});

type FormSchema = z.infer<typeof formSchema>;

export function WorkoutPlanForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    startTransition(async () => {
      const result = await createAndAnalyzeWorkoutPlan(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(COACH_TEXTS.WORKOUT_PLAN_FORM.TOAST_SUCCESS);
        reset();
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold text-stone-800">
          {COACH_TEXTS.WORKOUT_PLAN_FORM.TITLE}
        </h2>
        <div className="space-y-2">
          <textarea
            {...register("equipmentText")}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder={COACH_TEXTS.WORKOUT_PLAN_FORM.Z_TEXT}
          />
          {errors.equipmentText && (
            <p className="text-red-500 text-sm">
              {errors.equipmentText.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <input
            type="number"
            {...register("durationMinutes")}
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder={COACH_TEXTS.WORKOUT_PLAN_FORM.Z_DURATION}
          />
          {errors.durationMinutes && (
            <p className="text-red-500 text-sm">
              {errors.durationMinutes.message}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div />
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <SimpleRiseSpinner className="w-[174px]" />
            ) : (
              <span className="flex items-center gap-2">
                {COACH_TEXTS.WORKOUT_PLAN_FORM.GENERATE_PLAN}{" "}
                <Coins className="size-5" />
                {AI_ANALYZE}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
