import React from "react";
import { Card } from "@/components/shared";
import Link from "next/link";
export const revalidate = 86400;

export default async function SitemapPage() {
  return (
    <section className="bg-orange-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Карта сайту</h1>
        <p className="text-center text-gray-600 mb-12">
          Детальний путівник по всіх можливостях NomTrack.
        </p>

        <Card>
          <div className="prose prose-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Публічні сторінки</h2>
            <ul className="list-disc list-inside space-y-4 mb-8">
              <li>
                <Link
                  href="/"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Головна сторінка
                </Link>
                <p className="text-gray-600">
                  Опис продукту, основні функції та переваги. Тут можна
                  дізнатися про філософію NomTrack та переглянути загальні
                  тарифи.
                </p>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Тарифи
                </Link>
                <p className="text-gray-600">
                  Детальна інформація про тарифи, що надає NomTrack, та переваги
                  преміум-підписки.
                </p>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Увійти
                </Link>
                <p className="text-gray-600">
                  Сторінка для входу в особистий кабінет. Підтримує вхід через
                  електронну пошту/пароль та Google.
                </p>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Зареєструватися
                </Link>
                <p className="text-gray-600">
                  Сторінка реєстрації нового користувача.
                </p>
              </li>
              <li>
                <Link
                  href="/updates"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Оновлення
                </Link>
                <p className="text-gray-600">
                  Дорожня карта розвитку проекту з переліком запланованих та
                  майбутніх функцій.
                </p>
              </li>
              <li>
                <Link
                  href="/privacy-security"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Політика конфіденційності
                </Link>
                <p className="text-gray-600">
                  Інформація про збір, використання та захист ваших персональних
                  даних.
                </p>
              </li>
              <li>
                <Link
                  href="/support"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Підтримка
                </Link>
                <p className="text-gray-600">
                  Контактна інформація та ресурси для допомоги.
                </p>
              </li>
              <li>
                <Link
                  href="/help"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Допомога
                </Link>
                <p className="text-gray-600">
                  Загальна інформація та умови надання послуг.
                </p>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              Для зареєстрованих користувачів
            </h2>
            <ul className="list-disc list-inside space-y-4">
              <li>
                <Link
                  href="/dashboard"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Особистий кабінет (Дашборд)
                </Link>
                <p className="text-gray-600">
                  Центр управління харчуванням та активністю. Тут можна
                  відстежувати калорії, білки, жири та вуглеводи, моніторити
                  споживання води та додавати фізичні активності.
                  <br />
                  <strong className="text-green-600">Інтеграції:</strong> Аналіз
                  страв та активності за допомогою ШІ (Together AI) та отримання
                  нутриційної інформації (CalorieNinjas).
                </p>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Налаштування
                </Link>
                <p className="text-gray-600">
                  Керування персональними даними, такими як вага, зріст, вік, а
                  також встановлення щоденних цілей по харчуванню (калорії,
                  макроелементи) та воді.
                </p>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Історія
                </Link>
                <p className="text-gray-600">
                  Перегляд минулих записів харчування та фізичних показників за
                  місяцями. Можливість згенерувати детальний звіт від ШІ за
                  обраний місяць.
                  <br />
                  <strong className="text-green-600">Інтеграції:</strong>{" "}
                  Генерація щомісячного звіту за допомогою ШІ (Together AI).
                </p>
              </li>
              <li>
                <Link
                  href="/recipes"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Мої рецепти
                </Link>
                <p className="text-gray-600">
                  Створення та збереження власних рецептів. Система автоматично
                  аналізує інгредієнти та розраховує харчову цінність на 100 г
                  страви.
                  <br />
                  <strong className="text-green-600">Інтеграції:</strong> Аналіз
                  інгредієнтів та розрахунок БЖВ за допомогою ШІ (Together AI)
                  та CalorieNinjas.
                </p>
              </li>
              <li>
                <Link
                  href="/coach"
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Мій трекер
                </Link>
                <p className="text-gray-600">
                  Персональний ШІ-коуч для створення тренувань та планів. Ви
                  можете створити разове тренування або згенерувати план на весь
                  тиждень, вказавши доступний інвентар.
                  <br />
                  <strong className="text-green-600">Інтеграції:</strong>{" "}
                  Генерація тренувань та планів за допомогою ШІ (Together AI).
                </p>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
}
