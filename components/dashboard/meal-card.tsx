"use client";

import { Resolver, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  analyzeAndSaveFoodEntry,
  addManualFoodEntry,
  searchGlobalFood,
  saveGlobalFoodToFavorites,
  getSavedGlobalFood,
  deleteSavedGlobalFood,
} from "@/app/actions";
import { Button, SimpleRiseSpinner } from "../ui";
import { useEffect, useTransition, useState } from "react";
import { foodEntrySchema, type FoodEntryFormSchema } from "@/lib/validators";
import toast from "react-hot-toast";
import { Card } from "../shared";
import { UserRecipe } from "@/types";
import { Coins, XCircle, Star, ChevronDown, Trash2 } from "lucide-react";
import { DASHBOARD_TEXTS } from "./dashboard-text";
import { AI_REQUEST } from "@/lib/const";

type GlobalFoodSearchResult = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  is_favorite?: boolean;
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
  const [savedFoods, setSavedFoods] = useState<GlobalFoodSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedGlobalFood, setSelectedGlobalFood] =
    useState<GlobalFoodSearchResult | null>(null);
  const [isQuickSelectOpen, setIsQuickSelectOpen] = useState(false);

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
      meal_type: "snack",
      selected_recipe_id: "",
      entry_text: "",
    },
  });

  const entryMode = useWatch({ control, name: "entry_mode" });
  const selectedRecipeId = useWatch({ control, name: "selected_recipe_id" });
  const isRecipeSelected = entryMode === "manual" && !!selectedRecipeId;

  const truncateName = (name: string, limit: number = 12) => {
    if (name.length > limit) {
      return name.slice(0, limit) + "...";
    }
    return name;
  };

  // НОВЕ: Відстежуємо calc_mode
  const calcMode = useWatch({ control, name: "calc_mode" });

  useEffect(() => {
    startTransition(async () => {
      const result = await getSavedGlobalFood();
      if (result.success) {
        setSavedFoods(result.success as GlobalFoodSearchResult[]);
      }
    });
  }, []);

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
        const savedIds = new Set(savedFoods.map((f) => f.id));
        const filteredResults = (
          result.success as GlobalFoodSearchResult[]
        ).filter((food) => !savedIds.has(food.id));

        setGlobalSearchResults(filteredResults);
      }
      setSearchLoading(false);
    };

    const debounceSearch = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm, entryMode, savedFoods]);

  useEffect(() => {
    if (entryMode !== "manual") return;
    if (selectedGlobalFood) return;

    if (!selectedRecipeId) {
      setValue("entry_text", "");
      setValue("calories", undefined);
      setValue("protein_g", undefined);
      setValue("fat_g", undefined);
      setValue("carbs_g", undefined);
      // setValue("sugar_g", undefined);
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
      // setValue("sugar_g", recipe.sugar_per_100g);
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
    // setValue("sugar_g", food.carbs);
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

  const handleSaveToFavorites = (food: GlobalFoodSearchResult) => {
    startTransition(async () => {
      const result = await saveGlobalFoodToFavorites(food.id, food.name);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          result.success || DASHBOARD_TEXTS.MEAL_CARD.SUBMIT_SUCCESS
        );
        setSearchTerm("");

        const newSavedFood: GlobalFoodSearchResult = {
          ...food,
          is_favorite: true,
        };
        setSavedFoods([newSavedFood, ...savedFoods]);

        setGlobalSearchResults((prev) =>
          prev.filter((item) => item.id !== food.id)
        );
      }
    });
  };

  const handleDeleteSavedFood = (foodId: number) => {
    startTransition(async () => {
      const result = await deleteSavedGlobalFood(foodId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          result.success || DASHBOARD_TEXTS.MEAL_CARD.SUBMIT_SUCCESS
        );
        // Видаляємо з локального стану
        setSavedFoods((prev) => prev.filter((item) => item.id !== foodId));
      }
    });
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
              {savedFoods.length > 0 && !selectedGlobalFood && !searchTerm && (
                <div className="border border-orange-200 rounded-lg p-2 bg-orange-50/50">
                  <h4
                    className="font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                    onClick={() => setIsQuickSelectOpen((prev) => !prev)}
                  >
                    {DASHBOARD_TEXTS.MEAL_CARD.QUICK_SEARCH}
                    <ChevronDown
                      className={`size-4 transition-transform duration-300 ${
                        isQuickSelectOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </h4>
                  <div
                    className={`flex flex-wrap gap-3 transition-all duration-500 ease-in-out overflow-y-auto ${
                      isQuickSelectOpen ? "mt-2" : "max-h-0"
                    }`}
                  >
                    {savedFoods.map((food) => (
                      <div key={food.id} className="relative group">
                        <button
                          type="button"
                          onClick={() => handleSelectGlobalFood(food)}
                          className="px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 rounded-full transition-colors flex items-center gap-1 cursor-pointer pr-5"
                          title={food.name}
                        >
                          <Star className="size-3 text-yellow-600 fill-yellow-600" />
                          <span className="truncate">
                            {truncateName(food.name)}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedFood(food.id)}
                          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
                          disabled={isPending}
                        >
                          <Trash2 className="size-4 cursor-pointer" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    <div
                      key={food.id}
                      className="w-full p-3 hover:bg-gray-100 transition-colors border-b last:border-b-0 flex justify-between items-center"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectGlobalFood(food)}
                        className="w-full text-left p-2 hover:bg-gray-100 transition-colors "
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
                      <button
                        type="button"
                        onClick={() => handleSaveToFavorites(food)}
                        disabled={isPending}
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                        aria-label="Додати до вибраного"
                      >
                        <Star className="size-5 hover:fill-yellow-600 cursor-pointer" />
                      </button>
                    </div>
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
                  placeholder={DASHBOARD_TEXTS.MEAL_CARD.UNIT_KILOCALORIE}
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
                {/* <input
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
                /> */}
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

          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {availableMealTypes.map((meal) => (
              <label
                key={meal.value}
                className="flex-1 cursor-pointer p-1 rounded-lg has-[:checked]:bg-white has-[:checked]:shadow transition-all text-sm flex justify-center items-center font-medium"
              >
                <input
                  type="radio"
                  value={meal.value}
                  {...register("meal_type")}
                  className="sr-only"
                />
                {meal.label}
              </label>
            ))}
          </div>

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
