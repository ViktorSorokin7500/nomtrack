// components/dashboard/DashboardClient.tsx
"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  NutritionDashboard,
  AICoachCard,
  WaterTrackerCard,
  SummaryCard,
} from "@/components/dashboard";
import {
  NutritionSkeleton,
  SummarySkeleton,
  WaterSkeleton,
  AiCoachSkeleton,
} from "@/components/skeletons";

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 401) throw new Error("unauthorized");
  const json = await res.json();
  return json;
};

export function DashboardContent() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/dashboard", fetcher, {
    revalidateOnFocus: false,
  });

  // 1) Скелетони — одразу
  if (isLoading) {
    return (
      <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 lg:order-2">
            <NutritionSkeleton />
          </div>
          <div className="lg:col-span-1 space-y-6 lg:order-1">
            <SummarySkeleton />
            <WaterSkeleton />
            <AiCoachSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // 2) Обробка редиректу з API
  if (data?.redirectTo) {
    router.replace(data.redirectTo);
    return null;
  }

  // 3) 401 → логін
  if (error?.message === "unauthorized") {
    router.replace("/sign-in");
    return null;
  }

  // 4) Дані приїхали — рендеримо контент
  const {
    profile,
    foodEntries = [],
    activityEntries = [],
    userRecipes = [],
    savedWorkouts = [],
    summaryData,
    todaysWorkout,
  } = data ?? {};

  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 lg:order-2">
          <NutritionDashboard
            summaryData={summaryData}
            foodLogData={foodEntries.filter(
              (e: { meal_type: string }) => e.meal_type !== "water"
            )}
            userRecipes={userRecipes}
          />
        </div>

        <div className="lg:col-span-1 space-y-6 lg:order-1">
          <SummaryCard currentWeight={profile.current_weight_kg} />
          <WaterTrackerCard
            currentWater={foodEntries.reduce(
              (s: number, e: { water_ml: number }) => s + (e.water_ml ?? 0),
              0
            )}
            targetWater={profile.target_water_ml || 2500}
          />
          <AICoachCard
            activityLogData={activityEntries}
            todaysWorkout={todaysWorkout}
            savedWorkouts={savedWorkouts}
          />
        </div>
      </div>
    </div>
  );
}
