import { CreateRecipeForm, RecipeList } from "@/components/recipes";
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
      "id, recipe_name, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g, ingredients_text, sugar_per_100g, total_weight_g" // <-- Додаємо поля
    )
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  return (
    <section className="bg-orange-50 p-4">
      <div className="container max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <p className="text-gray-500">Create and manage your own recipes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Ліва колонка для створення нового рецепта */}
          <div className="md:col-span-2">
            <CreateRecipeForm />
          </div>

          {/* Права колонка для відображення списку рецептів */}
          <div className="md:col-span-3">
            {/* Використовуємо наш новий компонент і передаємо йому дані */}
            <RecipeList recipes={recipes || []} />
          </div>
        </div>
      </div>
    </section>
  );
}
