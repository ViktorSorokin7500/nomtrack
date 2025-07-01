import { Card } from "../shared";
import { MealItem } from "./meal-item";

interface MealCategoryProps {
  type: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MealCategory({
  type,
  cal,
  protein,
  carbs,
  fat,
}: MealCategoryProps) {
  return (
    <Card className="mb-4">
      <div className="flex items-center mb-4">
        <h3 className="font-semibold text-stone-900">{type.toLowerCase()}</h3>
      </div>
      {cal > 0 ? (
        <div className="space-y-3">
          <MealItem cal={cal} protein={protein} carbs={carbs} fat={fat} />
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
          <p>noDishes</p>
        </div>
      )}
    </Card>
  );
}
