"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeAndSaveFoodEntry, addManualFoodEntry } from "@/app/actions";
import { Button } from "../ui";
import { useEffect, useTransition } from "react";
import { foodEntrySchema, type FoodEntryFormSchema } from "@/lib/validators";
import toast from "react-hot-toast";
import { Card } from "../shared";
import { UserRecipe } from "@/types";

interface MealCardProps {
  availableMealTypes: { value: string; label: string }[];
  userRecipes: UserRecipe[];
  className?: string;
}

export function MealCard({
  availableMealTypes,
  userRecipes,
  className,
}: MealCardProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FoodEntryFormSchema>({
    resolver: zodResolver(foodEntrySchema),
    defaultValues: {
      entry_mode: "ai",
      calc_mode: "per100g",
      meal_type: "",
      selected_recipe_id: "",
      entry_text: "",
    },
  });

  const entryMode = useWatch({ control, name: "entry_mode" });
  const selectedRecipeId = useWatch({ control, name: "selected_recipe_id" });
  const isRecipeSelected = entryMode === "manual" && !!selectedRecipeId;

  // --- ДІАГНОСТИКА: Перевіряємо, чи компонент взагалі отримує рецепти ---
  useEffect(() => {
    console.log("MealCard отримав рецепти:", userRecipes);
  }, [userRecipes]);

  // --- ОСНОВНА ЛОГІКА: Автозаповнення форми при виборі рецепту ---
  useEffect(() => {
    // Якщо режим не ручний, нічого не робимо
    if (entryMode !== "manual") return;

    console.log(`Обрано ID рецепту: '${selectedRecipeId}'`);

    if (!selectedRecipeId) {
      // Користувач обрав "-- Ввести дані вручну --", очищуємо поля
      console.log("Рецепт не обрано, очищуємо поля для ручного вводу.");
      setValue("entry_text", "");
      setValue("calories", undefined);
      setValue("protein_g", undefined);
      setValue("fat_g", undefined);
      setValue("carbs_g", undefined);
      setValue("sugar_g", undefined);
      return;
    }

    const recipe = userRecipes.find(
      (r) => String(r.id) === String(selectedRecipeId)
    );

    if (recipe) {
      // ЗНАЙШЛИ РЕЦЕПТ! Заповнюємо форму.
      console.log("ЗНАЙДЕНО РЕЦЕПТ:", recipe);
      setValue("entry_text", recipe.recipe_name);
      setValue("calc_mode", "per100g");
      setValue("calories", recipe.calories_per_100g);
      setValue("protein_g", recipe.protein_per_100g);
      setValue("fat_g", recipe.fat_per_100g);
      setValue("carbs_g", recipe.carbs_per_100g);
      setValue("sugar_g", recipe.sugar_per_100g);
    } else {
      // ЦЕ ПОГАНО: ID є, але рецепт не знайдено.
      console.error(
        `ПОМИЛКА: Не вдалося знайти рецепт з ID: ${selectedRecipeId}`
      );
    }
  }, [selectedRecipeId, entryMode, userRecipes, setValue]);

  const onSubmit = (data: FoodEntryFormSchema) => {
    startTransition(async () => {
      let result;
      if (data.entry_mode === "ai") {
        result = await analyzeAndSaveFoodEntry({
          text: data.entry_text!,
          mealType: data.meal_type,
        });
      } else {
        result = await addManualFoodEntry(data);
      }

      if (result?.error) {
        toast.error(`Помилка: ${result.error}`);
      } else {
        toast.success("Запис успішно додано!");
        reset({
          entry_mode: data.entry_mode,
          calc_mode: "per100g",
          meal_type: "",
          selected_recipe_id: "",
          entry_text: "",
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
              />
              AI Аналіз
            </label>
            <label className="flex-1 text-center cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm">
              <input
                type="radio"
                value="manual"
                {...register("entry_mode")}
                className="sr-only"
              />
              Ввести вручну
            </label>
          </div>

          {entryMode === "manual" && (
            <div className="p-4 border rounded-lg space-y-4 bg-gray-50/70">
              {userRecipes?.length > 0 && (
                <select
                  {...register("selected_recipe_id")}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="">-- Ввести дані вручну --</option>
                  <option value="" disabled>
                    Або обрати мій рецепт:
                  </option>
                  {userRecipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.recipe_name}
                    </option>
                  ))}
                </select>
              )}

              {!isRecipeSelected && (
                <div className="flex gap-2 rounded-lg bg-gray-200 p-1 text-sm">
                  <label className="flex-1 text-center cursor-pointer p-1 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all">
                    <input
                      type="radio"
                      value="per100g"
                      {...register("calc_mode")}
                      className="sr-only"
                    />
                    На 100г
                  </label>
                  <label className="flex-1 text-center cursor-pointer p-1 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all">
                    <input
                      type="radio"
                      value="serving"
                      {...register("calc_mode")}
                      className="sr-only"
                    />
                    На порцію
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="1"
                  placeholder="Вага (г)"
                  {...register("weight_eaten", { valueAsNumber: true })}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Калорії"
                  {...register("calories", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected}
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder="Білки"
                  {...register("protein_g", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected}
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder="Жири"
                  {...register("fat_g", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected}
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder="Вуглеводи"
                  {...register("carbs_g", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected}
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder="Цукор"
                  {...register("sugar_g", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected}
                />
              </div>
              {errors.weight_eaten && (
                <p className="text-red-500 text-sm">
                  {errors.weight_eaten.message}
                </p>
              )}
            </div>
          )}

          {(entryMode === "ai" || !isRecipeSelected) && (
            <div>
              <textarea
                {...register("entry_text")}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-700"
                rows={2}
                placeholder={
                  entryMode === "ai"
                    ? "Опишіть вашу страву для аналізу..."
                    : "Введіть назву продукту..."
                }
              />
              {errors.entry_text && (
                <p className="text-red-500 text-sm">
                  {errors.entry_text.message}
                </p>
              )}
            </div>
          )}

          <select
            {...register("meal_type")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
          >
            <option value="" disabled>
              -- Оберіть прийом їжі --
            </option>
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
    </Card>
  );
}
