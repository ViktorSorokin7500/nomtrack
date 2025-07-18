import { CreateRecipeForm } from "@/components/recipes/create-recipe-form";
import { createClient } from "@/lib/supabase/server";

export default async function RecipesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  // Завантажуємо список вже існуючих рецептів користувача
  const { data: recipes } = await (
    await supabase
  )
    .from("user_recipes")
    .select(
      "id, recipe_name, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g"
    )
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Мої рецепти</h1>
        <p className="text-gray-500">
          Створюй та керуй своїми власними рецептами.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ліва колонка для створення нового рецепта */}
        <div className="md:col-span-1">
          <CreateRecipeForm />
        </div>

        {/* Права колонка для відображення списку рецептів */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            {recipes && recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 border rounded-lg bg-white shadow-sm"
                >
                  <h3 className="font-bold">{recipe.recipe_name}</h3>
                  <p className="text-sm text-gray-500">
                    На 100г: {recipe.calories_per_100g} ккал, Б:{" "}
                    {recipe.protein_per_100g}г, Ж: {recipe.fat_per_100g}г, В:{" "}
                    {recipe.carbs_per_100g}г
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                У вас ще немає збережених рецептів.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
