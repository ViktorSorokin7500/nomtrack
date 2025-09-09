"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../shared";
import { Button, SimpleRiseSpinner } from "../ui";
import { updateNutritionTargets } from "@/app/actions";
import toast from "react-hot-toast";

// Схема Zod для валідації полів самої форми
const targetsSchema = z.object({
  target_calories: z.coerce.number().positive().int(),
  target_protein_g: z.coerce.number().positive().int(),
  target_carbs_g: z.coerce.number().positive().int(),
  target_fat_g: z.coerce.number().positive().int(),
  target_water_ml: z.coerce.number().positive().int(),
});

type TargetsSchema = z.infer<typeof targetsSchema>;

type Profile = {
  id: string;
  email?: string;
  full_name?: string | null;
  current_weight_kg?: number | null;
  height_cm?: number | null;
  age?: number | null;
  gender?: string | null;
  activity_level?: string | null;
  goal?: string | null;
  target_calories?: number | null;
  target_protein_g?: number | null;
  target_fat_g?: number | null;
  target_carbs_g?: number | null;
  target_water_ml?: number | null;
};

// ВИПРАВЛЕННЯ 1: Використовуємо наш новий тип у пропсах
export function NutritionTargetsForm({
  initialData,
}: {
  initialData: Profile;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TargetsSchema>({
    resolver: zodResolver(targetsSchema),
    // Використовуємо initialData для заповнення форми
    defaultValues: {
      target_calories: initialData?.target_calories || 0,
      target_protein_g: initialData?.target_protein_g || 0,
      target_carbs_g: initialData?.target_carbs_g || 0,
      target_fat_g: initialData?.target_fat_g || 0,
      target_water_ml: initialData?.target_water_ml || 0,
    },
  });

  const handleAutoCalculate = () => {
    const { gender, current_weight_kg, height_cm, age, activity_level, goal } =
      initialData;
    if (!current_weight_kg || !height_cm || !age) {
      toast.error(
        'Будь ласка, спочатку вкажіть свою вагу, зріст та вік в розділі "Особисті дані".'
      );
      return;
    }

    const s = gender === "female" ? -161 : 5;
    const bmr = 10 * current_weight_kg + 6.25 * height_cm - 5 * age + s;

    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      ultra: 1.9,
    };
    const tdee = bmr * (activityFactors[activity_level || "sedentary"] || 1.2);

    const goalAdjustments: { [key: string]: number } = {
      lose: -400,
      maintain: 0,
      gain: 400,
    };
    const finalCalories = Math.round(
      tdee + (goalAdjustments[goal || "maintain"] || 0)
    );

    const protein = Math.round((finalCalories * 0.3) / 4);
    const carbs = Math.round((finalCalories * 0.4) / 4);
    const fat = Math.round((finalCalories * 0.3) / 9);
    const waterTarget = Math.round(current_weight_kg * 25);

    setValue("target_calories", finalCalories);
    setValue("target_protein_g", protein);
    setValue("target_carbs_g", carbs);
    setValue("target_fat_g", fat);
    setValue("target_water_ml", waterTarget);
    toast.success(
      'Цілі розраховано! Натисніть "Зберегти зміни", щоб застосувати.'
    );
  };

  const onSubmit = async (data: TargetsSchema) => {
    const result = await updateNutritionTargets(data);
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">
        Цільові показники харчування
      </h2>
      <div className="flex justify-center mb-6">
        <Button
          type="button"
          onClick={handleAutoCalculate}
          variant="outline"
          className="bg-lime-400 hover:bg-lime-300 text-stone-800 font-semibold py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-100!"
        >
          Розрахувати автоматично
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="target_calories">Калорії на день (ккал)</label>
            <input
              id="target_calories"
              type="number"
              {...register("target_calories")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.target_calories && (
              <p className="text-red-500 text-sm mt-1">
                {errors.target_calories.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="target_protein_g">Білки (г)</label>
            <input
              id="target_protein_g"
              type="number"
              {...register("target_protein_g")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.target_protein_g && (
              <p className="text-red-500 text-sm mt-1">
                {errors.target_protein_g.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="target_carbs_g">Вуглеводи (г)</label>
            <input
              id="target_carbs_g"
              type="number"
              {...register("target_carbs_g")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.target_carbs_g && (
              <p className="text-red-500 text-sm mt-1">
                {errors.target_carbs_g.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="target_fat_g">Жири (г)</label>
            <input
              id="target_fat_g"
              type="number"
              {...register("target_fat_g")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.target_fat_g && (
              <p className="text-red-500 text-sm mt-1">
                {errors.target_fat_g.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="target_water_ml">Вода (мл)</label>
            <input
              id="target_water_ml"
              type="number"
              {...register("target_water_ml")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.target_water_ml && (
              <p className="text-red-500 text-sm mt-1">
                {errors.target_water_ml.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <SimpleRiseSpinner className="w-[109px]" />
            ) : (
              "Зберегти зміни"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
