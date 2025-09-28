import React from "react";
import { Button } from "../ui";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* 1. Новий, особистий заголовок */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Готовий до справжніх змін? Я теж.
        </h2>
        {/* 2. Текст, що розповідає вашу історію */}
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          NomTrack: створений мною для мене. Цей помічник еволюціонує з кожною
          моєю новою забаганкою. І так, він стає все потужнішим, бо його
          головний користувач — той ще епікуреєць у світі ефективності. Завжди
          хочеться смачніше й швидше!
        </p>
        {/* 3. Одна, чітка кнопка дії */}
        <div className="flex justify-center">
          <Button
            asChild
            className="px-8 py-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            {/* Посилання веде на сторінку реєстрації для тріалу */}
            <Link href="/sign-in">Почати безкоштовний пробний період</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
