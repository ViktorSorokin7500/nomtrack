import { Card } from "../shared";
import { MealItem } from "./meal-item";

interface Dish {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  dish: string;
}

interface MealCategoryProps {
  type: string;
  dishes: Dish[];
}

export function MealCategory({ type, dishes }: MealCategoryProps) {
  return (
    <Card className="mb-4">
      <div className="flex items-center mb-4">
        <h3 className="font-semibold text-stone-900">{type.toLowerCase()}</h3>
      </div>
      {dishes.length > 0 ? (
        <div className="space-y-3">
          {dishes.map((dish, index) => (
            <MealItem key={index} dish={dish} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
          <p>noDishes</p>
        </div>
      )}
    </Card>
  );
}
