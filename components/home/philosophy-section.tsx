import React from "react";

// 1. All card data is defined in one place, now in English.
const cardData = [
  {
    title: "Калорії",
    description:
      "Енергія, що живить ваш день. Nomtrack допоможе знайти правильний баланс для досягнення ваших цілей.",
    bgColor: "bg-orange-200",
    bgBackColor: "bg-orange-300",
    textColor: "text-gray-800",
    mobilePillColor: "bg-orange-200 text-orange-600",
  },
  {
    title: "Білки",
    description:
      "Основні будівельні блоки для м'язів і тканин. Важливі для відновлення, сили та відчуття ситості.",
    bgColor: "bg-green-200",
    bgBackColor: "bg-green-300",
    textColor: "text-gray-800",
    mobilePillColor: "bg-green-200 text-green-600",
  },
  {
    title: "Вуглеводи",
    description:
      "Головне джерело енергії для вашого тіла. Обирайте складні вуглеводи для стабільної, чистої енергії протягом дня.",
    bgColor: "bg-yellow-200",
    bgBackColor: "bg-yellow-300",
    textColor: "text-gray-800",
    mobilePillColor: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Жири",
    description:
      "Життєво важливі для вироблення гормонів, здоров'я мозку та засвоєння вітамінів. Здорові жири — ваші друзі.",
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
            🧠 Моя філософія: усвідомленість, а не обмеження
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Відстеження харчування має надавати сили, а не бути обтяжливим.
            NomTrack побудований на принципах мінімалістичного дизайну та
            ключових засадах дієтології, щоб внести ясність і усвідомленість у
            ваші харчові звички та допомогти вам побудувати здоровіші стосунки з
            їжею.
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
