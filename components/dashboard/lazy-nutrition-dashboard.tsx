"use client";

import dynamic from "next/dynamic";

const NutritionDashboard = dynamic(
  () => import("./nutrition-dashboard").then((m) => m.NutritionDashboard),
  { ssr: false }
);

type Props = React.ComponentProps<typeof NutritionDashboard>;

export function LazyNutritionDashboard(props: Props) {
  return <NutritionDashboard {...props} />;
}
