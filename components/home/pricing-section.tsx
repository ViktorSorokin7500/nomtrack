import { Locale } from "@/i18n.config";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MotionH2, MotionSection } from "../shared/motion-wrapper";
import { containerVariants, itemVariants } from "@/lib/constants";

export function PricingSection({ lang }: { lang: Locale }) {
  const plans = [
    {
      id: "free",
      name: "name",
      price: 0,
      description: "description",
      items: ["item1", "item2"],
      paymentLink: `${lang}/sign-in`,
      priceId: "",
      cta: "cta",
      month: "month",
      freeMonth: "tokens",
    },
    {
      id: "paid",
      name: "name",
      price: 7,
      description: "description",
      items: ["item1", "item2", "item3"],
      paymentLink: "",
      priceId: "",
      cta: "cta",
      month: "month",
    },
  ];
  return (
    <MotionSection
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="py-6 sm:py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex items-center justify-center w-full pb-12">
          <MotionH2
            variants={itemVariants}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="uppercase font-bold text-xl text-orange-400"
          >
            title
          </MotionH2>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  paymentLink,
  cta,
  month,
  freeMonth,
}: {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
  cta: string;
  month: string;
  freeMonth?: string;
}) => {
  return (
    <div className="relative w-full max-w-lg">
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-orange-100 rounded-2xl shadow-lg transition-transform duration-1000",
          id === "paid" && "border-orange-400 gap-5 border-2"
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <div>
            <h5 className="text-lg lg:text-xl font-bold">{name}</h5>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </div>

        {id === "free" ? (
          <p className="text-3xl tracking-tight uppercase font-bold">
            20000 {freeMonth}
          </p>
        ) : (
          <div className="flex gap-2">
            <p className="text-5xl tracking-tight font-extrabold">${price}</p>
            <div>
              <p className="text-xs uppercase font-semibold">USD</p>
              <p className="text-xs">/{month}</p>
            </div>
          </div>
        )}

        <ul className="space-y-2.5 leading-relaxed text-base flex-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2 flex justify-center w-full">
          <Link
            href={paymentLink}
            className="w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r text-white border-2 py-2 transition-colors duration-300 border-orange-100 from-red-200 to-orange-300 hover:from-orange-400 hover:to-red-300"
          >
            {cta} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
