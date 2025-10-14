"use client";

import dynamic from "next/dynamic";
import { LoadingAICoachCard } from "../loading";

const AICoachCard = dynamic(
  () => import("../ai-coach-card").then((m) => m.AICoachCard),
  { ssr: false, loading: () => <LoadingAICoachCard /> }
);

export function LazyAICoachCard(
  props: React.ComponentProps<typeof AICoachCard>
) {
  return <AICoachCard {...props} />;
}
