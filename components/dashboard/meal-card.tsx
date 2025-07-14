"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeAndSaveFoodEntry, addManualFoodEntry } from "@/app/actions";
import { Button } from "../ui";
import { useTransition } from "react";

// Схема Zod тепер враховує всі можливі поля
const formSchema = z.object({
  entry_text: z.string().min(3, "Опис має бути довшим"),
  meal_type: z.string().min(1, "Вибери тип"),
  entry_mode: z.enum(["ai", "manual"]),
  calc_mode: z.enum(["serving", "per100g"]),
  servings: z.coerce.number().optional(),
  weight_eaten: z.coerce.number().optional(),
  calories: z.coerce.number().optional(),
  protein_g: z.coerce.number().optional(),
  fat_g: z.coerce.number().optional(),
  carbs_g: z.coerce.number().optional(),
  sugar_g: z.coerce.number().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

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
    control, // Потрібен для відстеження змін
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entry_mode: "ai", // Починаємо з режиму ШІ
      calc_mode: "per100g",
    },
  });

  // Відстежуємо поточний режим, щоб показувати/ховати відповідні поля
  const entryMode = useWatch({ control, name: "entry_mode" });
  const calcMode = useWatch({ control, name: "calc_mode" });

  const onSubmit = (data: FormSchema) => {
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
        result = await addManualFoodEntry({
          entry_text: data.entry_text,
          meal_type: data.meal_type,
          ...finalData,
        });
      }

      // Обробка результату
      if (result?.error) {
        alert("Помилка: " + result.error);
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
    <div
      className={`meal-card bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Додати прийом їжі
          </h3>

          <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
            <label className="flex-1 text-center cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm">
              <input
                type="radio"
                value="ai"
                {...register("entry_mode")}
                className="sr-only"
              />{" "}
              Аналіз ШІ
            </label>
            <label className="flex-1 text-center cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm">
              <input
                type="radio"
                value="manual"
                {...register("entry_mode")}
                className="sr-only"
              />{" "}
              Ввести вручну
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
                  На 100г
                </label>
                <label className="flex-1 text-center cursor-pointer p-1 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all">
                  <input
                    type="radio"
                    value="serving"
                    {...register("calc_mode")}
                    className="sr-only"
                  />{" "}
                  На порцію
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {calcMode === "per100g" ? (
                  <input
                    type="number"
                    placeholder="Скільки з'їв (г)"
                    {...register("weight_eaten")}
                    className="p-2 border rounded"
                  />
                ) : (
                  <input
                    type="number"
                    placeholder="К-сть порцій"
                    {...register("servings")}
                    className="p-2 border rounded"
                  />
                )}
                <input
                  type="number"
                  placeholder={`Калорії (на ${
                    calcMode === "per100g" ? "100г" : "порцію"
                  })`}
                  {...register("calories")}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder={`Білки (на ${
                    calcMode === "per100g" ? "100г" : "порцію"
                  })`}
                  {...register("protein_g")}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder={`Жири (на ${
                    calcMode === "per100g" ? "100г" : "порцію"
                  })`}
                  {...register("fat_g")}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder={`Вуглеводи (на ${
                    calcMode === "per100g" ? "100г" : "порцію"
                  })`}
                  {...register("carbs_g")}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder={`Цукор (на ${
                    calcMode === "per100g" ? "100г" : "порцію"
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
            placeholder="Опиши, що ти з'їв, або введи назву продукту..."
          />
          {errors.entry_text && <p>{errors.entry_text.message}</p>}

          <select
            {...register("meal_type")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
          >
            <option value="">-- Вибери тип --</option>
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
              {isPending ? "Обробка..." : "Додати запис"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
