// @/lib/validators.ts
import { z } from "zod";

const numberOrNull = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.number().min(0).optional().nullable()
);

export const foodEntrySchema = z
  .object({
    entry_mode: z.enum(["ai", "manual"]),
    calc_mode: z.enum(["per100g", "serving"]).optional(),

    entry_text: z.string().optional(),
    meal_type: z.string().min(1, "Будь ласка, оберіть прийом їжі."),

    calories: z.coerce.number().min(0).optional().nullable(),
    protein_g: z.coerce.number().min(0).optional().nullable(),
    fat_g: z.coerce.number().min(0).optional().nullable(),
    carbs_g: z.coerce.number().min(0).optional().nullable(),
    sugar_g: z.coerce.number().min(0).optional().nullable(),

    weight_eaten: numberOrNull,
    servings: numberOrNull,

    selected_recipe_id: z.string().optional(),
    selected_global_food_name: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // --- УМОВНА ВАЛІДАЦІЯ ---

    if (
      data.entry_mode === "ai" &&
      (!data.entry_text || data.entry_text.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Будь ласка, опишіть вашу страву для аналізу.",
        path: ["entry_text"],
      });
    }

    if (
      data.entry_mode === "manual" &&
      !data.selected_recipe_id &&
      !data.selected_global_food_name &&
      (!data.entry_text || data.entry_text.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Будь ласка, введіть назву продукту.",
        path: ["entry_text"],
      });
    }

    // Нова логіка для перевірки наявності значень
    if (data.entry_mode === "manual") {
      if (
        data.calc_mode === "per100g" &&
        (!data.weight_eaten || data.weight_eaten <= 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Будь ласка, вкажіть вагу.",
          path: ["weight_eaten"],
        });
      }
      if (
        data.calc_mode === "serving" &&
        (!data.servings || data.servings <= 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Будь ласка, вкажіть кількість порцій.",
          path: ["servings"],
        });
      }
    }
  });

export type FoodEntryFormSchema = z.infer<typeof foodEntrySchema>;

export const personalInfoSchema = z.object({
  full_name: z.string().optional(),
  current_weight_kg: z.coerce.number().positive(),
  height_cm: z.coerce.number().positive().int(),
  age: z.coerce.number().positive().int(),
  gender: z.string(),
  activity_level: z.string(),
  goal: z.string(),
});

export const nutritionTargetsSchema = z.object({
  target_calories: z.coerce.number().positive().int(),
  target_protein_g: z.coerce.number().positive().int(),
  target_carbs_g: z.coerce.number().positive().int(),
  target_fat_g: z.coerce.number().positive().int(),
  target_water_ml: z.coerce.number().positive().int(),
});
