"use client";

import dynamic from "next/dynamic";
import { Card } from "../shared";

function CoachFallback() {
  return (
    <Card className="p-4 space-y-4">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
    </Card>
  );
}

const AICoachCard = dynamic(
  () => import("./ai-coach-card").then((m) => m.AICoachCard),
  { ssr: false, loading: () => <CoachFallback /> }
);

export function LazyAICoachCard(
  props: React.ComponentProps<typeof AICoachCard>
) {
  return <AICoachCard {...props} />;
}
