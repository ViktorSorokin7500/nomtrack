"use client";

import dynamic from "next/dynamic";
import { LoadingSummaryCard } from "../loading";

const SummaryCard = dynamic(
  () => import("../summary-card").then((m) => m.SummaryCard),
  { ssr: false, loading: () => <LoadingSummaryCard /> }
);

export function LazySummaryCard(
  props: React.ComponentProps<typeof SummaryCard>
) {
  return <SummaryCard {...props} />;
}
