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

const formSchema = z.object({
  equipmentText: z
    .string()
    .min(3, { message: "Опишіть, будь ласка, наявний інвентар." }),
  durationMinutes: z.coerce
    .number()
    .min(15, { message: "Тривалість має бути не менше 15 хвилин." }),
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
        toast.success("План тренувань успішно згенеровано!");
        reset();
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold text-stone-800">
          Створити новий план тренувань
        </h2>
        <div className="space-y-2">
          <textarea
            {...register("equipmentText")}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder="Опишіть ваш інвентар (напр., 'лише власна вага', 'гантелі 5кг, фітнес-гумка')."
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
            placeholder="Бажана тривалість тренування (хв)"
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
              <span className="w-[100px] flex items-center justify-center animate-pulse">
                Генерація...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Згенерувати план <Coins className="size-5" />5
              </span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
