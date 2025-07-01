import { NutritionArchive } from "@/components/archive/nutrition-archive";
import { Locale } from "@/i18n.config";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Archive({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { lang } = await params;
  console.log(lang);

  const nutritionData = [
    {
      year: 2024,
      months: [
        {
          name: "February",
          days: [
            {
              date: "Sat, 3",
              fullDate: "2024-02-03",
              calories: 2000,
              protein: 100,
              fats: 65,
              carbs: 205,
              sugar: 7,
              water: 3500,
              weight: 110,
              belly: 110,
              waist: 103,
            },
            {
              date: "Fri, 2",
              fullDate: "2024-02-02",
              calories: 1900,
              protein: 90,
              fats: 62,
              carbs: 195,
              sugar: 7,
              water: 3500,
              weight: 110,
              belly: 110,
              waist: 103,
            },
          ],
        },
        {
          name: "January",
          days: [
            {
              date: "Thu, 4",
              fullDate: "2024-01-04",
              calories: 1950,
              protein: 95,
              fats: 63,
              carbs: 200,
              sugar: 7,
              water: 3500,
              weight: 110,
              belly: 110,
              waist: 103,
            },
            {
              date: "Wed, 3",
              fullDate: "2024-01-03",
              calories: 2050,
              protein: 100,
              fats: 65,
              carbs: 210,
              sugar: 7,
              water: 3500,
              weight: 110,
              belly: 110,
              waist: 103,
            },
          ],
        },
      ],
    },
    {
      year: 2023,
      months: [
        {
          name: "December",
          days: [
            {
              date: "Sun, 31",
              fullDate: "2023-12-31",
              calories: 2300,
              protein: 120,
              fats: 75,
              carbs: 230,
              sugar: 7,
              water: 3500,
              weight: 110,
              belly: 110,
              waist: 103,
            },
            {
              date: "Sat, 30",
              fullDate: "2023-12-30",
              calories: 2050,
              protein: 100,
              fats: 68,
              carbs: 210,
              sugar: 7,
              water: 3500,
              weight: 110,
              belly: 110,
              waist: 103,
            },
          ],
        },
      ],
    },
  ];

  return <NutritionArchive nutritionData={nutritionData} />;
}
