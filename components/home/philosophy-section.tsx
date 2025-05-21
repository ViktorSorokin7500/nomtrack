import React from "react";

const cards = [
  {
    bgColor: "bg-orange-200",
    bgBackColor: "bg-orange-300",
    title: "Calories",
    description: "Calories",
    textColor: "text-gray-800",
  },
  {
    bgColor: "bg-green-200",
    bgBackColor: "bg-green-300",
    title: "Protein",
    description: "Protein",
    textColor: "text-gray-800",
  },
  {
    bgColor: "bg-yellow-400",
    bgBackColor: "bg-yellow-300",
    title: "Carbs",
    description: "Carbs",
    textColor: "text-gray-800",
  },
  {
    bgColor: "bg-white",
    bgBackColor: "bg-stone-100",
    title: "Fats",
    description: "Fats",
    textColor: "text-gray-800",
  },
];

interface FlipCardProps {
  bgColor: string;
  bgBackColor: string;
  title: string;
  description: string;
  textColor: string;
}

function FlipCard({
  bgColor,
  bgBackColor,
  title,
  description,
  textColor,
}: FlipCardProps) {
  return (
    <div className="relative max-w-60 aspect-square rounded-2xl group perspective cursor-pointer">
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-2xl shadow-md ${bgColor} text-2xl font-bold ${textColor} transition-transform duration-1000 group-hover:rotate-y-180 backface-hidden`}
      >
        {title}
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-2xl shadow-lg ${bgBackColor} text-2xl font-bold ${textColor} transition-transform duration-1000 rotate-y-180 backface-hidden group-hover:rotate-y-0`}
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
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            🧠 Built With Scandinavian Simplicity
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            NutriFlow combines minimalist design with uplifting summer colors
            for a calm and joyful user experience.
          </p>
          <div className="flex flex-wrap gap-3 md:hidden">
            <div className="px-4 py-2 bg-orange-200 rounded-full text-orange-400 font-medium">
              Calories
            </div>
            <div className="px-4 py-2 bg-green-200 rounded-full text-green-600 font-medium">
              Protein
            </div>
            <div className="px-4 py-2 bg-yellow-100 rounded-full text-yellow-600 font-medium">
              Carbs
            </div>
            <div className="px-4 py-2 bg-white rounded-full text-stone-500 font-medium">
              Fats
            </div>
          </div>
        </div>
        <div className="hidden md:w-1/2 xl:w-1/3 md:grid grid-cols-2 gap-4">
          {cards.map((card, index) => (
            <FlipCard
              key={index}
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
