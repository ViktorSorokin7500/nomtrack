// nt/app/(root)/(pages)/(footer)/pricing/page.tsx - ОНОВЛЕНИЙ ФАЙЛ
import { FOOTER_TEXTS } from "@/components/shared/(texts)/footer-texts";
import { Button } from "@/components/ui";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";

export default async function PricingPage() {
  const planData = {
    id: "month",
    name: FOOTER_TEXTS.PRICING_PAGE.CARD.NAME,
    price: FOOTER_TEXTS.PRICING_PAGE.CARD.PRICE,
    description: FOOTER_TEXTS.PRICING_PAGE.CARD.DESCRIPTION,
    items: FOOTER_TEXTS.PRICING_PAGE.CARD.ITEMS,
    paymentLink: "/sign-up",
    cta: FOOTER_TEXTS.PRICING_PAGE.CARD.CTA,
    month: FOOTER_TEXTS.PRICING_PAGE.CARD.MONTH,
  };
  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 sm:py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {FOOTER_TEXTS.PRICING_PAGE.TITLE}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {FOOTER_TEXTS.PRICING_PAGE.DESCRIPTION}
          </p>
        </div>
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
  description,
  items,
  paymentLink,
  cta,
  month,
}: {
  name: string;
  price: number;
  description: string;
  items: string[];
  paymentLink: string;
  cta: string;
  month: string;
}) => {
  return (
    <div className="relative w-full max-w-md bg-white">
      <div className="relative flex flex-col h-full gap-5 p-8 border-2 border-orange-400 rounded-2xl shadow-lg">
        <div className="flex-grow">
          <h5 className="text-lg lg:text-xl font-bold text-gray-800">{name}</h5>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        <div className="my-4">
          <div className="flex items-end gap-2">
            <p className="text-5xl tracking-tight font-extrabold text-gray-900">
              ₴{price}
            </p>

            <p className="text-gray-500">/ {month}</p>
          </div>
        </div>
        <ul className="space-y-3 leading-relaxed text-base flex-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckIcon size={18} className="text-orange-500" />

              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-6">
          <Link
            href={paymentLink}
            className="w-full -lg flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 shadow-md"
          >
            {cta} <ArrowRight size={18} />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Ок. Ми дішли до секції Ціна. Що зробити з оплатою? Як реалізувати? Треба замінити "paymentLink". Які є можливості для реалізації оплати? Дай декілька вариантів, без коду, просто спілкуємось!!!
