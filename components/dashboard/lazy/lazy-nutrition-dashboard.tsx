"use client";

import dynamic from "next/dynamic";
import { LoadingNutritionDashboard } from "../loading";

const NutritionDashboard = dynamic(
  () => import("../nutrition-dashboard").then((m) => m.NutritionDashboard),
  { ssr: false, loading: () => <LoadingNutritionDashboard /> }
);

type Props = React.ComponentProps<typeof NutritionDashboard>;

export function LazyNutritionDashboard(props: Props) {
  return <NutritionDashboard {...props} />;
}
