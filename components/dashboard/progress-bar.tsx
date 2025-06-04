interface ProgressBarProps {
  current: number;
  target: number;
  color: string;
}

export function ProgressBar({ current, target, color }: ProgressBarProps) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
