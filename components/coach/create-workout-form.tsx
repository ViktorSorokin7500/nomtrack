"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Card } from "../shared/card";
import { Button } from "../ui/button";
import { Coins } from "lucide-react";
import { createAndAnalyzeWorkout } from "@/app/actions";
import { SimpleRiseSpinner } from "../ui";
import { AI_REQUEST } from "@/lib/const";
import { COACH_TEXTS } from "./coach-text";

const schema = z.object({
  workoutName: z.string().min(3, COACH_TEXTS.CREATE_WORKOUT_FORM.NAME_ERROR),
  workoutText: z.string().min(10, COACH_TEXTS.CREATE_WORKOUT_FORM.TEXT_ERROR),
});

type Schema = z.infer<typeof schema>;

export function CreateWorkoutForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Schema) => {
    startTransition(async () => {
      const result = await createAndAnalyzeWorkout(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(COACH_TEXTS.CREATE_WORKOUT_FORM.SUCCESS);
        reset();
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold text-stone-800">
          {COACH_TEXTS.CREATE_WORKOUT_FORM.TITLE}
        </h2>
        <div className="space-y-2">
          <label
            htmlFor="workoutName"
            className="block text-sm font-medium text-gray-700"
          >
            {COACH_TEXTS.CREATE_WORKOUT_FORM.LABEL_NAME}
          </label>
          <input
            {...register("workoutName")}
            id="workoutName"
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder={COACH_TEXTS.CREATE_WORKOUT_FORM.LABEL_NAME_PLACEHOLDER}
          />
          {errors.workoutName && (
            <p className="text-red-500 text-sm">{errors.workoutName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="workoutText"
            className="block text-sm font-medium text-gray-700"
          >
            {COACH_TEXTS.CREATE_WORKOUT_FORM.LABEL_DESCRIPTION}
          </label>
          <textarea
            {...register("workoutText")}
            id="workoutText"
            rows={4}
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder={
              COACH_TEXTS.CREATE_WORKOUT_FORM.LABEL_DESCRIPTION_PLACEHOLDER
            }
          />
          {errors.workoutText && (
            <p className="text-red-500 text-sm">{errors.workoutText.message}</p>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <SimpleRiseSpinner className="w-[195px]" />
            ) : (
              <span className="flex items-center gap-2">
                {COACH_TEXTS.CREATE_WORKOUT_FORM.SUBMIT_BUTTON}{" "}
                <Coins className="size-5" />
                {AI_REQUEST}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
