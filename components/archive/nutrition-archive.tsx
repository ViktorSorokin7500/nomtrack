import { DayData, Profile } from "@/types";
import { YearSection } from "./year-section";

type MonthData = { name: string; days: DayData[] };
type YearData = { year: number; months: MonthData[] };

// Типи для пропсів цього компонента
interface NutritionArchiveProps {
  nutritionData: YearData[];
  userProfile: Profile | null;
}

export function NutritionArchive({
  nutritionData,
  userProfile,
}: NutritionArchiveProps) {
  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Archive</h1>
        <p className="text-gray-600">Your Food & Progress History</p>
      </header>

      {nutritionData.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p>Nothing here yet.</p>
          <p>
            Your data will show up here the day after you start logging your
            entries.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {nutritionData.map((yearData) => (
            <YearSection
              key={yearData.year}
              yearData={yearData}
              userProfile={userProfile} // Передаємо профіль далі
            />
          ))}
        </div>
      )}
    </section>
  );
}
