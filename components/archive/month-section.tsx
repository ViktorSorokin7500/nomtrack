import { DailyCard } from "./daily-card";

interface Month {
  name: string;
  days: Array<{
    date: string;
    fullDate: string;
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    sugar: number;
    water: number;
    weight: number;
    belly: number;
    waist: number;
  }>;
}

interface MonthSectionProps {
  month: Month;
}

export function MonthSection({ month }: MonthSectionProps) {
  return (
    <div className="mb-8">
      <div className="month-marker rounded-lg p-2 mb-4 text-stone-900 font-semibold">
        {month.name}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {month.days.map((day) => (
          <DailyCard key={day.fullDate} day={day} />
        ))}
      </div>
    </div>
  );
}
