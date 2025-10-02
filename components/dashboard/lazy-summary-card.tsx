"use client";

import dynamic from "next/dynamic";
import { Card } from "../shared";

function SummaryFallback() {
  return (
    <Card className="p-4">
      <div className="h-6 w-36 mb-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
    </Card>
  );
}

const SummaryCard = dynamic(
  () => import("./summary-card").then((m) => m.SummaryCard),
  { ssr: false, loading: () => <SummaryFallback /> }
);

export function LazySummaryCard(
  props: React.ComponentProps<typeof SummaryCard>
) {
  return <SummaryCard {...props} />;
}
