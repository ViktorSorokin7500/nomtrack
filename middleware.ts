import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { i18n, Locale } from "./i18n.config";

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  console.log("Pathname:", pathname);

  // Проверяем, есть ли локаль в URL
  const currentLocale = i18n.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  console.log("Current locale from URL:", currentLocale);

  // Если локаль найдена в URL, используем её
  if (currentLocale) return currentLocale;

  // Если локали в URL нет, определяем по заголовкам
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  console.log("Browser languages:", languages);
  const locales: string[] = [...i18n.locales];
  return (
    matchLocale(languages, locales, i18n.defaultLocale) || i18n.defaultLocale
  );
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId } = await auth();
  const pathname = request.nextUrl.pathname;

  // Пропускаем API-запросы
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Пропускаем /sign-in и /sign-up (включая локализованные версии)
  const isAuthPath = i18n.locales.some(
    (locale) =>
      pathname === `/${locale}/sign-in` || pathname === `/${locale}/sign-up`
  );
  if (isAuthPath) {
    return NextResponse.next();
  }

  // Обрабатываем пути без локали или с "/undefined"
  const hasLocalePrefix = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (!hasLocalePrefix || pathname.startsWith("/undefined")) {
    const locale = getLocale(request);
    const safeLocale = i18n.locales.includes(locale as Locale)
      ? locale
      : i18n.defaultLocale;
    const cleanPath = pathname.replace(/^\/undefined/, "");
    const redirectUrl = new URL(
      `/${safeLocale}${cleanPath === "" ? "/" : cleanPath}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Редирект на dashboard для авторизованных пользователей
  if (
    userId &&
    (pathname === "/" ||
      i18n.locales.some((locale) => pathname === `/${locale}`))
  ) {
    const locale = getLocale(request);
    const safeLocale = i18n.locales.includes(locale as Locale)
      ? locale
      : i18n.defaultLocale;
    const redirectUrl = new URL(`/${safeLocale}/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Пропускаем статические файлы без добавления локали
  const skipLocalePaths = ["/sitemap.xml", "/robots.txt", "/ads.txt"];
  const isSkipPath = skipLocalePaths.some((skipPath) => pathname === skipPath);

  if (isSkipPath) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
