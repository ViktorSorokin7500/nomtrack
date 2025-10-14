import { Button } from "@/components/ui";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";

export default async function PricingPage() {
  const planData = {
    id: "month",
    name: "NomTrack",
    price: 50,
    description:
      "Повний набір інструментів для досягнення ваших цілей у харчуванні та оздоровленні.",
    items: [
      "500 токенів для запитів",
      "Персональний ШІ-коуч для інсайтів і порад",
      "Розширені звіти про прогрес та аналітика",
      "Аналіз рецептів та персональна база даних",
      "Відстеження споживання води та активності",
      "Досвід без жодної реклами",
    ],
    paymentLink: "/sign-up",
    cta: "Перейти до оплати",
    month: "місяць",
  };
  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 sm:py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Один план. Усі можливості.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Спробуйте всі функції NomTrack. Скасуйте підписку в будь-який час.
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

        {/* Price display */}
        <div className="my-4">
          <div className="flex items-end gap-2">
            <p className="text-5xl tracking-tight font-extrabold text-gray-900">
              ₴{price}
            </p>
            <p className="text-gray-500">/ {month}</p>
          </div>
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
