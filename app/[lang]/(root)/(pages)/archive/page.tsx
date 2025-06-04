import { NutritionArchive } from "@/components/archive/nutrition-archive";
import { Locale } from "@/i18n.config";

export default async function Archive({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  console.log(lang);

  // Хардкод данных с блюдами и категориями
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
              meals: [
                {
                  type: "Breakfast",
                  dishes: [
                    {
                      cal: 780,
                      protein: 26,
                      carbs: 64,
                      fat: 46,
                      dish: "Омлет с молоком, кофе с сахаром и сливками, круасан с шоколадом, сосиска в тесте",
                    },
                  ],
                },
                {
                  type: "Lunch",
                  dishes: [
                    {
                      cal: 650,
                      protein: 30,
                      carbs: 70,
                      fat: 25,
                      dish: "Куриная грудка с рисом, салат из огурцов и помидоров",
                    },
                  ],
                },
                {
                  type: "Dinner",
                  dishes: [],
                },
                { type: "Snack 1", dishes: [] },
                { type: "Snack 2", dishes: [] },
                { type: "Snack 3", dishes: [] },
              ],
            },
            // Другие дни без изменений
            {
              date: "Fri, 2",
              fullDate: "2024-02-02",
              calories: 1900,
              protein: 90,
              fats: 62,
              carbs: 195,
              meals: [], // Пустые meals для примера
            },
            {
              date: "Thu, 1",
              fullDate: "2024-02-01",
              calories: 2100,
              protein: 105,
              fats: 68,
              carbs: 215,
              meals: [], // Пустые meals
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
              meals: [], // Пустые meals
            },
            {
              date: "Wed, 3",
              fullDate: "2024-01-03",
              calories: 2050,
              protein: 100,
              fats: 65,
              carbs: 210,
              meals: [], // Пустые meals
            },
            {
              date: "Tue, 2",
              fullDate: "2024-01-02",
              calories: 2200,
              protein: 115,
              fats: 70,
              carbs: 225,
              meals: [], // Пустые meals
            },
            {
              date: "Mon, 1",
              fullDate: "2024-01-01",
              calories: 1800,
              protein: 85,
              fats: 60,
              carbs: 190,
              meals: [], // Пустые meals
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
              meals: [], // Пустые meals
            },
            {
              date: "Sat, 30",
              fullDate: "2023-12-30",
              calories: 2050,
              protein: 100,
              fats: 68,
              carbs: 210,
              meals: [], // Пустые meals
            },
            {
              date: "Fri, 29",
              fullDate: "2023-12-29",
              calories: 1950,
              protein: 110,
              fats: 65,
              carbs: 180,
              meals: [], // Пустые meals
            },
            {
              date: "Thu, 28",
              fullDate: "2023-12-28",
              calories: 2150,
              protein: 95,
              fats: 70,
              carbs: 220,
              meals: [], // Пустые meals
            },
          ],
        },
        {
          name: "November",
          days: [
            {
              date: "Thu, 30",
              fullDate: "2023-11-30",
              calories: 2000,
              protein: 95,
              fats: 65,
              carbs: 205,
              meals: [], // Пустые meals
            },
            {
              date: "Wed, 29",
              fullDate: "2023-11-29",
              calories: 1900,
              protein: 105,
              fats: 60,
              carbs: 190,
              meals: [], // Пустые meals
            },
            {
              date: "Tue, 28",
              fullDate: "2023-11-28",
              calories: 2100,
              protein: 90,
              fats: 72,
              carbs: 215,
              meals: [], // Пустые meals
            },
          ],
        },
      ],
    },
  ];

  return <NutritionArchive nutritionData={nutritionData} />;
}
