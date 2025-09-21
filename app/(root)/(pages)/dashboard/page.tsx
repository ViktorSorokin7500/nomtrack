// app/[lang]/(root)/(pages)/dashboard/page.tsx
import { DashboardContent } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/sign-in");

  return <DashboardContent />; // скелетони рендеряться одразу на клієнті
}
