"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeAndSaveFoodEntry, addManualFoodEntry } from "@/app/actions";
import { Button } from "../ui";
import { useTransition } from "react";
import { foodEntrySchema, type FoodEntryFormSchema } from "@/lib/validators";
import toast from "react-hot-toast";
import { Card } from "../shared";

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
    control,
    formState: { errors },
  } = useForm<FoodEntryFormSchema>({
    // <-- Використовуємо імпортований тип
    resolver: zodResolver(foodEntrySchema), // <-- Використовуємо імпортовану схему
    defaultValues: {
      entry_mode: "ai",
      calc_mode: "per100g",
    },
  });

  // Відстежуємо поточний режим, щоб показувати/ховати відповідні поля
  const entryMode = useWatch({ control, name: "entry_mode" });
  const calcMode = useWatch({ control, name: "calc_mode" });

  const onSubmit = (data: FoodEntryFormSchema) => {
    startTransition(async () => {
      let result;

      if (data.entry_mode === "ai") {
        // --- Сценарій 1: Аналіз через ШІ ---
        result = await analyzeAndSaveFoodEntry({
          text: data.entry_text,
          mealType: data.meal_type,
        });
      } else {
        // --- Сценарій 2: Ручне введення ---
        const finalData = {
          calories: 0,
          protein_g: 0,
          fat_g: 0,
          carbs_g: 0,
          sugar_g: 0,
          water_ml: 0,
        };

        // Розраховуємо фінальні БЖВК на клієнті
        if (data.calc_mode === "per100g") {
          const multiplier = (data.weight_eaten || 0) / 100;
          finalData.calories = (data.calories || 0) * multiplier;
          finalData.protein_g = (data.protein_g || 0) * multiplier;
          finalData.fat_g = (data.fat_g || 0) * multiplier;
          finalData.carbs_g = (data.carbs_g || 0) * multiplier;
          finalData.sugar_g = (data.sugar_g || 0) * multiplier;
        } else {
          // Режим "на порцію"
          const servings = data.servings || 1;
          finalData.calories = (data.calories || 0) * servings;
          finalData.protein_g = (data.protein_g || 0) * servings;
          finalData.fat_g = (data.fat_g || 0) * servings;
          finalData.carbs_g = (data.carbs_g || 0) * servings;
          finalData.sugar_g = (data.sugar_g || 0) * servings;
        }

        // Викликаємо просту Server Action для збереження порахованих даних
        result = await addManualFoodEntry(data);
      }

      // Обробка результату
      if (result?.error) {
        console.log("result.error =>:", result.error);

        toast.error("Error: Invalid input or food not found");
      } else {
        reset({
          ...data, // Зберігаємо вибір режимів
          entry_text: "", // Але очищуємо основні поля
          calories: undefined,
          protein_g: undefined,
          fat_g: undefined,
          carbs_g: undefined,
          sugar_g: undefined,
          servings: undefined,
          weight_eaten: undefined,
        });
      }
    });
  };

  return (
    <Card
      className={`meal-card bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Add Meal</h3>

          <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
            <label className="flex-1 text-center cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm">
              <input
                type="radio"
                value="ai"
                {...register("entry_mode")}
                className="sr-only"
              />{" "}
              AI Analysis
            </label>
            <label className="flex-1 text-center cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm">
              <input
                type="radio"
                value="manual"
                {...register("entry_mode")}
                className="sr-only"
              />{" "}
              Enter Manually
            </label>
          </div>

          {entryMode === "manual" && (
            <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
              <div className="flex gap-2 rounded-lg bg-gray-200 p-1 text-sm">
                <label className="flex-1 text-center cursor-pointer p-1 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all">
                  <input
                    type="radio"
                    value="per100g"
                    {...register("calc_mode")}
                    className="sr-only"
                  />{" "}
                  Per 100g
                </label>
                <label className="flex-1 text-center cursor-pointer p-1 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all">
                  <input
                    type="radio"
                    value="serving"
                    {...register("calc_mode")}
                    className="sr-only"
                  />{" "}
                  Per Serving
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {calcMode === "per100g" ? (
                  <input
                    type="number"
                    step={0.01}
                    placeholder="Weight (g)"
                    {...register("weight_eaten")}
                    className="p-2 border rounded"
                  />
                ) : (
                  <input
                    type="number"
                    step={0.01}
                    placeholder="Servings"
                    {...register("servings")}
                    className="p-2 border rounded"
                  />
                )}
                <input
                  type="number"
                  step={0.01}
                  placeholder={`Calories  (per  ${
                    calcMode === "per100g" ? "100г" : "serving"
                  })`}
                  {...register("calories")}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder={`Protein  (per  ${
                    calcMode === "per100g" ? "100г" : "serving"
                  })`}
                  {...register("protein_g")}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder={`Fat  (per  ${
                    calcMode === "per100g" ? "100г" : "serving"
                  })`}
                  {...register("fat_g")}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder={`Carbs  (per  ${
                    calcMode === "per100g" ? "100г" : "serving"
                  })`}
                  {...register("carbs_g")}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder={`Sugar (per  ${
                    calcMode === "per100g" ? "100г" : "serving"
                  })`}
                  {...register("sugar_g")}
                  className="p-2 border rounded"
                />
              </div>
            </div>
          )}

          <textarea
            {...register("entry_text")}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700"
            rows={2}
            placeholder="Describe your meal or enter a food name..."
          />
          {errors.entry_text && (
            <p className="text-red-500 text-sm">{errors.entry_text.message}</p>
          )}

          <select
            {...register("meal_type")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
          >
            <option value="">-- Select a meal type --</option>
            {availableMealTypes.map((meal) => (
              <option key={meal.value} value={meal.value}>
                {meal.label}
              </option>
            ))}
          </select>
          {errors.meal_type && (
            <p className="text-red-500 text-sm">{errors.meal_type.message}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Processing..." : "Add Entry"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
