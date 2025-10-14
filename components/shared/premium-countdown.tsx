"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // <-- ІМПОРТ КОМПОНЕНТА Link
import { Gem } from "lucide-react";
import { SHARED_TEXTS } from "./(texts)/shared-text";

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
        setTimeLeft(SHARED_TEXTS.PREMIUM.TIME_OUT);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      let formattedTime = "";
      if (days > 0) {
        formattedTime = `${days} ${SHARED_TEXTS.PREMIUM.DAYS} ${hours} ${SHARED_TEXTS.PREMIUM.HOURS}`;
      } else if (hours > 0) {
        formattedTime = `${hours} ${SHARED_TEXTS.PREMIUM.HOURS} ${minutes} ${SHARED_TEXTS.PREMIUM.MINUTES}`;
      } else if (minutes > 0) {
        formattedTime = `${minutes} ${SHARED_TEXTS.PREMIUM.MINUTES}`;
      } else {
        formattedTime = SHARED_TEXTS.PREMIUM.LESS_THAN_MINUTE;
      }

      setTimeLeft(formattedTime);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000);
    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const expiryDate = expiresAt ? new Date(expiresAt) : null;
  const now = new Date();
  const daysRemaining = expiryDate
    ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (daysRemaining === null || daysRemaining > 5) {
    return null;
  }

  const isExpired = timeLeft === SHARED_TEXTS.PREMIUM.TIME_OUT;

  return (
    <div className="flex justify-center items-center gap-1 text-sm text-yellow-600 font-semibold bg-yellow-100 px-3 py-1 rounded-full">
      <Gem size={4} />
      {isExpired ? (
        <span>
          {SHARED_TEXTS.PREMIUM.PREMIUM_EXPIRED}{" "}
          <Link
            href="/pricing"
            className="underline text-blue-400 hover:text-sky-600"
          >
            {SHARED_TEXTS.PREMIUM.RENEW}
          </Link>
          , {SHARED_TEXTS.PREMIUM.RENEWAL_PROMPT}
        </span>
      ) : (
        <span>
          {SHARED_TEXTS.PREMIUM.PREMIUM_EXPIRES_IN} {timeLeft}
        </span>
      )}
    </div>
  );
}
