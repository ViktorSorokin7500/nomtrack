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
  const targetLanguage = lang === "en" ? "uk" : "en";
  const pathname = usePathname();
  const redirectTarget = () => {
    if (!pathname) return "/";
    const segment = pathname.split("/");
    segment[1] = targetLanguage;
    return segment.join("/");
  };
  return (
    <Link href={redirectTarget()} className={className} title={title}>
      <Languages size={20} />
    </Link>
  );
};
