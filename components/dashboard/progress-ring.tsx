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
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 314
  const progress = current / target;
  const dashOffset = circumference * (1 - progress);

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
          className="text-orange-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-stone-900">
          {current.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">
          / {target.toLocaleString()} cal
        </span>
      </div>
    </div>
  );
}
