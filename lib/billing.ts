"use server";
import { createClient } from "@/lib/supabase/server";
import { Supabase } from "@/types";
export async function getAuthUserOrError() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) throw new Error("Ви не авторизовані");
  return { supabase: await supabase, user };
}

export async function checkPremiumStatus(user_id: string, supabase: Supabase) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("premium_expires_at")
    .eq("id", user_id)
    .single();

  if (error) {
    throw new Error("Не вдалося перевірити статус підписки.");
  }

  // Перевіряємо, чи підписка існує і чи вона ще не вичерпана
  if (
    !profile?.premium_expires_at ||
    new Date(profile.premium_expires_at) < new Date()
  ) {
    throw new Error("Ваша підписка вичерпана. Будь ласка, оновіть її.");
  }
}

export async function checkCreditsAndDeduct(
  user_id: string,
  cost: number,
  supabase: Supabase
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("ai_credits_left")
    .eq("id", user_id)
    .single();

  if (error) {
    throw new Error("Не вдалося перевірити кількість токенів.");
  }

  if ((profile?.ai_credits_left || 0) < cost) {
    throw new Error(
      `Недостатньо токенів. Потрібно: ${cost}, доступно: ${
        profile?.ai_credits_left || 0
      }.`
    );
  }

  const newCredits = (profile?.ai_credits_left || 0) - cost;
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ ai_credits_left: newCredits })
    .eq("id", user_id);

  if (updateError) {
    throw new Error("Не вдалося оновити кількість токенів.");
  }
}
