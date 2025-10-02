/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: "",
            expires: new Date(0),
            ...options,
          });
        },
      },
    }
  );

  // ⚡️ Миттєво вирішуємо, куди вести користувача
  if (req.nextUrl.pathname === "/") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard"; // змінити на ваш шлях після логіну
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/", "/login", "/signup"], // де ще треба швидкий редірект
};
