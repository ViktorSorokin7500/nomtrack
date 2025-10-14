"use client";

import { useState } from "react";

interface ProgressRingProps {
  current: number;
  target: number;
  label: string;
  color: string;
  scolor: string;
}

export function ProgressRingArchive({
  current,
  target,
  label,
  color,
  scolor,
}: ProgressRingProps) {
  const [isHovered, setIsHovered] = useState(false);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const progress = target > 0 ? current / target : 0;

  const clampedProgress = Math.min(progress, 1);

  const dashOffset = circumference * (1 - clampedProgress);

  const ringColor = progress > 1 ? scolor : color;

  const percentage = Math.round(progress * 100);

  return (
    <div>
      <span className="text-stone-500 font-bold">{label}</span>
      <div className="relative size-30">
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
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? (
            <span className="text-2xl font-semibold text-stone-900">
              {percentage}%
            </span>
          ) : (
            <>
              <span className="text-2xl font-semibold text-stone-900">
                {current.toLocaleString("uk-UA")}
              </span>
              <span className="text-sm text-gray-500">
                / {target.toLocaleString("uk-UA")}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
