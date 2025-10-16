import React from "react";
import { Button } from "../ui";
import Link from "next/link";
import { HOME_TEXTS } from "./home-texts";

export function CtaSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {HOME_TEXTS.CTA_SECTION.TITLE}
        </h2>
        <div className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto space-y-2">
          <p>{HOME_TEXTS.CTA_SECTION.DESCRIPTION1}</p>
          <p>{HOME_TEXTS.CTA_SECTION.DESCRIPTION2}</p>
          <p>{HOME_TEXTS.CTA_SECTION.DESCRIPTION3}</p>
        </div>
        <div className="flex justify-center">
          <Button
            asChild
            className="px-4 sm:px-8 py-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            <Link href="/sign-in">{HOME_TEXTS.CTA_SECTION.BUTTON}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
