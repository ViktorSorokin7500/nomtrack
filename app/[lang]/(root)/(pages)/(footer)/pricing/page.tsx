// app/(root)/(pages)/pricing/page.tsx

import { headers } from "next/headers";
import { Button } from "@/components/ui/button";

// Наша "податкова карта". В реальному проєкті її можна винести в окремий файл.
const vatRates: { [key: string]: number } = {
  // Європа
  DE: 0.19, // Німеччина
  FR: 0.2, // Франція
  IT: 0.22, // Італія
  CZ: 0.21, // Чехія
  UA: 0.2, // Україна
  GB: 0.2, // Англія
  // Інші
  CA: 0.05, // Канада (базова GST, може бути вище в деяких провінціях)
  IN: 0.18, // Індія
  // Для США податок складний, тому зазвичай його показує вже сама платіжна система.
  // Для всіх інших країн, де ми не знаємо податок, будемо рахувати 0%.
};

export default async function PricingPage() {
  // 1. Отримуємо країну користувача з заголовків запиту (це працює на Vercel)
  const headersList = headers();
  const countryCode = (await headersList).get("x-vercel-ip-country") || "US"; // За замовчуванням США

  // 2. Розраховуємо ціни
  const basePriceMonthly = 2.99;
  const basePriceYearly = 29.99; // Припустимо, річна ціна така

  const taxRate = vatRates[countryCode] || 0;

  const finalPriceMonthly = basePriceMonthly * (1 + taxRate);
  const finalPriceYearly = basePriceYearly * (1 + taxRate);

  // Функція для красивого форматування ціни
  const formatPrice = (price: number) => price.toFixed(2);

  return (
    <div className="container mx-auto max-w-4xl py-16 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Просте та прозоре ціноутворення
        </h1>
        <p className="text-lg text-gray-600">
          Обери план, який підходить саме тобі. Ніяких прихованих платежів.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Картка місячного плану */}
        <div className="border rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-4">Місяць</h3>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">
              ${formatPrice(finalPriceMonthly)}
            </span>
            <span className="text-gray-500"> / місяць</span>
          </div>
          <ul className="space-y-3 mb-8 text-gray-600 flex-grow">
            <li>✅ Усі базові функції</li>
            <li>✅ Необмежений аналіз через ШІ</li>
            <li>✅ Можливість скасувати будь-коли</li>
          </ul>
          <Button>Почати 7 днів безкоштовно</Button>
        </div>

        {/* Картка річного плану */}
        <div className="border-2 border-orange-500 rounded-lg p-6 flex flex-col relative">
          <div className="absolute top-0 -translate-y-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Найкраща пропозиція
          </div>
          <h3 className="text-xl font-bold mb-4">Рік</h3>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">
              ${formatPrice(finalPriceYearly)}
            </span>
            <span className="text-gray-500"> / рік</span>
          </div>
          <ul className="space-y-3 mb-8 text-gray-600 flex-grow">
            <li>✅ Усі переваги місячного плану</li>
            <li className="font-bold text-orange-600">
              ✅ Економія 17% (2 місяці в подарунок)
            </li>
          </ul>
          <Button>Почати 7 днів безкоштовно</Button>
        </div>
      </div>

      {taxRate > 0 && (
        <p className="text-center text-sm text-gray-500 mt-8">
          *Ціна для вашої країни ({countryCode}) включає ПДВ у розмірі{" "}
          {(taxRate * 100).toFixed(0)}%.
        </p>
      )}
    </div>
  );
}
