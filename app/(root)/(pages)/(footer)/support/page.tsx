import React from "react";
import { Card } from "@/components/shared";
import { Rocket, HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <section className="bg-orange-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Моя історія</h1>
        <p className="text-center text-gray-600 mb-12">
          Цей проект створений, щоб допомагати. Ось чому це важливо.
        </p>

        <Card>
          <div className="text-center space-y-4 pb-4">
            <HeartHandshake size={64} className="text-orange-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">
              Шлях до NomTrack
            </h2>
            <p className="text-gray-600 text-left">
              Моя історія почалася в Луганську, де я втратив усе своє майно та
              роботу після 2014 року. Коли я тільки почав приходити до тями, у
              2022 році я втратив і бізнес, адже послуги з працевлаштування за
              кордоном стали неактуальними. Я переїхав в село, почав займатися
              городом, щоб прогодувати себе, і водночас заглибився у світ IT.
            </p>
            <p className="text-gray-600 text-left">
              Саме тоді я виявив у себе проблеми із зайвою вагою, але не міг
              зрозуміти причину. Вивчивши основи збалансованого харчування, я
              вирішив створити зручний калькулятор калорій. Так народився
              NomTrack — інструмент, який я робив для себе, як користувач,
              враховуючи всі нюанси та потреби.
            </p>
          </div>

          <div className="text-center space-y-4 pt-8 border-t border-gray-200">
            <Rocket size={64} className="text-orange-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">
              Підтримайте розвиток
            </h2>
            <p className="text-gray-600">
              NomTrack — це мій особистий проєкт, який я розвиваю самостійно.
              Якщо ви вірите в його цінність і хочете підтримати подальший
              розвиток нових функцій, таких як AI-коуч та детальніші звіти, ви
              можете придбати преміум-підписку.
            </p>
            <Link href="/pricing" passHref>
              <button className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                Перейти до оплати
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
