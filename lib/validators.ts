import { z } from "zod";

// Ми експортуємо і саму схему, і її тип, щоб використовувати їх в інших файлах
export const foodEntrySchema = z.object({
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

export type FoodEntryFormSchema = z.infer<typeof foodEntrySchema>;
