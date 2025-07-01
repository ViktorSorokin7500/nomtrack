import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  // Перевіряємо, чи є користувач, і виходимо
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (session) {
    await (await supabase).auth.signOut();
    revalidatePath("/", "layout"); // Оновлюємо кеш для всього сайту
  }

  // Перенаправляємо користувача на головну сторінку
  return NextResponse.redirect(new URL("/", req.url), {
    status: 302,
  });
}
