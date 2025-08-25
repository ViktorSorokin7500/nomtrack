"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../shared";
import { Button } from "../ui";
import { updatePersonalInfo } from "@/app/actions";
import toast from "react-hot-toast";

// Схема валідації залишається без змін
const personalInfoSchema = z.object({
  full_name: z.string().optional(),
  current_weight_kg: z.coerce.number().positive("Вага має бути > 0"),
  height_cm: z.coerce.number().positive("Зріст має бути > 0"),
  age: z.coerce.number().positive("Вік має бути > 0").int(),
  gender: z.enum(["male", "female", "other"]),
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "ultra"]),
  goal: z.enum(["lose", "maintain", "gain"]),
});

type PersonalInfoSchema = z.infer<typeof personalInfoSchema>;

type PersonalInfoFormProps = {
  initialData: Partial<PersonalInfoSchema>;
};

export function PersonalInfoForm({ initialData }: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoSchema>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: initialData?.full_name || "",
      current_weight_kg: initialData?.current_weight_kg || undefined,
      height_cm: initialData?.height_cm || undefined,
      age: initialData?.age || undefined,
      gender: initialData?.gender || "other",
      activity_level: initialData?.activity_level || "sedentary",
      goal: initialData?.goal || "maintain",
    },
  });

  const onSubmit = async (data: PersonalInfoSchema) => {
    const result = await updatePersonalInfo(data);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Особисті дані</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Поле для імені */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Повне ім&apos;я
            </label>
            <input
              id="full_name"
              type="text"
              {...register("full_name")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Вага */}
          <div>
            <label
              htmlFor="current_weight_kg"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Вага (кг)
            </label>
            <input
              id="current_weight_kg"
              type="number"
              step="0.1"
              {...register("current_weight_kg")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.current_weight_kg && (
              <p className="text-red-500 text-sm mt-1">
                {errors.current_weight_kg.message}
              </p>
            )}
          </div>

          {/* Зріст */}
          <div>
            <label
              htmlFor="height_cm"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Зріст (см)
            </label>
            <input
              id="height_cm"
              type="number"
              {...register("height_cm")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.height_cm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.height_cm.message}
              </p>
            )}
          </div>

          {/* Вік */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Вік
            </label>
            <input
              id="age"
              type="number"
              {...register("age")}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Стать */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Стать
            </label>
            <select
              id="gender"
              {...register("gender")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="male">Стать</option>
              <option value="female">Жіноча</option>
              <option value="other">Інша</option>
            </select>
          </div>

          {/* Рівень активності */}
          <div>
            <label
              htmlFor="activity_level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Рівень активності
            </label>
            <select
              id="activity_level"
              {...register("activity_level")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="sedentary">Сидячий спосіб життя</option>
              <option value="light">Низька активність</option>
              <option value="moderate">Помірна активність</option>
              <option value="active">Активний</option>
              <option value="ultra">Дуже активний</option>
            </select>
          </div>

          {/* Ціль */}
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ціль
            </label>
            <select
              id="goal"
              {...register("goal")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="lose">Скинути вагу</option>
              <option value="maintain">Підтримувати вагу</option>
              <option value="gain">Набрати м&apos;язову масу</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="w-[67px] flex items-center justify-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-white animate-bounce delay-150" />
                <div className="w-2 h-2 rounded-full bg-white animate-bounce delay-300" />
              </span>
            ) : (
              "Зберегти"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
