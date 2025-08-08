"use client";

interface ActivityEntryCardProps {
  entry: {
    entry_text: string;
    calories_burned: number;
  };
}

export function ActivityEntryCard({ entry }: ActivityEntryCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm flex justify-between items-center">
      <p className="flex-1 mr-4 text-gray-700">{entry.entry_text}</p>
      <div className="text-center">
        <span className="font-bold block text-red-500">
          -{entry.calories_burned}
        </span>
        <span className="text-xs text-gray-600">kcal</span>
      </div>
    </div>
  );
}
