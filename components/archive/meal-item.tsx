interface MealItemProps {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MealItem({ cal, protein, carbs, fat }: MealItemProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Cal:</span>
          <span className="font-semibold text-gray-800">{cal} kc</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Protein:</span>
          <span className="font-semibold text-gray-800">{protein}g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Carbs:</span>
          <span className="font-semibold text-gray-800">{carbs}g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fat:</span>
          <span className="font-semibold text-gray-800">{fat}g</span>
        </div>
      </div>
    </div>
  );
}
