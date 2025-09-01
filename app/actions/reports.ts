"use server";
import { AiReportData } from "@/components/archive/report-display";
import {
  checkCreditsAndDeduct,
  checkPremiumStatus,
  getAuthUserOrError,
} from "@/lib/billing";
import { AI_ANALYZE } from "@/lib/const";
import { promptWithMonthlyReport } from "@/lib/prompts";
import { getAiJsonResponse } from "@/lib/utils";
import { DailySummary, Profile } from "@/types";

export async function analyzeMonthlyData(
  daysData: DailySummary[],
  userProfile: Profile
) {
  const prompt = promptWithMonthlyReport(daysData, userProfile);
  const { supabase, user } = await getAuthUserOrError();

  try {
    await checkPremiumStatus(user.id, supabase);
    await checkCreditsAndDeduct(user.id, AI_ANALYZE, supabase);

    const { data: reportData, error } = await getAiJsonResponse<AiReportData>(
      prompt
    );

    if (error) {
      return { error: `Помилка аналізу ШІ: ${error}` };
    }

    // ЗМІНА: ПЕРЕВІРЯЄМО, ЧИ ДАНІ ПРИЙШЛИ
    if (!reportData) {
      return { error: "ШІ не повернув звіт." };
    }

    // ЗМІНА: ПОВЕРТАЄМО ПОВНИЙ ОБ'ЄКТ
    return { success: reportData };
  } catch (e) {
    console.error("Помилка в analyzeMonthlyData:", e);
    const errorMessage =
      e instanceof Error ? e.message : "Невідома помилка на сервері.";
    return { error: errorMessage };
  }
}
