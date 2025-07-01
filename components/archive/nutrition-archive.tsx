import { YearSection } from "./year-section";

interface NutritionData {
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

interface NutritionArchiveProps {
  nutritionData: NutritionData[];
}

export function NutritionArchive({ nutritionData }: NutritionArchiveProps) {
  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">title</h1>
        <p className="text-gray-600">description</p>
      </header>
      <div className="space-y-8">
        {nutritionData.map((yearData) => (
          <YearSection key={yearData.year} yearData={yearData} />
        ))}
      </div>
    </section>
  );
}
