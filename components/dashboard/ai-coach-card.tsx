"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeAndSaveActivityEntry } from "@/app/actions";
import { useTransition } from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { ActivityEntryCard } from "./activity-entry-card";

const activitySchema = z.object({
  text: z.string().min(3, { message: "Опишіть активність детальніше" }),
});
type ActivitySchema = z.infer<typeof activitySchema>;

// Типи для пропсів
type ActivityEntry = {
  id: number;
  entry_text: string;
  calories_burned: number;
};
interface AICoachCardProps {
  activityLogData: ActivityEntry[];
}

export function AICoachCard({ activityLogData }: AICoachCardProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
  });

  const onSubmit = async (data: ActivitySchema) => {
    startTransition(async () => {
      const result = await analyzeAndSaveActivityEntry(data.text);
      if (result?.error) {
        alert("Помилка: " + result.error);
      } else {
        reset();
      }
    });
  };

  return (
    <Card>
      {/* Показуємо список доданих активностей, якщо вони є */}
      {activityLogData.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-stone-900 mb-3">
            Сьогоднішні активності
          </h3>
          <div className="space-y-2">
            {activityLogData.map((entry) => (
              <ActivityEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {/* Форма для додавання нової активності */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-stone-900">
            Трекер активності
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register("text")}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder="Опиши свою активність (напр., 'Пробіжка 45 хвилин')"
          />
          {errors.text && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Аналіз..." : "Додати активність"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
