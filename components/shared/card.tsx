import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`relative bg-white shadow-md rounded-lg p-6 overflow-hidden ${className}`}
      onClick={onClick}
    >
      <div
        className="absolute top-0 right-0 size-32 bg-green-50 rounded-bl-full"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 size-24 bg-yellow-50 rounded-tr-full"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
