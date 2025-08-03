import { Locale } from "@/i18n.config";
import React from "react";
import { Button } from "../ui";
import Link from "next/link";

export function CtaSection({ lang }: { lang: Locale }) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* 1. Новий, особистий заголовок */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready for a real change? So am I.
        </h2>
        {/* 2. Текст, що розповідає вашу історію */}
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          I built NomTrack because I was tired of complicated and clunky
          trackers. As someone on my own journey to a healthier body, I wanted a
          simple tool that actually helps, not hinders.
          <br />
          <br />
          That’s why this app is more than just a business. It&apos;s my daily
          companion, one that I continuously improve based on real-world
          experience. It evolves with me and the needs of our community.
        </p>
        {/* 3. Одна, чітка кнопка дії */}
        <div className="flex justify-center">
          <Button
            asChild
            className="px-8 py-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            {/* Посилання веде на сторінку реєстрації для тріалу */}
            <Link href={`/${lang}/sign-in`}>Start Your Free Trial</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
