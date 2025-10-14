"use client";

import { DayData, Profile } from "@/types";
import { YearSection } from "./year-section";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { ARCHIVE_TEXTS } from "./archive-texts";

type MonthData = { name: string; days: DayData[] };
type YearData = { year: number; months: MonthData[] };

interface NutritionArchiveProps {
  nutritionData: YearData[];
  userProfile: Profile;
}

export function NutritionArchive({
  nutritionData,
  userProfile,
}: NutritionArchiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const localizedMonths: { [key: string]: string } = {
    January: ARCHIVE_TEXTS.NUTRION_ARCHIVE.JANUARY,
    February: ARCHIVE_TEXTS.NUTRION_ARCHIVE.FEBRUARY,
    March: ARCHIVE_TEXTS.NUTRION_ARCHIVE.MARCH,
    April: ARCHIVE_TEXTS.NUTRION_ARCHIVE.APRIL,
    May: ARCHIVE_TEXTS.NUTRION_ARCHIVE.MAY,
    June: ARCHIVE_TEXTS.NUTRION_ARCHIVE.JUNE,
    July: ARCHIVE_TEXTS.NUTRION_ARCHIVE.JULY,
    August: ARCHIVE_TEXTS.NUTRION_ARCHIVE.AUGUST,
    September: ARCHIVE_TEXTS.NUTRION_ARCHIVE.SEPTEMBER,
    October: ARCHIVE_TEXTS.NUTRION_ARCHIVE.OCTOBER,
    November: ARCHIVE_TEXTS.NUTRION_ARCHIVE.NOVEMBER,
    December: ARCHIVE_TEXTS.NUTRION_ARCHIVE.DECEMBER,
  };

  const currentYear = new Date().getUTCFullYear();
  const currentMonth = new Date().getUTCMonth() + 1;

  const [targetYear, setTargetYear] = useState(
    parseInt(searchParams.get("year") || String(currentYear))
  );
  const [targetMonth, setTargetMonth] = useState(
    parseInt(searchParams.get("month") || String(currentMonth))
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(targetYear));
    params.set("month", String(targetMonth));
    router.push(pathname + "?" + params.toString());
  }, [targetYear, targetMonth, router, pathname, searchParams]);

  const goToNextMonth = () => {
    if (targetMonth === 12) {
      setTargetYear(targetYear + 1);
      setTargetMonth(1);
    } else {
      setTargetMonth(targetMonth + 1);
    }
  };

  const goToPrevMonth = () => {
    if (targetMonth === 1) {
      setTargetYear(targetYear - 1);
      setTargetMonth(12);
    } else {
      setTargetMonth(targetMonth - 1);
    }
  };

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return (
      localizedMonths[date.toLocaleString("en-US", { month: "long" })] || ""
    );
  };

  const isCurrentMonth =
    targetYear === currentYear && targetMonth === currentMonth;

  const monthName = getMonthName(targetMonth);

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 flex justify-between items-center">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label={ARCHIVE_TEXTS.NUTRION_ARCHIVE.PREV_MONTH}
        >
          <MoveLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {monthName} {targetYear}
          </h1>
          <p className="text-gray-600">{ARCHIVE_TEXTS.NUTRION_ARCHIVE.TITLE}</p>
        </div>
        <button
          onClick={goToNextMonth}
          disabled={isCurrentMonth}
          className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
            isCurrentMonth ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={ARCHIVE_TEXTS.NUTRION_ARCHIVE.NEXT_MONTH}
        >
          <MoveRight size={24} />
        </button>
      </header>

      {nutritionData.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p>{ARCHIVE_TEXTS.NUTRION_ARCHIVE.NODATA}</p>
          <p>{ARCHIVE_TEXTS.NUTRION_ARCHIVE.NODATA_LONG}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {nutritionData.map((yearData) => (
            <YearSection
              key={yearData.year}
              yearData={yearData}
              userProfile={userProfile}
            />
          ))}
        </div>
      )}
    </section>
  );
}
