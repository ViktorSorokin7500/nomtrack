"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { updatePersonalInfo } from "@/app/actions";

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
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"success" | "error" | null>(
    null
  );

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
    setMessage("");
    setFormStatus(null);

    const result = await updatePersonalInfo(data);

    if (result?.error) {
      setMessage(result.error);
      setFormStatus("error");
      setTimeout(() => {
        setMessage("");
        setFormStatus(null);
      }, 10000);
    } else if (result?.success) {
      setMessage(result.success);
      setFormStatus("success");
      setTimeout(() => {
        setMessage("");
        setFormStatus(null);
      }, 10000);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Поле для імені */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
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
              Weight (kg)
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
              Height (cm)
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
              Age
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
              Gender
            </label>
            <select
              id="gender"
              {...register("gender")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Рівень активності */}
          <div>
            <label
              htmlFor="activity_level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Activity Level
            </label>
            <select
              id="activity_level"
              {...register("activity_level")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly active</option>
              <option value="moderate">Moderately active</option>
              <option value="active">Active</option>
              <option value="ultra">Very active</option>
            </select>
          </div>

          {/* Ціль */}
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Goal
            </label>
            <select
              id="goal"
              {...register("goal")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Muscle</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Збереження..." : "Зберегти зміни"}
          </Button>
        </div>
        {/* ВИПРАВЛЕННЯ 2: Використовуємо 'formStatus' для визначення кольору */}
        {message && (
          <p
            className={`mt-4 text-center ${
              formStatus === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </Card>
  );
}
