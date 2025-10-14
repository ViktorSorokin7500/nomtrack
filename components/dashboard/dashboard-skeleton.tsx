import React from "react";

import {
  LoadingAICoachCard,
  LoadingNutritionDashboard,
  LoadingSummaryCard,
  LoadingWaterTracker,
} from "./loading";

export function DashboardSkeleton() {
  return (
    <div className="bg-orange-50 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 lg:order-2">
          <LoadingNutritionDashboard />
        </div>
        <div className="lg:col-span-1 space-y-6 lg:order-1">
          <LoadingSummaryCard />
          <LoadingWaterTracker />
          <LoadingAICoachCard />
        </div>
      </div>
    </div>
  );
}
