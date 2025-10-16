import "@/utils/stringExtensions";
import { COMMON_TEXTS } from "./app-texts";

export const SHARED_TEXTS = {
  FOOTER: {
    TELEGRAM: "Телеграм",
    INSTAGRAM: "Інстаграм",
    YOUTUBE: "Youtube",
    PRODUCT: "Продукт",
    UPDATES: "Оновлення",
    PRICING: "Тарифи",
    RESOURCES: "Ресурси",
    SUPPORT: "Підтримка",
    SITEMAP: "Карта сайту",
    LEGAL: "Юридична інформація",
    PRIVACY: "Політика конфіденційності",
    TERMS: "Умови надання послуг",
    NOMTRACK: COMMON_TEXTS.NOMTRACK,
    ALL_RIGHTS_RESERVED: "Всі права захищені",
  },
  HEADER: {
    NOMTRACK: COMMON_TEXTS.NOMTRACK,
    NOMTRACK_SHORT: "NT",
    PRICING: "Тарифи",
    SIGN_IN: "Увійти",
  },
  COPY: {
    TOAST_SUCCESS: "Скопійовано!",
    TOAST_ERROR: "Не вдалося скопіювати пошту. Спробуйте вручну.",
    EMAIL: "viktoriosecret@gmail.com",
  },
  NAV_MENU: {
    MENU: "Меню",
    DASHBOARD: "Особистий кабінет",
    SETTINGS: "Налаштування",
    ARCHIVE: "Історія",
    RECIPES: "Мої рецепти",
    COACH: "Мої тренування",
    SIGN_OUT: "Вийти",
  },
  PREMIUM: {
    TIME_OUT: "Преміум вичерпано",
    DAYS: COMMON_TEXTS.DAYS.slice(0, 2),
    HOURS: COMMON_TEXTS.UNIT_HOURS,
    MINUTES: COMMON_TEXTS.UNIT_MINUTES,
    LESS_THAN_MINUTE: "Менше хвилини",
    PREMIUM_EXPIRED: "Ваша підписка вичерпана.",
    RENEWAL_PROMPT: "аби зберегти доступ до всіх функцій ШІ",
    RENEW: "Продовжити",
    PREMIUM_EXPIRES_IN: "До закінчення залишилось:",
  },
};
