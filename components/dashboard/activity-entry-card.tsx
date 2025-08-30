"use client";

interface ActivityEntryCardProps {
  entry: {
    id: number;
    entry_text: string;
    calories_burned: number;
  };
  handleDeleteActivity: (id: number) => void;
  isPending: boolean;
}

export function ActivityEntryCard({
  entry,
  handleDeleteActivity,
  isPending,
}: ActivityEntryCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm flex justify-between items-center">
      <p className="flex-1 mr-4 text-gray-700">{entry.entry_text}</p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          <span className="font-bold block text-red-500">
            -{entry.calories_burned}
          </span>
          <span className="text text-gray-600">ккал</span>
        </div>
        <button
          onClick={() => handleDeleteActivity(entry.id)}
          disabled={isPending}
          className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors cursor-pointer"
          aria-label="Delete Activity"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
