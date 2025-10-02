"use client";

import dynamic from "next/dynamic";

const AICoachCard = dynamic(
  () => import("./ai-coach-card").then((m) => m.AICoachCard),
  { ssr: false }
);

export function LazyAICoachCard(
  props: React.ComponentProps<typeof AICoachCard>
) {
  return <AICoachCard {...props} />;
}
