"use client";

// Цей компонент дуже простий, він просто показує дані
interface FoodEntryCardProps {
  entry: {
    entry_text: string;
    calories: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
  };
}

export function FoodEntryCard({ entry }: FoodEntryCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm flex justify-between items-center">
      <p className="flex-1 mr-4 text-gray-700">{entry.entry_text}</p>
      <div className="flex gap-4 text-xs text-gray-600 text-center">
        <div>
          <span className="font-bold block">{entry.calories}</span>
          <span>ккал</span>
        </div>
        <div>
          <span className="font-bold block">{entry.protein_g} г</span>
          <span>білки</span>
        </div>
        <div>
          <span className="font-bold block">{entry.fat_g} г</span>
          <span>жири</span>
        </div>
        <div>
          <span className="font-bold block">{entry.carbs_g} г</span>
          <span>вугл.</span>
        </div>
      </div>
    </div>
  );
}
