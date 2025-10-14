import { ArrowRight, CheckIcon, Star } from "lucide-react";
import Link from "next/link";
import React from "react";
import { HOME_TEXTS } from "./home-texts";

export function PricingSection() {
  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 sm:py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {HOME_TEXTS.PRICING_SECTION.TITLE}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {HOME_TEXTS.PRICING_SECTION.DESCRIPTION}
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md bg-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-full font-semibold text-sm shadow-lg">
                <Star size={16} className="fill-white" />
                <span> {HOME_TEXTS.PRICING_SECTION.FIRST_CLIENTS_OFFER}</span>
              </div>
            </div>
            <div className="relative flex flex-col h-full gap-5 p-6 border-2 border-orange-400 rounded-2xl shadow-lg">
              <div className="flex-grow">
                <h5 className="text-2xl font-bold text-gray-800">
                  {HOME_TEXTS.PRICING_SECTION.NAME}
                </h5>
                <p className="text-sm text-gray-600 mt-2">
                  {HOME_TEXTS.PRICING_SECTION.ABOUT}
                </p>
              </div>

              <div className="my-1">
                <div className="flex items-end gap-2">
                  <p className="text-5xl tracking-tight font-extrabold text-gray-900">
                    ₴50
                  </p>
                  <p className="text-2xl font-bold text-gray-400 line-through">
                    ₴199
                  </p>
                  <p className="text-gray-500">
                    / {HOME_TEXTS.PRICING_SECTION.MONTH}
                  </p>
                </div>
                <p className="text-sm text-orange-600 font-semibold mt-2">
                  {HOME_TEXTS.PRICING_SECTION.FIXED_PRICE}
                </p>
              </div>

              {/* Features list */}
              <ul className="space-y-2 leading-relaxed text-base flex-1">
                {HOME_TEXTS.PRICING_SECTION.ITEMS.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckIcon size={18} className="text-orange-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Call to action */}
              <div className="mt-2">
                <Link
                  href="/sign-up"
                  className="w-full rounded-lg flex items-center justify-center gap-2 px-6 py-2 text-lg font-semibold transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                >
                  {HOME_TEXTS.PRICING_SECTION.CTA} <ArrowRight size={18} />
                </Link>
                <p className="text-xs text-gray-500 text-center mt-3">
                  {HOME_TEXTS.PRICING_SECTION.TRIAL_PERIOD}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
