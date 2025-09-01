"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Card } from "../shared/card";
import { Button } from "../ui/button";
import { Coins } from "lucide-react";
import { createAndAnalyzeWorkout } from "@/app/actions"; // Імпортуємо наш новий екшен

const schema = z.object({
  workoutName: z.string().min(3, "Назва має бути довшою."),
  workoutText: z.string().min(10, "Будь ласка, детально опишіть вправи."),
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
        toast.success("Тренування успішно створено!");
        reset();
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold text-stone-800">
          Створити нове тренування
        </h2>
        <div className="space-y-2">
          <label
            htmlFor="workoutName"
            className="block text-sm font-medium text-gray-700"
          >
            Назва тренування
          </label>
          <input
            {...register("workoutName")}
            id="workoutName"
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder="Напр., 'Пробіжка + підтягування'"
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
            Опис тренування
          </label>
          <textarea
            {...register("workoutText")}
            id="workoutText"
            rows={4}
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder="Опишіть ваше тренування для аналізу ШІ. Напр., 'Пробіжка 30 хв, 3 підходи по 10 віджимань'."
          />
          {errors.workoutText && (
            <p className="text-red-500 text-sm">{errors.workoutText.message}</p>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <span className="w-[100px] flex items-center justify-center animate-pulse">
                Аналіз...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Зберегти тренування <Coins className="size-5" />1
              </span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
