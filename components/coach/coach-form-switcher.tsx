"use client";

import { useState } from "react";
import { CreateWorkoutForm } from "@/components/coach/create-workout-form";
import { WorkoutPlanForm } from "@/components/coach/workout-plan-form";

export function CoachFormSwitcher() {
  const [activeForm, setActiveForm] = useState<"workout" | "plan">("workout");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-2 md:gap-0">
        <button
          onClick={() => setActiveForm("workout")}
          className={`flex-1 p-4 md:rounded-l-lg font-semibold transition-all ${
            activeForm === "workout"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-white text-gray-800 hover:bg-orange-100 cursor-pointer"
          }`}
        >
          Створити разове тренування
        </button>
        <button
          onClick={() => setActiveForm("plan")}
          className={`flex-1 p-4 md:rounded-r-lg font-semibold transition-all ${
            activeForm === "plan"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-white text-gray-800 hover:bg-orange-100 cursor-pointer"
          }`}
        >
          Створити план на тиждень
        </button>
      </div>

      {activeForm === "workout" ? <CreateWorkoutForm /> : <WorkoutPlanForm />}
    </div>
  );
}
