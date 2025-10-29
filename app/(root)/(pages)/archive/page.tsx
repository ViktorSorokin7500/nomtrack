import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NutritionArchive } from "@/components/archive/nutrition-archive";
import { DailySummary, YearData } from "@/types";
import { Metadata } from "next";
import { ARCHIVE_TEXTS } from "@/components/archive/archive-texts";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: ARCHIVE_TEXTS.MAIN_PAGE.TITLE,
    description: ARCHIVE_TEXTS.MAIN_PAGE.DESCRIPTION,
  };
}

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
      date: `${date.toLocaleString("uk-UA", {
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
  searchParams,
}: {
  searchParams?: Promise<{ year?: string; month?: string }>;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const currentYear = new Date().getUTCFullYear();
  const currentMonth = new Date().getUTCMonth();

  const params = (await searchParams) ?? {};
  const targetYear = params.year ? parseInt(params.year) : currentYear;
  const targetMonth = params.month ? parseInt(params.month) - 1 : currentMonth;

  const startDate = new Date(Date.UTC(targetYear, targetMonth, 1));
  const endDate = new Date(Date.UTC(targetYear, targetMonth + 1, 1));

  const [
    { data: profile, error: profileError },
    { data: summaries, error: summariesError },
  ] = await Promise.all([
    (await supabase).from("profiles").select("*").eq("id", user.id).single(),
    (await supabase)
      .from("daily_summaries")
      .select(
        "id, date, consumed_calories, target_calories, consumed_protein_g, target_protein_g, consumed_fat_g, target_fat_g, consumed_carbs_g, target_carbs_g, consumed_sugar_g, target_sugar_g, consumed_water_ml, target_water_ml, end_of_day_weight, end_of_day_belly, end_of_day_waist"
      )
      .eq("user_id", user.id)
      .gte("date", startDate.toISOString().split("T")[0])
      .lt("date", endDate.toISOString().split("T")[0])
      .order("date", { ascending: false }),
  ]);

  if (profileError || summariesError) {
    console.error(profileError || summariesError);
    return <div>{ARCHIVE_TEXTS.MAIN_PAGE.NO_FOUND}</div>;
  }

  const nutritionData = groupDataByYearAndMonth(summaries || []);

  return (
    <NutritionArchive nutritionData={nutritionData} userProfile={profile} />
  );
}
