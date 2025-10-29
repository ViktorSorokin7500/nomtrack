// Archive
import { SupabaseClient } from "@supabase/supabase-js";

export type DayData = DailySummary & { fullDate: string; date?: string };
type MonthData = { name: string; days: DayData[] };
export type YearData = { year: number; months: { [key: string]: MonthData } };

// Повний тип для одного запису з таблиці daily_summaries
export type DailySummary = {
  id: number;
  user_id?: string;
  date: string;
  created_at?: string;
  consumed_calories: number;
  target_calories: number;
  consumed_protein_g: number;
  target_protein_g: number;
  consumed_fat_g: number;
  target_fat_g: number;
  consumed_carbs_g: number;
  target_carbs_g: number;
  consumed_sugar_g: number;
  target_sugar_g: number;
  consumed_water_ml: number;
  target_water_ml: number;
  end_of_day_weight: number | null;
  end_of_day_belly: number | null;
  end_of_day_waist: number | null;
};

export type Profile = {
  id: string;
  created_at?: string;
  email?: string | null;
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
  target_sugar_g?: number | null;
  premium_expires_at?: string | null;
  ai_requests_left?: number | null;
};

export type UserRecipe = {
  id: string;
  recipe_name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
  sugar_per_100g: number;
};

//actions.ts

export type NutritionInfo = {
  name: string;
  calories: number;
  protein_g: number;
  fat_total_g: number;
  carbohydrates_total_g: number;
  sugar_g: number;
  serving_size_g?: number;
};

export type SavedFoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  is_favorite: boolean;
};

export interface RawSavedFoodData {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface TotalNutrition {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  sugar_g: number;
  total_weight_g: number;
}

export type Ingredient = {
  name: string;
  weight_g: number;
};

export type AiIngredientsResponse = {
  ingredients: Ingredient[];
};

export type NormalizedIngredient = {
  ingredientName: string;
  weightGrams: number;
};

// Тип, що описує ОБИДВА можливі формати відповіді від ШІ
export type AiRecipeResponse =
  | NormalizedIngredient[]
  | { [key: string]: NormalizedIngredient[] };

export type GlobalFoodSearchResult = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export interface FoodEntry {
  id: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  entry_text: string;
  calories?: number;
  protein_g?: number;
  fat_g?: number;
  carbs_g?: number;
  sugar_g?: number | null;
}

// Тип для даних, що повертає ШІ для одного тренування
export type AiWorkoutResponse = {
  estimated_calories_burned: number;
  exercises: {
    name: string;
    sets?: number;
    reps?: string;
    duration_min?: number;
    duration_sec?: number;
  }[];
};

// Тип для збереження в базу даних
export type UserWorkout = {
  user_id: string;
  workout_name: string;
  estimated_calories_burned: number;
  workout_data: AiWorkoutResponse["exercises"];
};

// coach
export type DbSavedWorkout = {
  id: number;
  created_at: string;
  workout_name: string;
  estimated_calories_burned: number;
  workout_data: AiWorkoutResponse["exercises"];
};

export interface WorkoutListProps {
  savedWorkouts: DbSavedWorkout[];
  plans: DbWorkoutPlan[];
}

export type WorkoutPlan = {
  plan_title: string;
  daily_plans: {
    day: string;
    type: string;
    estimated_calories_burned: number;
    exercises: {
      name: string;
      sets?: number;
      reps?: string;
      duration_min?: number;
      duration_sec?: number;
    }[];
  }[];
  general_recommendations: string;
};

// Додамо новий тип для даних з бази, що включає id та created_at
export type DbWorkoutPlan = {
  id: number;
  created_at: string;
  plan_data: WorkoutPlan;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Supabase = SupabaseClient<any, "public", any>;
