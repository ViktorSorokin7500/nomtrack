import { Locale } from "@/i18n.config";
import React from "react";
import { Button } from "../ui";
import Link from "next/link";

export function CtaSection({ lang }: { lang: Locale }) {
  return (
    <section className="bg-orange-100 bg-opacity-10 py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to transform your nutrition?
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Join thousands of users who have already improved their diet and
          reached their health goals with NutriFlow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            asChild
            className="px-8 py-6 rounded-full bg-orange-300 hover:bg-orange-400 text-white font-medium transition-all duration-300 hover:shadow-lg"
          >
            <Link href={`/${lang}/`}>Start Your Free Trial</Link>
          </Button>
          <Button
            asChild
            className="px-8 py-6 rounded-full border border-stone-900 font-medium bg-inherit hover:bg-stone-800 text-stone-700 hover:text-stone-100 transition-all duration-300 hover:shadow-lg"
          >
            <Link href={`/${lang}/`}>Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
