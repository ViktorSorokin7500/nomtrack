import { MonthSection } from "./month-section";

interface YearData {
  year: number;
  months: Array<{
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
  }>;
}

interface YearSectionProps {
  yearData: YearData;
}

export function YearSection({ yearData }: YearSectionProps) {
  return (
    <div>
      <div className="year-marker rounded-lg p-3 mb-6 bg-orange-200 text-stone-900 font-bold text-xl">
        {yearData.year}
      </div>
      {yearData.months.map((month) => (
        <MonthSection key={month.name} month={month} />
      ))}
    </div>
  );
}
