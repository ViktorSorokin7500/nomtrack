import { Profile, DayData } from "@/types";
import { MonthSection } from "./month-section";

type MonthData = { name: string; days: DayData[] };
type YearData = { year: number; months: MonthData[] };

interface YearSectionProps {
  yearData: YearData;
  userProfile: Profile;
}

export function YearSection({ yearData, userProfile }: YearSectionProps) {
  return (
    <div>
      <div className="year-marker rounded-lg p-1 mb-6 bg-orange-200 text-stone-900 font-bold text-xl" />
      {/* Використовуємо Object.values() для ітерації по об'єкту місяців */}
      {Object.values(yearData.months).map((month) => (
        <MonthSection
          key={month.name}
          month={month}
          userProfile={userProfile}
        />
      ))}
    </div>
  );
}
