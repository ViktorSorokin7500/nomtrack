interface Dish {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  dish: string;
}

interface MealItemProps {
  dish: Dish;
}

export function MealItem({ dish }: MealItemProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-stone-900 mb-2">{dish.dish}</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Calories:</span>
          <span className="font-semibold text-gray-800">{dish.cal} kcal</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Protein:</span>
          <span className="font-semibold text-gray-800">{dish.protein}g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Carbs:</span>
          <span className="font-semibold text-gray-800">{dish.carbs}g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fat:</span>
          <span className="font-semibold text-gray-800">{dish.fat}g</span>
        </div>
      </div>
    </div>
  );
}
