import React from "react";

// 1. All card data is defined in one place, now in English.
const cardData = [
  {
    title: "Calories",
    description:
      "The energy that fuels your day. We help you find the right balance for your personal goals.",
    bgColor: "bg-orange-200",
    bgBackColor: "bg-orange-300",
    textColor: "text-gray-800",
    mobilePillColor: "bg-orange-200 text-orange-600",
  },
  {
    title: "Protein",
    description:
      "Essential building blocks for muscle and tissue. Crucial for recovery, strength, and feeling full.",
    bgColor: "bg-green-200",
    bgBackColor: "bg-green-300",
    textColor: "text-gray-800",
    mobilePillColor: "bg-green-200 text-green-600",
  },
  {
    title: "Carbs",
    description:
      "Your body's primary fuel source. Choose complex carbs for sustained, clean energy throughout the day.",
    bgColor: "bg-yellow-200",
    bgBackColor: "bg-yellow-300",
    textColor: "text-gray-800",
    mobilePillColor: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Fats",
    description:
      "Vital for hormone production, brain health, and absorbing vitamins. Healthy fats are your friend.",
    bgColor: "bg-white",
    bgBackColor: "bg-stone-100",
    textColor: "text-gray-800",
    mobilePillColor: "bg-white text-stone-500",
  },
];

function FlipCard({
  bgColor,
  bgBackColor,
  title,
  description,
  textColor,
}: {
  bgColor: string;
  bgBackColor: string;
  title: string;
  description: string;
  textColor: string;
}) {
  return (
    // 2. Added a hover:scale effect for better interactivity.
    <div className="relative max-w-60 aspect-square rounded-2xl group perspective cursor-pointer transition-transform duration-300 hover:!scale-105">
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-2xl shadow-md ${bgColor} text-2xl font-bold ${textColor} transition-transform duration-1000 group-hover:rotate-y-180 backface-hidden`}
      >
        {title}
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center text-center p-4 rounded-2xl shadow-lg ${bgBackColor} text-lg font-medium ${textColor} transition-transform duration-1000 rotate-y-180 backface-hidden group-hover:rotate-y-0`}
      >
        {description}
      </div>
    </div>
  );
}

export function PhilosophySection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="bg-green-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center">
        <div className="lg:w-1/2 mb-8 md:mb-0 md:pr-8">
          {/* 3. Updated title and paragraph with new English content. */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            🧠 Our Philosophy: Awareness Over Restriction
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We believe nutrition tracking should be empowering, not
            overwhelming. NomTrack is built on a foundation of minimalist design
            and core nutritional principles to bring clarity and awareness to
            your eating habits, helping you build a healthier relationship with
            food.
          </p>
          {/* 4. Mobile pills are now generated from the single cardData array. */}
          <div className="flex flex-wrap gap-3 lg:hidden">
            {cardData.map((card) => (
              <div
                key={card.title}
                className={`px-4 py-2 rounded-full font-medium ${card.mobilePillColor}`}
              >
                {card.title}
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:w-1/2 lg:grid grid-cols-2 gap-4">
          {cardData.map((card) => (
            <FlipCard
              key={card.title}
              bgColor={card.bgColor}
              bgBackColor={card.bgBackColor}
              title={card.title}
              description={card.description}
              textColor={card.textColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
