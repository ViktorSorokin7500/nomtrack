// app/[lang]/(root)/(pages)/coach/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkoutPlanCard } from "@/components/coach/workout-plan-card";
import { WorkoutPlanForm } from "@/components/coach/workout-plan-form";
import { Accordion } from "@/components/ui";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

// Типи для даних, що будуть завантажуватися з БД
export type WorkoutPlan = {
  plan_title: string;
  daily_plans: {
    day: string;
    type: string;
    estimated_calories_burned: number;
    exercises: {
      name: string;
      sets?: number;
      reps?: string;
      duration_min?: number;
      duration_sec?: number;
    }[];
  }[];
  general_recommendations: string;
};

// Додамо новий тип для даних з бази, що включає id та created_at
export type DbWorkoutPlan = {
  id: number;
  created_at: string;
  plan_data: WorkoutPlan;
};

export default async function CoachPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/sign-in");
  } // Завантажуємо ВСІ збережені плани тренувань

  const { data: allPlans, error } = await (await supabase)
    .from("workout_plans")
    .select("id, created_at, plan_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Помилка завантаження планів:", error);
  }

  const plans = (allPlans || []) as DbWorkoutPlan[];

  return (
    <div className="bg-orange-50 p-2 sm:p-8 min-h-screen">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-stone-900">
          Ваш Персональний ШІ Тренер
        </h1>
        <WorkoutPlanForm />
        {plans.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              Історія планів
            </h2>
            <Accordion.Accordion type="single" collapsible className="w-full">
              {plans.map((plan) => (
                <Accordion.Item
                  key={plan.id}
                  value={String(plan.id)}
                  className="border-b border-orange-200"
                >
                  <Accordion.Trigger className="flex justify-between items-center p-4 hover:bg-orange-50 transition-colors rounded-lg">
                    <span className="font-semibold text-lg text-stone-800">
                      План від{" "}
                      {format(new Date(plan.created_at), "d MMMM yyyy", {
                        locale: uk,
                      })}
                    </span>
                  </Accordion.Trigger>
                  <Accordion.Content className="p-4 pt-0">
                    <WorkoutPlanCard plan={plan.plan_data} />
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Accordion>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            Поки що немає плану тренувань. Будь ласка, згенеруйте його.
          </p>
        )}
      </div>
    </div>
  );
}
