import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NutritionArchive } from "@/components/archive/nutrition-archive";
import { DailySummary, YearData } from "@/types";

// Цю функцію можна залишити без змін
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

// Оновлюємо основний компонент сторінки
export default async function ArchivePage({
  searchParams, // <-- НОВЕ: отримуємо параметри URL
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

  // Встановлюємо поточний рік та місяць за замовчуванням
  const currentYear = new Date().getUTCFullYear();
  const currentMonth = new Date().getUTCMonth(); // 0-11

  // Визначаємо місяць та рік для запиту
  const params = (await searchParams) ?? {};
  const targetYear = params.year ? parseInt(params.year) : currentYear;
  const targetMonth = params.month ? parseInt(params.month) - 1 : currentMonth;

  // Створюємо дати початку та кінця місяця для фільтрації
  const startDate = new Date(Date.UTC(targetYear, targetMonth, 1));
  const endDate = new Date(Date.UTC(targetYear, targetMonth + 1, 1));

  const [
    { data: profile, error: profileError },
    { data: summaries, error: summariesError },
  ] = await Promise.all([
    (await supabase).from("profiles").select("*").eq("id", user.id).single(),
    (await supabase)
      .from("daily_summaries")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate.toISOString().split("T")[0])
      .lt("date", endDate.toISOString().split("T")[0])
      .order("date", { ascending: false }),
  ]);

  if (profileError || summariesError) {
    console.error(
      "Failed to load archive data:",
      profileError || summariesError
    );
    return <div>Не вдалося завантажити дані. Спробуйте пізніше.</div>;
  }

  const nutritionData = groupDataByYearAndMonth(summaries || []);

  return (
    <NutritionArchive nutritionData={nutritionData} userProfile={profile} />
  );
}
