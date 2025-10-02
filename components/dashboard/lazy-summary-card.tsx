"use client";

import dynamic from "next/dynamic";

const SummaryCard = dynamic(
  () => import("./summary-card").then((m) => m.SummaryCard),
  { ssr: false }
);

export function LazySummaryCard(
  props: React.ComponentProps<typeof SummaryCard>
) {
  return <SummaryCard {...props} />;
}
