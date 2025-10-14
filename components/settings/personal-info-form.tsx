"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../shared";
import { Button, SimpleRiseSpinner } from "../ui";
import { updatePersonalInfo } from "@/app/actions";
import toast from "react-hot-toast";
import { SETTINGS_TEXTS } from "./settings-text";

// Схема валідації залишається без змін
const personalInfoSchema = z.object({
  full_name: z.string().optional(),
  current_weight_kg: z.coerce
    .number()
    .positive(SETTINGS_TEXTS.PERSONAL_INFO_FORM.Z_WEIGHT_POSITIVE),
  height_cm: z.coerce
    .number()
    .positive(SETTINGS_TEXTS.PERSONAL_INFO_FORM.Z_HEIGHT_POSITIVE),
  age: z.coerce
    .number()
    .positive(SETTINGS_TEXTS.PERSONAL_INFO_FORM.Z_AGE_POSITIVE)
    .int(),
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
      <h2 className="text-xl font-semibold mb-6">
        {SETTINGS_TEXTS.PERSONAL_INFO_FORM.PERSONAL_INFO}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {SETTINGS_TEXTS.PERSONAL_INFO_FORM.FULL_NAME}
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

          <div>
            <label
              htmlFor="current_weight_kg"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {SETTINGS_TEXTS.PERSONAL_INFO_FORM.CURRENT_WEIGHT}
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

          <div>
            <label
              htmlFor="height_cm"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {SETTINGS_TEXTS.PERSONAL_INFO_FORM.HEIGHT}
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

          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {SETTINGS_TEXTS.PERSONAL_INFO_FORM.AGE}
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

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {SETTINGS_TEXTS.PERSONAL_INFO_FORM.GENDER}
            </label>
            <select
              id="gender"
              {...register("gender")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="male">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.MALE}
              </option>
              <option value="female">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.FEMALE}
              </option>
              <option value="other">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.OTHER}
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="activity_level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {SETTINGS_TEXTS.PERSONAL_INFO_FORM.ACTIVITY_LEVEL}
            </label>
            <select
              id="activity_level"
              {...register("activity_level")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="sedentary">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.SEDENTARY}
              </option>
              <option value="light">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.LIGHT}
              </option>
              <option value="moderate">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.MODERATE}
              </option>
              <option value="active">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.ACTIVE}
              </option>
              <option value="ultra">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.ULTRA}
              </option>
            </select>
          </div>

          {/* Ціль */}
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {SETTINGS_TEXTS.PERSONAL_INFO_FORM.GOAL}
            </label>
            <select
              id="goal"
              {...register("goal")}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="lose">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.LOSE}
              </option>
              <option value="maintain">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.MAINTAIN}
              </option>
              <option value="gain">
                {SETTINGS_TEXTS.PERSONAL_INFO_FORM.GAIN}
              </option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <SimpleRiseSpinner className="w-[67px]" />
            ) : (
              SETTINGS_TEXTS.PERSONAL_INFO_FORM.SAVE_BUTTON
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
