"use client";

import dynamic from "next/dynamic";
import { Card } from "../shared";

// Мінімальний плейсхолдер (тонни розмітки не треба)
function NutritionDashboardFallback() {
  return (
    <Card className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="h-8 w-48 mb-6 rounded-md bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-48 rounded-xl bg-gray-200 animate-pulse" />
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-4 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 rounded bg-gray-200 animate-pulse" />
      </div>
    </Card>
  );
}

const NutritionDashboard = dynamic(
  () => import("./nutrition-dashboard").then((m) => m.NutritionDashboard),
  { ssr: false, loading: () => <NutritionDashboardFallback /> }
);

type Props = React.ComponentProps<typeof NutritionDashboard>;

export function LazyNutritionDashboard(props: Props) {
  return <NutritionDashboard {...props} />;
}
