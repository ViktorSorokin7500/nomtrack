import { capitalize } from "@/utils/stringExtensions";
import { COMMON_TEXTS } from "../shared/(texts)/app-texts";
import "@/utils/stringExtensions";

export const COACH_TEXTS = {
  COACH_PAGE: {
    TITLE_START: "Ваш персональний",
    TITLE_END: "ШІ трекер",
    HISTORY: "Історія активності",
    MY_SAVED_TRAININGS: "Мої збережені тренування",
    UNIT_KILOCALORIE: COMMON_TEXTS.UNIT_KILOCALORIE,
    UNIT_MINUTES: COMMON_TEXTS.UNIT_MINUTES,
    GENERATED_PLANS: "Історія згенерованих планів",
    PLAN_FROM: "План від",
    UMPTY:
      "Поки що немає збережених тренувань або планів. Будь ласка, згенеруйте або створіть їх.",
  },
  FORM_SWITCHER: {
    BUTTON_ONE: "Створити разове тренування",
    BUTTON_WEEK: "Створити план на тиждень",
  },
  CREATE_WORKOUT_FORM: {
    NAME_ERROR: "Назва має бути довшою.",
    TEXT_ERROR: "Будь ласка, детально опишіть вправи.",
    SUCCESS: "Тренування успішно створено!",
    TITLE: "Створити нове тренування",
    LABEL_NAME: "Назва тренування",
    LABEL_NAME_PLACEHOLDER: "Напр., 'Пробіжка + підтягування'",
    LABEL_DESCRIPTION: "Опис вправ",
    LABEL_DESCRIPTION_PLACEHOLDER:
      "Опишіть ваше тренування для аналізу ШІ. Напр., 'Пробіжка 30 хв, 3 підходи по 10 віджимань'.",
    SUBMIT_BUTTON: "Зберегти тренування",
  },
  DELETE_WORKOUT_USER: {
    DELETE_TRAINING: "Ви впевнені, що хочете видалити план своїх тренувань?",
    DELETE_SUCCESS: COMMON_TEXTS.DELETE_SUCCESS,
    CONFIRM_DELETE: COMMON_TEXTS.CONFIRM_DELETE,
    CANCEL: capitalize(COMMON_TEXTS.CANCEL),
    DELETE: capitalize(COMMON_TEXTS.DELETE),
  },
  WORKOUT_LIST: {
    NO_WORKOUTS: "Поки що немає збережених тренувань або планів.",
    SAVED_WORKOUTS_TITLE: "Збережені тренування",
    MY_WORKOUTS: "Мої тренування",
    UNIT_KILOCALORIE: "ккал",
  },
  WORKOUT_PLAN_CARD: {
    PLAN_FROM: "План від",
    DELETE_SUCCESS: COMMON_TEXTS.DELETE_SUCCESS,
    DELETE_TRAINING: "Ви впевнені, що хочете видалити цей план тренувань?",
    CONFIRM_DELETE: COMMON_TEXTS.CONFIRM_DELETE,
    CANCEL: capitalize(COMMON_TEXTS.CANCEL),
    DELETE: capitalize(COMMON_TEXTS.DELETE),
    UNIT_KILOCALORIE: "ккал",
    TIMES: "підходи по",
    REPS: "повторень",
    UNIT_MINUTES: COMMON_TEXTS.UNIT_MINUTES,
    UNIT_SECONDS: COMMON_TEXTS.UNIT_SECONDS,
    REST: "Відпочинок",
  },
  WORKOUT_PLAN_FORM: {
    Z_TEXT:
      "Опишіть ваш інвентар (напр., 'лише власна вага', 'гантелі 5кг, фітнес-гумка').",
    Z_DURATION: "Тривалість має бути не менше 15 хвилин.",
    TOAST_SUCCESS: "План тренувань успішно згенеровано!",
    TITLE: "Створити новий план тренувань",
    GENERATE_PLAN: "Згенерувати план",
  },
};
