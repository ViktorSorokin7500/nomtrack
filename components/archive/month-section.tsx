import { DailySummary, Profile } from "@/types";
import { DailyCard } from "./daily-card";
import { MonthlySummaryCard } from "./monthly-summary-card";

type DayData = DailySummary & { fullDate: string; date: string };
type MonthData = { name: string; days: DayData[] };

interface MonthSectionProps {
  month: MonthData;
  userProfile: Profile;
}

export function MonthSection({ month, userProfile }: MonthSectionProps) {
  return (
    <div className="mb-8">
      {month.days.length > 0 && (
        <>
          <MonthlySummaryCard days={month.days} userProfile={userProfile} />
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {month.days.map((day) => (
          <DailyCard key={day.fullDate} day={day} userProfile={userProfile} />
        ))}
      </div>
    </div>
  );
}
