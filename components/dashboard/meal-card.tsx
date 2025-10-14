"use client";

import { Resolver, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  analyzeAndSaveFoodEntry,
  addManualFoodEntry,
  searchGlobalFood,
} from "@/app/actions";
import { Button, SimpleRiseSpinner } from "../ui";
import { useEffect, useTransition, useState } from "react";
import { foodEntrySchema, type FoodEntryFormSchema } from "@/lib/validators";
import toast from "react-hot-toast";
import { Card } from "../shared";
import { UserRecipe } from "@/types";
import { Coins, XCircle } from "lucide-react";
import { DASHBOARD_TEXTS } from "./dashboard-text";
import { AI_REQUEST } from "@/lib/const";

type GlobalFoodSearchResult = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

interface MealCardProps {
  availableMealTypes: { value: string; label: string }[];
  userRecipes: UserRecipe[];
  className?: string;
}

export function MealCard({
  availableMealTypes,
  userRecipes,
  className,
}: MealCardProps) {
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState("");
  const [globalSearchResults, setGlobalSearchResults] = useState<
    GlobalFoodSearchResult[]
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedGlobalFood, setSelectedGlobalFood] =
    useState<GlobalFoodSearchResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FoodEntryFormSchema>({
    resolver: zodResolver(foodEntrySchema) as Resolver<FoodEntryFormSchema>,
    defaultValues: {
      entry_mode: "ai",
      calc_mode: "per100g",
      meal_type: "",
      selected_recipe_id: "",
      entry_text: "",
    },
  });

  const entryMode = useWatch({ control, name: "entry_mode" });
  const selectedRecipeId = useWatch({ control, name: "selected_recipe_id" });
  const isRecipeSelected = entryMode === "manual" && !!selectedRecipeId;

  // НОВЕ: Відстежуємо calc_mode
  const calcMode = useWatch({ control, name: "calc_mode" });

  useEffect(() => {
    const handleSearch = async () => {
      if (entryMode !== "manual" || searchTerm.length < 2) {
        setGlobalSearchResults([]);
        return;
      }
      setSearchLoading(true);
      const result = await searchGlobalFood(searchTerm);
      if (result.error) {
        toast.error(`${DASHBOARD_TEXTS.MEAL_CARD.ERROR} ${result.error}`);
        setGlobalSearchResults([]);
      } else if (result.success) {
        setGlobalSearchResults(result.success as GlobalFoodSearchResult[]);
      }
      setSearchLoading(false);
    };

    const debounceSearch = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm, entryMode]);

  useEffect(() => {
    if (entryMode !== "manual") return;
    if (selectedGlobalFood) return;

    if (!selectedRecipeId) {
      setValue("entry_text", "");
      setValue("calories", undefined);
      setValue("protein_g", undefined);
      setValue("fat_g", undefined);
      setValue("carbs_g", undefined);
      setValue("sugar_g", undefined);
      return;
    }

    const recipe = userRecipes.find((r) => String(r.id) === selectedRecipeId);
    if (recipe) {
      setValue("entry_text", recipe.recipe_name);
      setValue("calc_mode", "per100g");
      setValue("calories", recipe.calories_per_100g);
      setValue("protein_g", recipe.protein_per_100g);
      setValue("fat_g", recipe.fat_per_100g);
      setValue("carbs_g", recipe.carbs_per_100g);
      setValue("sugar_g", recipe.sugar_per_100g);
    } else {
      console.error(
        `${DASHBOARD_TEXTS.MEAL_CARD.RECIPE_ERROR} ${selectedRecipeId}`
      );
    }
  }, [selectedRecipeId, entryMode, userRecipes, setValue, selectedGlobalFood]);

  const onSubmit = (data: FoodEntryFormSchema) => {
    startTransition(async () => {
      let result;
      if (selectedGlobalFood) {
        result = await addManualFoodEntry({
          ...data,
          entry_text: selectedGlobalFood.name,
          calories: selectedGlobalFood.calories,
          protein_g: selectedGlobalFood.protein,
          fat_g: selectedGlobalFood.fat,
          carbs_g: selectedGlobalFood.carbs,
          sugar_g: selectedGlobalFood.carbs,
          entry_mode: "manual",
        });
      } else if (data.entry_mode === "ai") {
        result = await analyzeAndSaveFoodEntry({
          text: data.entry_text!,
          mealType: data.meal_type,
        });
      } else {
        result = await addManualFoodEntry(data);
      }

      if (result?.error) {
        toast.error(`${DASHBOARD_TEXTS.MEAL_CARD.ERROR} ${result.error}`);
      } else {
        toast.success(DASHBOARD_TEXTS.MEAL_CARD.SUBMIT_SUCCESS);
        reset({
          entry_mode: data.entry_mode,
          calc_mode: "per100g",
          meal_type: "",
          selected_recipe_id: "",
          entry_text: "",
          calories: undefined,
          protein_g: undefined,
          fat_g: undefined,
          carbs_g: undefined,
          sugar_g: undefined,
          servings: undefined,
          weight_eaten: undefined,
        });
        setGlobalSearchResults([]);
        setSelectedGlobalFood(null);
      }
    });
  };

  const handleSelectGlobalFood = (food: GlobalFoodSearchResult) => {
    setSelectedGlobalFood(food);
    setSearchTerm("");
    setGlobalSearchResults([]);
    setValue("entry_text", food.name);
    setValue("calories", food.calories);
    setValue("protein_g", food.protein);
    setValue("fat_g", food.fat);
    setValue("carbs_g", food.carbs);
    setValue("sugar_g", food.carbs);
    setValue("selected_recipe_id", "");
  };

  const handleResetGlobalFood = () => {
    setSelectedGlobalFood(null);
    setSearchTerm("");
    setValue("entry_text", "");
    setValue("calories", undefined);
    setValue("protein_g", undefined);
    setValue("fat_g", undefined);
    setValue("carbs_g", undefined);
    setValue("sugar_g", undefined);
  };

  const placeholderText =
    calcMode === "serving"
      ? DASHBOARD_TEXTS.MEAL_CARD.PORCE_QUANTITY
      : `${DASHBOARD_TEXTS.MEAL_CARD.WEIGHT} (${DASHBOARD_TEXTS.MEAL_CARD.UNIT_GRAM})`;

  return (
    <Card
      className={`meal-card bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            {DASHBOARD_TEXTS.MEAL_CARD.ADD_MEAL}
          </h3>

          <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
            <label className="flex justify-center flex-1 text-center cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm">
              <input
                type="radio"
                value="ai"
                {...register("entry_mode")}
                className="sr-only"
              />
              {DASHBOARD_TEXTS.MEAL_CARD.ANALIZE_AI}
              <span className="flex gap-0.5 ml-1 text-green-500">
                <Coins className="size-5" />
                {AI_REQUEST}
              </span>
            </label>
            <label className="flex-1 text-center cursor-pointer p-2 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm">
              <input
                type="radio"
                value="manual"
                {...register("entry_mode")}
                className="sr-only"
              />
              {DASHBOARD_TEXTS.MEAL_CARD.MANUAL_ENTER}
            </label>
          </div>

          {entryMode === "manual" && (
            <div className="p-4 border rounded-lg space-y-4 bg-gray-50/70">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={DASHBOARD_TEXTS.MEAL_CARD.SEARCH_IN_DB}
                  className={`w-full bg-white p-2 border rounded-md ${
                    selectedGlobalFood ? "hidden" : ""
                  }`}
                />
                {searchLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 animate-pulse">
                    {DASHBOARD_TEXTS.MEAL_CARD.SEACRH}
                  </span>
                )}
              </div>

              {globalSearchResults.length > 0 && (
                <div className="border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                  {globalSearchResults.map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => handleSelectGlobalFood(food)}
                      className="w-full text-left p-3 hover:bg-gray-100 transition-colors border-b last:border-b-0"
                    >
                      <h4 className="font-semibold text-gray-800">
                        {food.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {DASHBOARD_TEXTS.MEAL_CARD.CALORIES_SHORT}:{" "}
                        {food.calories} |{" "}
                        {DASHBOARD_TEXTS.MEAL_CARD.PROTEIN_SHORT}:{" "}
                        {food.protein}
                        {DASHBOARD_TEXTS.MEAL_CARD.UNIT_GRAM} |{" "}
                        {DASHBOARD_TEXTS.MEAL_CARD.FAT_SHORT}: {food.fat}
                        {DASHBOARD_TEXTS.MEAL_CARD.UNIT_GRAM}|{" "}
                        {DASHBOARD_TEXTS.MEAL_CARD.CARBOHYDRATE_SHORT}:{" "}
                        {food.carbs}
                        {DASHBOARD_TEXTS.MEAL_CARD.UNIT_GRAM}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {userRecipes?.length > 0 && !selectedGlobalFood && (
                <select
                  {...register("selected_recipe_id")}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="">
                    {DASHBOARD_TEXTS.MEAL_CARD.ADD_MY_RECIPE}
                  </option>
                  <option value="" disabled>
                    {DASHBOARD_TEXTS.MEAL_CARD.MY_RECIPE}
                  </option>
                  {userRecipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.recipe_name}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex gap-2 rounded-lg bg-gray-200 p-1 text-sm">
                <label className="flex-1 text-center cursor-pointer p-1 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all">
                  <input
                    type="radio"
                    value="per100g"
                    {...register("calc_mode")}
                    className="sr-only"
                  />
                  {DASHBOARD_TEXTS.MEAL_CARD.G_100}
                </label>
                {!selectedGlobalFood && (
                  <label className="flex-1 text-center cursor-pointer p-1 rounded-md has-[:checked]:bg-white has-[:checked]:shadow transition-all">
                    <input
                      type="radio"
                      value="serving"
                      {...register("calc_mode")}
                      className="sr-only"
                    />
                    {DASHBOARD_TEXTS.MEAL_CARD.SERVING}
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="1"
                  placeholder={placeholderText}
                  {...register(
                    calcMode === "serving" ? "servings" : "weight_eaten",
                    {
                      setValueAs: (v) => {
                        if (v === "" || v === null || v === undefined)
                          return undefined;
                        const num = Number(v);
                        return Number.isNaN(num) ? undefined : num;
                      },
                    }
                  )}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Калорії"
                  {...register("calories", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected || selectedGlobalFood
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected || !!selectedGlobalFood}
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder={DASHBOARD_TEXTS.MEAL_CARD.PROTEIN}
                  {...register("protein_g", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected || selectedGlobalFood
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected || !!selectedGlobalFood}
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder={DASHBOARD_TEXTS.MEAL_CARD.FAT}
                  {...register("fat_g", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected || selectedGlobalFood
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected || !!selectedGlobalFood}
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder={DASHBOARD_TEXTS.MEAL_CARD.CARBOHYDRATE}
                  {...register("carbs_g", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected || selectedGlobalFood
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected || !!selectedGlobalFood}
                />
                <input
                  type="number"
                  step={0.01}
                  placeholder={DASHBOARD_TEXTS.MEAL_CARD.SUGAR}
                  {...register("sugar_g", { valueAsNumber: true })}
                  className={`p-2 border rounded ${
                    isRecipeSelected || selectedGlobalFood
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  readOnly={isRecipeSelected || !!selectedGlobalFood}
                />
              </div>
              {errors.weight_eaten && (
                <p className="text-red-500 text-sm">
                  {errors.weight_eaten.message}
                </p>
              )}
            </div>
          )}

          <div
            className={`
              ${
                entryMode === "ai" || (!isRecipeSelected && !selectedGlobalFood)
                  ? "block"
                  : "hidden"
              }
            `}
          >
            <textarea
              {...register("entry_text")}
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-700"
              rows={2}
              placeholder={
                entryMode === "ai"
                  ? DASHBOARD_TEXTS.MEAL_CARD.AI_PLACEHOLDER
                  : DASHBOARD_TEXTS.MEAL_CARD.MANUAL_PLACEHOLDER
              }
            />
            {errors.entry_text && (
              <p className="text-red-500 text-sm">
                {errors.entry_text.message}
              </p>
            )}
          </div>

          {selectedGlobalFood && (
            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-between">
              <span className="font-semibold text-gray-700">
                {DASHBOARD_TEXTS.MEAL_CARD.SELECT} {selectedGlobalFood.name}
              </span>
              <button
                type="button"
                onClick={handleResetGlobalFood}
                className="text-red-500 hover:text-red-700"
              >
                <XCircle size={20} />
              </button>
            </div>
          )}

          <select
            {...register("meal_type")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
          >
            <option value="" disabled>
              {DASHBOARD_TEXTS.MEAL_CARD.OPTIONS}
            </option>
            {availableMealTypes.map((meal) => (
              <option key={meal.value} value={meal.value}>
                {meal.label}
              </option>
            ))}
          </select>
          {errors.meal_type && (
            <p className="text-red-500 text-sm">{errors.meal_type.message}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <SimpleRiseSpinner className="w-[98px]" />
              ) : (
                DASHBOARD_TEXTS.MEAL_CARD.SUBMIT_BUTTON
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
