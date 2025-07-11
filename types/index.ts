// Archive

export type DayData = DailySummary & { fullDate: string; date?: string };
type MonthData = { name: string; days: DayData[] };
export type YearData = { year: number; months: { [key: string]: MonthData } };

// Повний тип для одного запису з таблиці daily_summaries
export type DailySummary = {
  id: number;
  user_id: string;
  date: string;
  created_at: string;
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
