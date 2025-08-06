import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NutritionArchive } from "@/components/archive/nutrition-archive";
import { Locale } from "@/i18n.config";
import { DailySummary, YearData } from "@/types";

function groupDataByYearAndMonth(summaries: DailySummary[]) {
  const grouped: { [key: number]: YearData } = {};

  summaries.forEach((day) => {
    const date = new Date(day.date + "T00:00:00Z");
    const year = date.getUTCFullYear();
    const month = date.toLocaleString("en-US", {
      month: "long",
      timeZone: "UTC",
    });

    if (!grouped[year]) {
      grouped[year] = { year, months: {} };
    }
    if (!grouped[year].months[month]) {
      grouped[year].months[month] = { name: month, days: [] };
    }

    const formattedDay = {
      ...day,
      fullDate: day.date,
      date: `${date.toLocaleString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      })}, ${date.getUTCDate()}`,
    };

    grouped[year].months[month].days.push(formattedDay);
  });

  return Object.values(grouped).map((yearData) => ({
    ...yearData,
    months: Object.values(yearData.months),
  }));
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  console.log(lang);

  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [
    { data: profile, error: profileError },
    { data: summaries, error: summariesError },
  ] = await Promise.all([
    (await supabase).from("profiles").select("*").eq("id", user.id).single(),
    (await supabase)
      .from("daily_summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
  ]);

  if (profileError || summariesError) {
    console.error(
      "Failed to load archive data:",
      profileError || summariesError
    );
    return <div>Failed to load data. Please try again later.</div>;
  }

  const nutritionData = groupDataByYearAndMonth(summaries || []);

  return (
    <NutritionArchive nutritionData={nutritionData} userProfile={profile} />
  );
}
