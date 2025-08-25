"use client";
import { Locale } from "@/i18n.config";
import { Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LangSwitcherProps {
  lang: Locale;
  title: string;
  className?: string;
}

export const LangSwitcher = ({ lang, title, className }: LangSwitcherProps) => {
  const targetLanguage = lang === "uk" ? "uk" : "uk";
  const pathname = usePathname();
  const redirectTarget = () => {
    if (!pathname) return "/";
    const segment = pathname.split("/");
    segment[1] = targetLanguage;
    return segment.join("/");
  };
  return (
    <Link href={redirectTarget()} className={className} title={title}>
      <div className="flex items-center gap-1">
        <Languages size={20} />
      </div>
    </Link>
  );
};
