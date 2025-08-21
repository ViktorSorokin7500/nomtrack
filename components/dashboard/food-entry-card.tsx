"use client";

import { useTransition } from "react";
import { deleteFoodEntry } from "@/app/actions";
import toast from "react-hot-toast";
import { Button } from "../ui";
import { FoodEntry } from "@/types";

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

interface FoodEntryCardProps {
  entry: FoodEntry;
}

// Об'єкт для перекладу та кольорів
const mealLabels: { [key: string]: string } = {
  breakfast: "Сніданок",
  lunch: "Обід",
  dinner: "Вечеря",
  snack: "Перекус",
};

const mealColors: { [key: string]: string } = {
  breakfast: "text-yellow-400",
  lunch: "text-green-400",
  dinner: "text-orange-400",
  snack: "text-sky-300",
};

export function FoodEntryCard({ entry }: FoodEntryCardProps) {
  const [isPending, startTransition] = useTransition();

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
          loading: "Видалення запису...",
          success: "Запис успішно видалено!",
          error: (err) => `Помилка: ${err.message}`,
        }
      );
    });
  };

  const askForConfirmation = () => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold text-center">
            Ви впевнені, що хочете видалити цей запис?
          </p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                toast.dismiss(t.id);
                performDelete();
              }}
            >
              Так, видалити
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Відміна
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
      {/* --- Верхня частина: Назва, тип прийому їжі та кнопка --- */}
      <div className="flex-grow flex items-center justify-between">
        <div className="flex flex-col">
          {/* НОВИЙ БЛОК: Тип прийому їжі */}
          <span
            className={`text-xs font-semibold ${mealColors[entry.meal_type]}`}
          >
            {mealLabels[entry.meal_type]}
          </span>
          <p className="font-medium text-gray-800 mr-4">{entry.entry_text}</p>
        </div>
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

      <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs text-gray-600 text-center flex-shrink-0">
        <div>
          <span className="font-bold block">{entry.calories}</span>
          <span>ккал</span>
        </div>
        <div>
          <span className="font-bold block">{entry.protein_g}г</span>
          <span>білки</span>
        </div>
        <div>
          <span className="font-bold block">{entry.fat_g}г</span>
          <span>жири</span>
        </div>
        <div>
          <span className="font-bold block">{entry.carbs_g}г</span>
          <span>вугл.</span>
        </div>
        {/* {entry.sugar_g != null && (
          <div>
            <span className="font-bold block">{entry.sugar_g}г</span>
            <span>цукор</span>
          </div>
        )} */}
      </div>
    </div>
  );
}
