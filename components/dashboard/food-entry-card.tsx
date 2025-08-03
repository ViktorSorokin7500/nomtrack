"use client";

import { useTransition } from "react";
import { deleteFoodEntry } from "@/app/actions";
import toast from "react-hot-toast";
import { Button } from "../ui";

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Цей компонент дуже простий, він просто показує дані
interface FoodEntryCardProps {
  entry: {
    id: number;
    entry_text: string;
    calories: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
    sugar_g: number;
  };
}

export function FoodEntryCard({ entry }: FoodEntryCardProps) {
  const [isPending, startTransition] = useTransition();
  // const handleDelete = () => {
  //   if (confirm("Are you sure you want to delete this entry?")) {
  //     startTransition(() => {
  //       // 2. Use toast.promise for a better UX
  //       toast.promise(
  //         // Pass the async request itself
  //         deleteFoodEntry(entry.id).then((result) => {
  //           // Important: if there's an error, we must throw it
  //           // for toast.promise to catch it in the error state.
  //           if (result?.error) {
  //             throw new Error(result.error);
  //           }
  //           return result;
  //         }),
  //         // Describe the messages for each state
  //         {
  //           loading: "Deleting entry...",
  //           success: "Entry deleted successfully!",
  //           error: (err) => `Error: ${err.message}`, // Display the error message
  //         }
  //       );
  //     });
  //   }
  // };

  const performDelete = () => {
    startTransition(() => {
      toast.promise(
        deleteFoodEntry(entry.id).then((result) => {
          if (result?.error) {
            throw new Error(result.error);
          }
          return result;
        }),
        {
          loading: "Deleting entry...",
          success: "Entry deleted successfully!",
          error: (err) => `Error: ${err.message}`,
        }
      );
    });
  };

  const askForConfirmation = () => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold text-center">
            Are you sure you want to delete this entry?
          </p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                toast.dismiss(t.id);
                performDelete(); // Викликаємо функцію видалення
              }}
            >
              Yes, delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-sm flex flex-col md:flex-row md:items-center gap-4">
      {/* --- Верхня частина: Назва і кнопка --- */}
      <div className="flex-grow flex items-center justify-between">
        <p className="font-medium text-gray-800 mr-4">{entry.entry_text}</p>
        <button
          onClick={askForConfirmation}
          disabled={isPending}
          className="p-2 text-gray-400 transition-colors rounded-full hover:bg-red-100 disabled:opacity-50 flex-shrink-0 cursor-pointer hover:shadow-md active:shadow-sm active:hover:bg-red-200"
          aria-label="Видалити запис"
        >
          {isPending ? (
            <div className="size-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <TrashIcon className="size-4 text-red-500" />
          )}
        </button>
      </div>

      {/* --- Нижня частина: Нутрієнти (використовуємо Grid) --- */}
      {/* w-full розтягує на всю ширину на мобільних, md:w-auto - повертає до авто-ширини на десктопі */}
      <div className="w-full md:w-auto grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-2 text-xs text-gray-600 text-center flex-shrink-0">
        <div>
          <span className="font-bold block">{entry.calories}</span>
          <span>kcal</span>
        </div>
        <div>
          <span className="font-bold block">{entry.protein_g}g</span>
          <span>protein</span>
        </div>
        <div>
          <span className="font-bold block">{entry.fat_g}g</span>
          <span>fat</span>
        </div>
        <div>
          <span className="font-bold block">{entry.carbs_g}g</span>
          <span>carbs</span>
        </div>
        {/* Показуємо цукор, тільки якщо він є */}
        {entry.sugar_g != null && (
          <div>
            <span className="font-bold block">{entry.sugar_g}g</span>
            <span>sugar</span>
          </div>
        )}
      </div>
    </div>
  );
}
