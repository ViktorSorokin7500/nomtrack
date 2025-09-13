"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // <-- ІМПОРТ КОМПОНЕНТА Link
import { IoDiamondOutline } from "react-icons/io5";

interface PremiumCountdownProps {
  expiresAt: string | null;
}

export function PremiumCountdown({ expiresAt }: PremiumCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(null);
      return;
    }

    const expiryDate = new Date(expiresAt);

    const updateCountdown = () => {
      const now = new Date();
      const difference = expiryDate.getTime() - now.getTime();

      // Якщо час вийшов
      if (difference <= 0) {
        setTimeLeft("Преміум вичерпано");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      let formattedTime = "";
      if (days > 0) {
        formattedTime = `${days} дн. ${hours} год.`;
      } else if (hours > 0) {
        formattedTime = `${hours} год. ${minutes} хв.`;
      } else if (minutes > 0) {
        formattedTime = `${minutes} хв.`;
      } else {
        formattedTime = "Менше хвилини";
      }

      setTimeLeft(formattedTime);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000); // Оновлюємо щохвилини

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const expiryDate = expiresAt ? new Date(expiresAt) : null;
  const now = new Date();
  const daysRemaining = expiryDate
    ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Компонент не відображається, якщо до закінчення більше 5 днів
  if (daysRemaining === null || daysRemaining > 5) {
    return null;
  }

  const isExpired = timeLeft === "Преміум вичерпано";

  return (
    <div className="flex justify-center items-center gap-1 text-sm text-yellow-600 font-semibold bg-yellow-100 px-3 py-1 rounded-full">
      <IoDiamondOutline className="size-4" />
      {/* Умовний рендеринг залежно від статусу */}
      {isExpired ? (
        <span>
          Ваша підписка вичерпана.{" "}
          <Link
            href="/pricing"
            className="underline text-blue-400 hover:text-sky-600"
          >
            Продовжіть
          </Link>
          , щоб отримати доступ до функцій ШІ.
        </span>
      ) : (
        <span>Залишилось: {timeLeft}</span>
      )}
    </div>
  );
}
