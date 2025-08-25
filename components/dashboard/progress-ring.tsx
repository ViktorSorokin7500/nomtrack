"use client";

import { useState } from "react";

interface ProgressRingProps {
  current: number;
  target: number;
  className?: string;
}

export function ProgressRing({
  current,
  target,
  className = "",
}: ProgressRingProps) {
  const [isHovered, setIsHovered] = useState(false); // <-- НОВЕ: Стан для відстеження наведення

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // 1. Розраховуємо фактичний прогрес (може бути > 1)
  const progress = target > 0 ? current / target : 0;

  // 2. Обмежуємо ВІЗУАЛЬНИЙ прогрес максимумом в 1 (100%)
  const clampedProgress = Math.min(progress, 1);

  // 3. Розраховуємо зсув на основі обмеженого значення
  const dashOffset = circumference * (1 - clampedProgress);

  // 4. (Покращення UX) Визначаємо колір залежно від прогресу
  const ringColor = progress > 1 ? "text-red-400" : "text-orange-200";

  // 5. Розраховуємо відсоток і округлюємо його
  const percentage = Math.round(progress * 100);

  return (
    <div className={`relative size-30 ${className}`}>
      <svg className="progressRing" width="120" height="120">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          // 6. Застосовуємо динамічний колір та анімацію
          className={`${ringColor} transition-colors duration-500`}
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer" // <-- НОВЕ: Додаємо курсор
        onMouseEnter={() => setIsHovered(true)} // <-- НОВЕ: Встановлюємо стан при наведенні
        onMouseLeave={() => setIsHovered(false)} // <-- НОВЕ: Скидаємо стан
      >
        {isHovered ? (
          <span className="text-2xl font-semibold text-stone-900">
            {percentage}%
          </span>
        ) : (
          <>
            <span className="text-2xl font-semibold text-stone-900">
              {current.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              / {target.toLocaleString()} ккал
            </span>
          </>
        )}
      </div>
    </div>
  );
}
