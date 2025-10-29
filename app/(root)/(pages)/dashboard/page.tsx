import { DashboardContent } from "@/components/dashboard";
import { DASHBOARD_TEXTS } from "@/components/dashboard/dashboard-text";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: DASHBOARD_TEXTS.METADATA.TITLE,
    description: DASHBOARD_TEXTS.METADATA.DESCRIPTION,
  };
}

export default function Dashboard() {
  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <DashboardContent />
    </div>
  );
}
