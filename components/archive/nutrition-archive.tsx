"use client";

import { DayData, Profile } from "@/types";
import { YearSection } from "./year-section";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

type MonthData = { name: string; days: DayData[] };
type YearData = { year: number; months: MonthData[] };

interface NutritionArchiveProps {
  nutritionData: YearData[];
  userProfile: Profile | null;
}

export function NutritionArchive({
  nutritionData,
  userProfile,
}: NutritionArchiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Локалізуємо назви місяців, оскільки в `archive/page.tsx` вони були отримані англійською
  const localizedMonths: { [key: string]: string } = {
    January: "Січень",
    February: "Лютий",
    March: "Березень",
    April: "Квітень",
    May: "Травень",
    June: "Червень",
    July: "Липень",
    August: "Серпень",
    September: "Вересень",
    October: "Жовтень",
    November: "Листопад",
    December: "Грудень",
  };

  const currentYear = new Date().getUTCFullYear();
  const currentMonth = new Date().getUTCMonth() + 1; // getUTCMonth() повертає 0-11, а нам потрібен 1-12

  const [targetYear, setTargetYear] = useState(
    parseInt(searchParams.get("year") || String(currentYear))
  );
  const [targetMonth, setTargetMonth] = useState(
    parseInt(searchParams.get("month") || String(currentMonth))
  );

  useEffect(() => {
    // Оновлюємо URL при зміні місяця/року
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(targetYear));
    params.set("month", String(targetMonth));
    router.push(pathname + "?" + params.toString());
  }, [targetYear, targetMonth, router, pathname, searchParams]);

  // Функції для навігації
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

  // Визначення, чи є місяць поточним, щоб приховати кнопку "Наступний місяць"
  const isCurrentMonth =
    targetYear === currentYear && targetMonth === currentMonth;

  // Оновлюємо відображення назви місяця
  const monthName = getMonthName(targetMonth);

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Заголовок та навігація */}
      <header className="mb-8 flex justify-between items-center">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Попередній місяць"
        >
          <AiOutlineArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {monthName} {targetYear}
          </h1>
          <p className="text-gray-600">Ваша історія харчування та прогресу</p>
        </div>
        <button
          onClick={goToNextMonth}
          disabled={isCurrentMonth}
          className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
            isCurrentMonth ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Наступний місяць"
        >
          <AiOutlineArrowRight size={24} />
        </button>
      </header>

      {/* Основний контент */}
      {nutritionData.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p>Даних за цей місяць ще немає.</p>
          <p>
            Ваші дані з&apos;являться тут на наступний день після того, як ви
            почнете їх записувати.
          </p>
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
