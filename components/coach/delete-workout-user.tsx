"use client";
import { deleteUserWorkout } from "@/app/actions";
import { useTransition } from "react";
import toast from "react-hot-toast";

export function DeleteWorkoutUser({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteActivity = (activityId: number) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold">
            Ви впевнені, що хочете видалити план своїх тренувань?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                startTransition(() => {
                  deleteUserWorkout(activityId).then((res) => {
                    if (res.error) {
                      toast.error(res.error);
                    } else {
                      toast.success(res.success || "Активність видалено!");
                    }
                  });
                });
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Так, видалити
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
            >
              Скасувати
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  return (
    <button
      onClick={() => handleDeleteActivity(id)}
      disabled={isPending}
      className="rounded scale-110 text-white disabled:opacity-50 transition-colors cursor-pointer z-50 bg-red-500 p-1 hover:bg-red-600"
      aria-label="Delete Activity"
    >
      Видалити
    </button>
  );
}
