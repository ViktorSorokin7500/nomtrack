interface FoodItemProps {
  name: string;
  description: string;
  calories: number;
  macros: { protein: number; carbs: number; fat: number };
  icon: string;
  iconBg: string;
}

export function FoodItem({
  name,
  description,
  calories,
  macros,
  icon,
  iconBg,
}: FoodItemProps) {
  return (
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
      <div className="flex items-center">
        <div
          className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center mr-3`}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <h4 className="font-medium text-stone-900">{name}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-stone-900">{calories} cal</div>
        <div className="text-xs text-gray-500">
          P: {macros.protein}g | C: {macros.carbs}g | F: {macros.fat}g
        </div>
      </div>
    </div>
  );
}
