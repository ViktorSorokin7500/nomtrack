import { Locale } from "@/i18n.config";
import NavMenu from "./nav-menu";
import { NavLink } from "./nav-link";
import { createClient } from "@/lib/supabase/server";
import { PremiumCountdown } from "./premium-countdown";

export async function Header({ lang }: { lang: Locale }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  const { data: profile } = await (await supabase)
    .from("profiles")
    .select("premium_expires_at, ai_credits_left")
    .eq("id", user?.id)
    .single();

  const premiumExpiresAt = profile?.premium_expires_at || null;
  const aiCreditsLeft = profile?.ai_credits_left || 0;

  return (
    <header>
      {user && <PremiumCountdown expiresAt={premiumExpiresAt} />}
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
              NomTrack
            </span>
            <span className="sm:hidden font-extrabold lg:text-xl text-gray-900">
              NT
            </span>
          </NavLink>
        </div>

        {user ? (
          <>
            <NavMenu lang={lang} aiCreditsLeft={aiCreditsLeft} />
          </>
        ) : (
          <>
            <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
              <NavLink href={`/${lang}#pricing`}>Тарифи</NavLink>
            </div>

            <div className="flex lg:justify-end lg:flex-1">
              <div className="flex items-center gap-1">
                {/* <LangSwitcher
                  lang={lang}
                  title="language"
                  className="hover:text-orange-400"
                /> */}
                <NavLink
                  href={`/${lang}/sign-in`}
                  className="border border-orange-300 bg-orange-300 hover:bg-orange-400 text-white hover:text-gray-100 px-3 py-1 rounded-full"
                >
                  Увійти
                </NavLink>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
