import { Locale } from "@/i18n.config";
import { ArrowRight, CheckIcon, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

// 1. A single plan object with all copy in English.
const planData = {
  id: "pro",
  name: "NomTrack Pro",
  price: 7.99,
  specialPrice: 2.99, // The early-bird price
  trialDays: 7,
  description:
    "The complete toolkit to achieve your nutrition and wellness goals.",
  items: [
    "Personal AI Coach for insights & tips",
    "Advanced progress reports & analytics",
    "Recipe analysis from any URL",
    // "Custom nutrient goals (fiber, vitamins, etc.)",
    "Water and activity tracking",
    "A completely ad-free experience",
  ],
  paymentLink: "/sign-up", // Link to your sign-up page to start the trial
  cta: "Start Your 7-Day Free Trial",
  month: "month",
};

export function PricingSection({ lang }: { lang: Locale }) {
  // lang is available for future localization
  console.log(lang);

  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 sm:py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            One Plan. All Features.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Try every feature of NomTrack Pro. Cancel anytime.
          </p>
        </div>
        {/* 2. Centering the single pricing card. */}
        <div className="flex justify-center">
          <PricingCard {...planData} />
        </div>
      </div>
    </section>
  );
}

const PricingCard = ({
  name,
  price,
  specialPrice,
  description,
  items,
  paymentLink,
  cta,
  month,
  trialDays,
}: {
  name: string;
  price: number;
  specialPrice: number;
  description: string;
  items: string[];
  paymentLink: string;
  cta: string;
  month: string;
  trialDays: number;
}) => {
  return (
    <div className="relative w-full max-w-md bg-white">
      {/* 3. Early-bird offer badge. */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-full font-semibold text-sm shadow-lg">
          <Star size={16} className="fill-white" />
          <span>Early Bird Offer</span>
        </div>
      </div>
      <div className="relative flex flex-col h-full gap-5 p-8 border-2 border-orange-400 rounded-2xl shadow-lg">
        <div className="flex-grow">
          <h5 className="text-lg lg:text-xl font-bold text-gray-800">{name}</h5>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>

        {/* Price display */}
        <div className="my-4">
          <div className="flex items-end gap-2">
            <p className="text-5xl tracking-tight font-extrabold text-gray-900">
              ${specialPrice}
            </p>
            <p className="text-2xl font-bold text-gray-400 line-through">
              ${price}
            </p>
            <p className="text-gray-500">/ {month}</p>
          </div>
          <p className="text-sm text-orange-600 font-semibold mt-2">
            Price locked in forever for the first 200 users.
          </p>
        </div>

        {/* Features list */}
        <ul className="space-y-3 leading-relaxed text-base flex-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckIcon size={18} className="text-orange-500" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        {/* Call to action */}
        <div className="mt-6">
          <Link
            href={paymentLink}
            className="w-full rounded-lg flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 shadow-md"
          >
            {cta} <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-gray-500 text-center mt-3">
            First {trialDays} days free, then the special price applies.
          </p>
        </div>
      </div>
    </div>
  );
};
