"use client";

import dynamic from "next/dynamic";
import { Card } from "../shared";

function WaterFallback() {
  return (
    <Card className="p-4 space-y-3">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="flex gap-2">
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </Card>
  );
}

const WaterTrackerCard = dynamic(
  () => import("./water-tracker").then((m) => m.WaterTrackerCard),
  { ssr: false, loading: () => <WaterFallback /> }
);

export function LazyWaterTracker(
  props: React.ComponentProps<typeof WaterTrackerCard>
) {
  return <WaterTrackerCard {...props} />;
}
