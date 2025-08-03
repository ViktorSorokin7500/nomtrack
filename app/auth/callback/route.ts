import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  console.log("requestUrl => ", requestUrl);

  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Якщо сталася помилка обміну коду, перенаправляємо на сторінку з помилкою
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  // Якщо все успішно, перенаправляємо користувача на головну сторінку.
  // Наша middleware підхопить це і перенаправить на локалізований дашборд.
  return NextResponse.redirect(origin);
}
