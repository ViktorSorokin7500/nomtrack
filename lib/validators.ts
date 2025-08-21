// @/lib/validators.ts

import { z } from "zod";

export const foodEntrySchema = z
  .object({
    entry_mode: z.enum(["ai", "manual"]),
    calc_mode: z.enum(["per100g", "serving"]).optional(),

    entry_text: z.string().optional(),
    meal_type: z.string().min(1, "Будь ласка, оберіть прийом їжі."), // <-- ПОВЕРНУТО

    // Поля для ручного вводу (min(0) дозволяє вводити нуль, наприклад для цукру)
    calories: z.coerce.number().min(0).optional().nullable(),
    protein_g: z.coerce.number().min(0).optional().nullable(),
    fat_g: z.coerce.number().min(0).optional().nullable(),
    carbs_g: z.coerce.number().min(0).optional().nullable(),
    sugar_g: z.coerce.number().min(0).optional().nullable(),
    weight_eaten: z.coerce
      .number()
      .positive("Вага має бути вказана")
      .optional()
      .nullable(),
    servings: z.coerce.number().positive().optional().nullable(),

    // Додаємо нові опціональні поля
    selected_recipe_id: z.string().optional(),
    selected_global_food_name: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // --- УМОВНА ВАЛІДАЦІЯ ---

    // Правило 1: Якщо режим AI, то `entry_text` обов'язковий.
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

    // Правило 2: Якщо ручний режим І рецепт/продукт НЕ обрано, то `entry_text` обов'язковий.
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

    // Правило 3: Якщо ручний режим, то поле ваги обов'язкове.
    if (
      data.entry_mode === "manual" &&
      (!data.weight_eaten || data.weight_eaten <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Будь ласка, вкажіть вагу.",
        path: ["weight_eaten"],
      });
    }
  });

export type FoodEntryFormSchema = z.infer<typeof foodEntrySchema>;

// ... (інші схеми залишаються без змін)
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
