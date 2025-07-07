// components/dashboard/MealCard.tsx

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeAndSaveFoodEntry } from "@/app/actions";
import { Button } from "../ui";
import { useTransition } from "react";

// Схема валідації для поля вводу
const foodEntrySchema = z.object({
  text: z.string().min(3, { message: "Опис має бути довшим" }),
});

type FoodEntrySchema = z.infer<typeof foodEntrySchema>;

// Пропси для картки
interface MealCardProps {
  mealName: string;
  headerColor: string;
  className?: string;
  // Ці пропси для снеків, ми їх поки не чіпаємо
  isSnack?: boolean;
  onRemove?: () => void;
}

export function MealCard({ mealName, headerColor, className }: MealCardProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset, // Функція для очищення форми
    formState: { errors },
  } = useForm<FoodEntrySchema>({
    resolver: zodResolver(foodEntrySchema),
  });

  const onSubmit = async (data: FoodEntrySchema) => {
    startTransition(async () => {
      const result = await analyzeAndSaveFoodEntry({
        text: data.text,
        mealType: mealName,
      });

      if (result?.error) {
        alert("Помилка: " + result.error); // Поки що просто alert для помилок
      } else {
        reset(); // Очищуємо форму після успішної відправки
      }
    });
  };

  return (
    <div
      className={`meal-card bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div
        className={`px-6 py-3 flex justify-between items-center ${headerColor}`}
      >
        <h3 className="text-lg font-medium text-gray-700">{mealName}</h3>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...register("text")}
            className="w-full p-3 border border-gray-200 rounded-lg mb-4 text-gray-700"
            rows={2}
            placeholder={`Опиши свій ${mealName.toLowerCase()}...`}
          ></textarea>
          {errors.text && (
            <p className="text-red-500 text-sm mb-2">{errors.text.message}</p>
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
