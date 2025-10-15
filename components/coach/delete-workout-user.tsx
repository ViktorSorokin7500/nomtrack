"use client";
import { deleteEntry } from "@/app/actions";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { COACH_TEXTS } from "./coach-text";

export function DeleteWorkoutUser({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteActivity = (activityId: number) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold">
            {COACH_TEXTS.DELETE_WORKOUT_USER.DELETE_TRAINING}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                startTransition(() => {
                  deleteEntry("user_workouts", activityId).then((res) => {
                    if (res.error) {
                      toast.error(res.error);
                    } else {
                      toast.success(
                        res.success ||
                          COACH_TEXTS.DELETE_WORKOUT_USER.DELETE_SUCCESS
                      );
                    }
                  });
                });
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              {COACH_TEXTS.DELETE_WORKOUT_USER.CONFIRM_DELETE}
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
            >
              {COACH_TEXTS.DELETE_WORKOUT_USER.CANCEL}
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
      {COACH_TEXTS.DELETE_WORKOUT_USER.DELETE}
    </button>
  );
}
