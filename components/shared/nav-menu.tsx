import React from "react";
// import { LangSwitcher } from "./lang-switcher";
import { Locale } from "@/i18n.config";
import { Dropdown } from "../ui";

export default function NavMenu({ lang }: { lang: Locale }) {
  return (
    <div className="flex items-center gap-2">
      {/* <LangSwitcher
        lang={lang}
        title="language"
        className="hover:text-orange-400"
      /> */}
      <Dropdown.Menu>
        <Dropdown.Trigger className="cursor-pointer">
          <span className="text-stone-700 hover:text-orange-500">Меню</span>
        </Dropdown.Trigger>
        <Dropdown.Content className="scale-115">
          <Dropdown.Item href={`/${lang}/dashboard`}>
            Особистий кабінет
          </Dropdown.Item>
          <Dropdown.Item href={`/${lang}/settings`}>Налаштування</Dropdown.Item>
          <Dropdown.Item href={`/${lang}/archive`}>Історія </Dropdown.Item>
          <Dropdown.Item href={`/${lang}/recipes`}>Мої рецепти</Dropdown.Item>
          <Dropdown.Item href={`/${lang}/help`}>Допомога</Dropdown.Item>
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
      {/* <form action="/auth/sign-out" method="post">
        <Button type="submit">Вийти</Button>
      </form> */}
    </div>
  );
}
