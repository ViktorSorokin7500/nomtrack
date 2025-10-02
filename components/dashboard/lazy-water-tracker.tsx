"use client";

import dynamic from "next/dynamic";

const WaterTrackerCard = dynamic(
  () => import("./water-tracker").then((m) => m.WaterTrackerCard),
  { ssr: false }
);

export function LazyWaterTracker(
  props: React.ComponentProps<typeof WaterTrackerCard>
) {
  return <WaterTrackerCard {...props} />;
}
