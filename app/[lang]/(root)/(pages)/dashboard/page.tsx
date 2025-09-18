import { DashboardSkeleton } from "@/components/dashboard";
export default function Dashboard() {
  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <DashboardSkeleton />
    </div>
  );
}

// import { DashboardContent, DashboardSkeleton } from "@/components/dashboard";
// import { Suspense } from "react";

// export default function Dashboard() {
//   return (
//     <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
//       <Suspense fallback={<DashboardSkeleton />}>
//         <DashboardContent />
//       </Suspense>
//     </div>
//   );
// }
