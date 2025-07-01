import { Locale } from "@/i18n.config";
import { NavLink } from "./nav-link";
import { createClient } from "@/lib/supabase/server";
import { LangSwitcher } from "./lang-switcher";
import { Button } from "../ui";

// async function getDictionary(lang: Locale) {
//   const dictionary = await import(`@/dictionaries/${lang}.json`);
//   return dictionary.default;
// }

export async function Header({ lang }: { lang: Locale }) {
  // const dictionary = await getDictionary(lang);
  // const t = dictionary.header;

  const supabase = createClient();

  // Отримуємо дані про поточного користувача
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <header>
      <nav className="container flex items-center justify-between py-4 px-2 lg:px-8 mx-auto">
        <div className="flex lg:flex-1 group">
          <NavLink
            href={user ? `/${lang}/dashboard` : `/${lang}`}
            className="flex items-center gap-1 lg:gap-2 shrink-0"
          >
            <svg
              className="size-10 mr-2"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="18" fill="#FFB982"></circle>
              <path
                d="M14 20C14 17.2386 16.2386 15 19 15H21C23.7614 15 26 17.2386 26 20V25C26 27.7614 23.7614 30 21 30H19C16.2386 30 14 27.7614 14 25V20Z"
                fill="#B4E8C2"
              ></path>
              <circle cx="20" cy="12" r="4" fill="#FFE066"></circle>
            </svg>
            <span className="hidden sm:block font-extrabold lg:text-xl text-gray-900">
              Nom Track
            </span>
            <span className="sm:hidden font-extrabold lg:text-xl text-gray-900">
              NT
            </span>
          </NavLink>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <LangSwitcher
              lang={lang}
              title="language"
              className="hover:text-orange-400"
            />
            <form action="/auth/sign-out" method="post">
              <Button type="submit">Вийти</Button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
              <NavLink href={`/${lang}#pricing`}>pricing</NavLink>
            </div>

            <div className="flex lg:justify-end lg:flex-1">
              <div className="flex items-center gap-1">
                <LangSwitcher
                  lang={lang}
                  title="language"
                  className="hover:text-orange-400"
                />
                <NavLink
                  href={`/${lang}/sign-in`}
                  className="border border-orange-300 bg-orange-300 hover:bg-orange-400 text-white hover:text-gray-100 px-3 py-1 rounded-full"
                >
                  Sign In
                </NavLink>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
