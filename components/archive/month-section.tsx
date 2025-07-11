import { DailySummary, Profile } from "@/types";
import { DailyCard } from "./daily-card";

type DayData = DailySummary & { fullDate: string; date: string };
type MonthData = { name: string; days: DayData[] };

interface MonthSectionProps {
  month: MonthData;
  userProfile: Profile | null;
}

export function MonthSection({ month, userProfile }: MonthSectionProps) {
  return (
    <div className="mb-8">
      <div className="month-marker rounded-lg p-2 mb-4 text-stone-900 font-semibold">
        {month.name}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {month.days.map((day) => (
          <DailyCard
            key={day.fullDate}
            day={day}
            userProfile={userProfile} // Передаємо профіль далі
          />
        ))}
      </div>
    </div>
  );
}
