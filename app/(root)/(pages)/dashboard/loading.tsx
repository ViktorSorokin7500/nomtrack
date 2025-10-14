import { DashboardSkeleton } from "@/components/dashboard";

export default function Loading() {
  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <DashboardSkeleton />
    </div>
  );
}
