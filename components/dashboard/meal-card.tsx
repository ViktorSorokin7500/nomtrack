"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeAndSaveFoodEntry } from "@/app/actions";
import { Button } from "../ui";
import { useTransition } from "react";

// Додаємо mealType в схему валідації
const foodEntrySchema = z.object({
  text: z.string().min(3, { message: "Опис має бути довшим" }),
  mealType: z.string().min(1, { message: "Вибери тип прийому їжі" }),
});

type FoodEntrySchema = z.infer<typeof foodEntrySchema>;

interface MealCardProps {
  availableMealTypes: { value: string; label: string }[];
  className?: string;
}

export function MealCard({ availableMealTypes, className }: MealCardProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FoodEntrySchema>({
    resolver: zodResolver(foodEntrySchema),
  });

  const onSubmit = async (data: FoodEntrySchema) => {
    startTransition(async () => {
      const result = await analyzeAndSaveFoodEntry({
        text: data.text,
        mealType: data.mealType,
      });
      if (result?.error) {
        alert("Помилка: " + result.error);
      } else {
        reset();
      }
    });
  };

  return (
    <div
      className={`meal-card bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Додати прийом їжі
          </h3>

          <textarea
            {...register("text")}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700"
            rows={2}
            placeholder="Опиши, що ти з'їв..."
          />
          {errors.text && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}

          <select
            {...register("mealType")}
            className="w-full px-4 py-3 rounded-xl border"
          >
            <option value="">-- Вибери тип --</option>
            {availableMealTypes.map((meal) => (
              <option key={meal.value} value={meal.value}>
                {meal.label}
              </option>
            ))}
          </select>
          {errors.mealType && (
            <p className="text-red-500 text-sm">{errors.mealType.message}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Аналіз..." : "Проаналізувати і зберегти"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
