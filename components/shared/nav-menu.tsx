import React from "react";
import { Dropdown } from "../ui";
import { Coins } from "lucide-react";

export default function NavMenu({ aiCreditsLeft }: { aiCreditsLeft: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-green-600">
        <Coins className="size-5" />
        <strong>{aiCreditsLeft}</strong>
      </div>
      <Dropdown.Menu>
        <Dropdown.Trigger className="cursor-pointer">
          <span className="text-stone-700 hover:text-orange-500">Меню</span>
        </Dropdown.Trigger>
        <Dropdown.Content className="scale-115">
          <Dropdown.Item href="/dashboard">Особистий кабінет</Dropdown.Item>
          <Dropdown.Item href="/settings">Налаштування</Dropdown.Item>
          <Dropdown.Item href="/archive">Історія </Dropdown.Item>
          <Dropdown.Item href="/recipes">Мої рецепти</Dropdown.Item>
          <Dropdown.Item href="/coach">Мої тренування</Dropdown.Item>
          <Dropdown.Separator />
          <div className="text-sm py-1 px-2">
            <form action="/auth/sign-out" method="POST">
              <button
                className="cursor-pointer hover:text-red-500 transition-colors delay-75"
                type="submit"
              >
                Вийти
              </button>
            </form>
          </div>
        </Dropdown.Content>
      </Dropdown.Menu>
    </div>
  );
}
