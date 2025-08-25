import React from "react";
import { FeatureCard } from "./feature-card";

const features = [
  {
    title: "Відстежуйте калорії та макроси",
    description:
      "Автоматично реєструйте та аналізуйте щоденне споживання білків, жирів і вуглеводів.",
    iconColor: "bg-orange-200",
    iconTextColor: "text-orange-400",
    iconPath:
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Підбір страв на основі ШІ",
    description:
      "Дозвольте нашому розумному помічнику генерувати страви на основі ваших цілей, дієтичних уподобань і доступних інгредієнтів",
    iconColor: "bg-lime-200",
    iconTextColor: "text-green-400",
    iconPath:
      "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    title: "Візуалізуйте свій прогрес",
    description:
      "Наочні графіки показують, як змінюється ваш раціон і де потрібно внести корективи.",
    iconColor: "bg-yellow-200",
    iconTextColor: "text-yellow-600",
    iconPath:
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Встановлюйте цілі та зберігайте мотивацію",
    description:
      "Незалежно від того, чи хочете ви схуднути, набрати м'язову масу, чи просто харчуватися здоровіше, NomTrack допоможе вам не збитися зі шляху.",
    iconColor: "bg-pink-200",
    iconTextColor: "text-orange-400",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "База даних більше ніж 160'000 продуктів",
    description: "Записуйте свої страви за лічені секунди.",
    iconColor: "bg-sky-200",
    iconTextColor: "text-green-400",
    iconPath:
      "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Синхронізація між пристроями",
    description:
      "Ваші дані завжди з вами — на мобільному, планшеті чи комп'ютері.",
    iconColor: "bg-green-200",
    iconTextColor: "text-yellow-600",
    iconPath:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

export function FeatureSection() {
  return (
    <section className="bg-orange-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          ✨ Наші можливості
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
          NomTrack поєднує в собі потужний трекінг і ШІ-помічника, щоб допомогти
          вам досягти ваших цілей у харчуванні.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
              iconTextColor={feature.iconTextColor}
              iconPath={feature.iconPath}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
