import { COMMON_TEXTS } from "../shared/(texts)/app-texts";
import "@/utils/stringExtensions";

export const RECIPES_TEXTS = {
  MY_RECIPES: "Мої рецепти",
  CREATE_NEW_RECIPE: "Створюйте та керуйте власними рецептами.",

  // create-recipe-form.tsx
  Z_NAME_MIN_LENGTH: "Ім'я має бути довшим",
  Z_INGREDIENTS_MIN_LENGTH:
    "Будь ласка, надайте більше деталей щодо інгредієнтів",
  TOAST_SUCCESS: "Рецепт успішно створено!",
  ANALYZING_INGREDIENTS: "Аналіз інгредієнтів...",
  TITLE: "Створити новий рецепт",
  RECIPE_NAME_LABEL: "Назва рецепту",
  INGREDIENTS: "Інгредієнти",
  INGREDIENTS_DESCRIPTION: "введіть кожен інгредієнт із його вагою",
  RECIPE_NAME_PLACEHOLDER:
    "Наприклад: '200г курячої грудки', '1 столова ложка оливкової олії', '150г броколі'",
  SAVE_BUTTON: COMMON_TEXTS.SAVE_BUTTON,

  // recipe-list.tsx
  DELETE_WARNING: "Ви впевнені, що хочете видалити цей рецепт?",
  RECIPE_WAS_DELETED: "Рецепт видалено!",
  CONFIRM_DELETE: COMMON_TEXTS.CONFIRM_DELETE,
  CANCEL: COMMON_TEXTS.CANCEL,
  VIEW_RECIPE: "Переглянути рецепт",
  PER_100G: "на 100г",
  NUTRITIONAL_VALUES: "Харчові цінності",
  NO_RECIPES: "У вас ще немає збережених рецептів.",
  TOTAL_WEIGHT_OF_MEAL: "Загальна вага страви:",
  CALORIES: COMMON_TEXTS.CALORIES,
  PROTEIN: COMMON_TEXTS.PROTEIN,
  PROTEIN_SHORT: COMMON_TEXTS.PROTEIN.slice(0, 1),
  FAT: COMMON_TEXTS.FAT,
  FAT_SHORT: COMMON_TEXTS.FAT.slice(0, 1),
  CARBOHYDRATE: COMMON_TEXTS.CARBOHYDRATE,
  CARBOHYDRATE_SHORT: COMMON_TEXTS.CARBOHYDRATE.slice(0, 1),
  SUGAR: COMMON_TEXTS.SUGAR,
  SUGAR_SHORT: COMMON_TEXTS.SUGAR.slice(0, 1),
  UNIT_KILOCALORIE: COMMON_TEXTS.UNIT_KILOCALORIE,
  UNIT_GRAM: COMMON_TEXTS.UNIT_GRAM,
};
