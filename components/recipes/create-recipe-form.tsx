"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAndAnalyzeRecipe } from "@/app/actions";
import { Button, SimpleRiseSpinner } from "../ui";
import { useTransition } from "react";
import { Card } from "../shared";
import toast from "react-hot-toast";
import { Coins } from "lucide-react";

const schema = z.object({
  recipeName: z.string().min(3, "Name must be longer"),
  ingredientsText: z
    .string()
    .min(10, "Please provide more detail for the ingredients"),
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
        toast.error(result.error);
      } else {
        toast.success("Рецепт успішно створено!");
        reset();
      }
    });
  };

  return (
    <Card>
      {isPending ? (
        <div className="flex flex-col items-center justify-center min-h-[487px] text-center">
          <h2 className="text-xl font-semibold mb-4">
            Аналіз інгредієнтів...
            <SimpleRiseSpinner />
          </h2>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="z-50">
          <h2 className="text-xl font-semibold">Створити новий рецепт</h2>

          <div>
            <label
              htmlFor="recipeName"
              className="block text-sm font-medium text-gray-700"
            >
              Назва рецепту
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
              Інгредієнти <br />
              <small>(введіть кожен інгредієнт із його вагою.)</small>
            </label>
            <textarea
              {...register("ingredientsText")}
              id="ingredientsText"
              rows={12}
              className="w-full p-2 border rounded-md mt-1"
              placeholder={`150г курячого філе\n200г рису\n50г моркви`}
            />
            {errors.ingredientsText && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ingredientsText.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <SimpleRiseSpinner />
            ) : (
              <>
                <p>Зберегти рецепт</p>
                <span className="flex gap-0.5 ml-1 text-white-500">
                  <Coins className="size-5" />1
                </span>
              </>
            )}
          </Button>
        </form>
      )}
    </Card>
  );
}
