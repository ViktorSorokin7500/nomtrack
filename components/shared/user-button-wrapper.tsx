// components/shared/user-button-wrapper.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface UserButtonWrapperProps {
  lang: string;
}

export function UserButtonWrapper({ lang }: UserButtonWrapperProps) {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  // Устанавливаем isMounted в true только на клиенте
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Проверяем, находится ли пользователь на странице /settings
  const isSettingsPage = pathname.includes("/settings");

  // Если пользователь не загружен или компонент не смонтирован, показываем заглушку
  if (!isLoaded || !user || !isMounted) {
    return <div className="size-7 rounded-full bg-gray-200 animate-pulse" />;
  }

  // На странице /settings показываем UserButton
  if (isSettingsPage) {
    return (
      <div className="cursor-pointer">
        <UserButton
          appearance={{
            elements: {
              userButtonBox: "size-7",
              userButtonAvatar: "size-7",
            },
          }}
        />
      </div>
    );
  }

  // На остальных страницах показываем иконку настроек
  return (
    <div
      className="cursor-pointer text-stone-500 hover:text-stone-700 hover:rotate-22 transition-all duration-300"
      title="Settings"
    >
      <Link href={`/${lang}/settings`}>
        <svg
          className="size-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </Link>
    </div>
  );
}
