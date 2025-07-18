"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAndAnalyzeRecipe } from "@/app/actions";
import { Button } from "../ui";
import { useTransition } from "react";

const schema = z.object({
  recipeName: z.string().min(3, "Назва має бути довшою"),
  ingredientsText: z.string().min(10, "Опиши інгредієнти детальніше"),
});

type Schema = z.infer<typeof schema>;

export function CreateRecipeForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Schema) => {
    startTransition(async () => {
      const result = await createAndAnalyzeRecipe(data);
      if (result?.error) {
        alert("Помилка: " + result.error);
      } else {
        alert(result.success);
        reset();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white rounded-lg border shadow-sm space-y-4"
    >
      <h2 className="text-xl font-semibold">Створити новий рецепт</h2>

      <div>
        <label
          htmlFor="recipeName"
          className="block text-sm font-medium text-gray-700"
        >
          Назва рецепта
        </label>
        <input
          {...register("recipeName")}
          id="recipeName"
          className="w-full p-2 border rounded-md mt-1"
        />
        {errors.recipeName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.recipeName.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="ingredientsText"
          className="block text-sm font-medium text-gray-700"
        >
          Інгредієнти (кожен з нової строки, з вагою)
        </label>
        <textarea
          {...register("ingredientsText")}
          id="ingredientsText"
          rows={6}
          className="w-full p-2 border rounded-md mt-1"
          placeholder={`Наприклад:\n150г курячого філе\n200г рису\n50г моркви`}
        />
        {errors.ingredientsText && (
          <p className="text-red-500 text-sm mt-1">
            {errors.ingredientsText.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Аналіз та збереження..." : "Зберегти рецепт"}
      </Button>
    </form>
  );
}
