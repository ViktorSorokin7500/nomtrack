import { COMMON_TEXTS } from "./app-texts";

export const ERROR_PAGES_TEXTS = {
  AUTH: {
    TITLE: "Помилка автентифікації",
    DESCRITPTION:
      "Виникла проблема під час входу. Можливо, термін дії коду закінчився. Будь ласка, спробуйте увійти ще раз.",
    BUTTON: "Повернутися до входу",
  },
  NOT_FOUND: {
    TITLE: "Сторінку не знайдено",
    DESCRIPTION: "На жаль, ми не можемо знайти сторінку за цією адресою.",
    BUTTON: COMMON_TEXTS.RETURN_HOME,
  },
  GLOBAL_ERROR: {
    TITLE: "Непередбачена помилка",
    DESCIPTION:
      "На жаль, на сервері сталася критична помилка. Будь ласка, спробуйте перезавантажити сторінку або повернутися пізніше.",
    BUTTON_RETRY: "Спробувати ще раз",
    BUTTON_RETURN_HOME: COMMON_TEXTS.RETURN_HOME,
    ERROR_DETAILS: "Деталі помилки:",
  },
};
