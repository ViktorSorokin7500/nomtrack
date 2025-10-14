"use client";

import dynamic from "next/dynamic";
import { LoadingWaterTracker } from "../loading";

const WaterTrackerCard = dynamic(
  () => import("../water-tracker").then((m) => m.WaterTrackerCard),
  { ssr: false, loading: () => <LoadingWaterTracker /> }
);

export function LazyWaterTracker(
  props: React.ComponentProps<typeof WaterTrackerCard>
) {
  return <WaterTrackerCard {...props} />;
}
