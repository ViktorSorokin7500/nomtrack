import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  iconColor: string;
  iconTextColor: string;
  iconPath: string;
}

export function FeatureCard({
  title,
  description,
  iconColor,
  iconTextColor,
  iconPath,
}: FeatureCardProps) {
  return (
    <div className="feature-card bg-stone-50 rounded-2xl p-6 shadow-sm transition duration-300 hover:-translate-y-2">
      <div
        className={`size-14 ${iconColor} opacity-80 shadow-lg rounded-full flex items-center justify-center mb-5`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`size-6 ${iconTextColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={iconPath}
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
