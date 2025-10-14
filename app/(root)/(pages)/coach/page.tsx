import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Accordion } from "@/components/ui";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { DbSavedWorkout, DbWorkoutPlan } from "@/types";
import {
  CoachFormSwitcher,
  DeleteWorkoutUser,
  WorkoutPlanCard,
} from "@/components/coach";
import { Dumbbell, Flame } from "lucide-react";
import { COACH_TEXTS } from "@/components/coach/coach-text";

// Типи для даних, що будуть завантажуватися з БД

export default async function CoachPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Завантажуємо ВСІ збережені плани тренувань
  const { data: allPlans, error } = await (await supabase)
    .from("workout_plans")
    .select("id, created_at, plan_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  // Завантажуємо збережені тренування
  const { data: savedWorkouts, error: savedWorkoutsError } = await (
    await supabase
  )
    .from("user_workouts")
    .select(
      "id, created_at, workout_name, estimated_calories_burned, workout_data"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (savedWorkoutsError) {
    console.error(savedWorkoutsError);
  }

  const plans = (allPlans || []) as DbWorkoutPlan[];
  const savedWorkoutsData = (savedWorkouts || []) as DbSavedWorkout[];

  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-stone-900 text-center">
          {COACH_TEXTS.COACH_PAGE.TITLE_START} <br className="sm:hidden" />{" "}
          {COACH_TEXTS.COACH_PAGE.TITLE_END}
        </h1>
        <CoachFormSwitcher />
        {plans.length > 0 || savedWorkoutsData.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              {COACH_TEXTS.COACH_PAGE.HISTORY}
            </h2>
            <Accordion.Accordion type="single" collapsible className="w-full">
              {savedWorkoutsData.length > 0 && (
                <Accordion.Item
                  value="saved-workouts"
                  className="border-b border-orange-200"
                >
                  <Accordion.Trigger className="flex justify-between items-center p-4 hover:bg-orange-50 transition-colors rounded-lg">
                    <span className="font-semibold text-lg text-stone-800">
                      {COACH_TEXTS.COACH_PAGE.MY_SAVED_TRAININGS}
                    </span>
                  </Accordion.Trigger>
                  <Accordion.Content className="p-4 pt-0 space-y-4">
                    {savedWorkoutsData.map((workout) => (
                      <div
                        key={workout.id}
                        className="p-4 border rounded-lg bg-gray-50/70"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Dumbbell size={20} className="text-orange-600" />
                            <span className="font-semibold">
                              {workout.workout_name}
                            </span>
                          </div>
                          <div className="flex items-center text-red-500 text-sm font-medium">
                            <Flame className="size-4 mr-1" />
                            {workout.estimated_calories_burned}{" "}
                            {COACH_TEXTS.COACH_PAGE.UNIT_KILOCALORIE}
                          </div>
                        </div>
                        <ul className="text-sm mt-2 space-y-1 text-gray-600">
                          {workout.workout_data.map((exercise, index) => (
                            <li key={index}>
                              - {exercise.name}
                              {exercise.sets &&
                                exercise.reps &&
                                ` (${exercise.sets} x ${exercise.reps})`}
                              {exercise.duration_min &&
                                ` (${exercise.duration_min} ${COACH_TEXTS.COACH_PAGE.UNIT_MINUTES})`}
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between mt-2">
                          <div />
                          <DeleteWorkoutUser id={workout.id} />
                        </div>
                      </div>
                    ))}
                  </Accordion.Content>
                </Accordion.Item>
              )}
              {plans.length > 0 && (
                <Accordion.Item
                  value="generated-plans"
                  className="border-b border-orange-200"
                >
                  <Accordion.Trigger className="flex justify-between items-center p-4 hover:bg-orange-50 transition-colors rounded-lg">
                    <span className="font-semibold text-lg text-stone-800">
                      {COACH_TEXTS.COACH_PAGE.GENERATED_PLANS}
                    </span>
                  </Accordion.Trigger>
                  <Accordion.Content className="p-4 pt-0">
                    {plans.map((plan) => (
                      <div key={plan.id} className="mb-4">
                        <h3 className="font-semibold mb-2">
                          {COACH_TEXTS.COACH_PAGE.PLAN_FROM}{" "}
                          {format(new Date(plan.created_at), "d MMMM yyyy", {
                            locale: uk,
                          })}
                        </h3>
                        <WorkoutPlanCard id={plan.id} plan={plan.plan_data} />
                      </div>
                    ))}
                  </Accordion.Content>
                </Accordion.Item>
              )}
            </Accordion.Accordion>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            {COACH_TEXTS.COACH_PAGE.UMPTY}
          </p>
        )}
      </div>
    </div>
  );
}
