"use server";
import { AiReportData } from "@/components/archive/report-display";
import {
  checkCreditsAndDeduct,
  checkPremiumStatus,
  getAuthUserOrError,
} from "@/lib/billing";
import { AI_ANALYZE } from "@/lib/const";
import { promptWithMonthlyReport } from "@/lib/prompts";
import { getAiJsonResponse } from "@/lib/ai";
import { DailySummary, Profile } from "@/types";
import { ACTIONS_TEXTS } from "@/components/shared/(texts)/actions-texts";

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
      return { error: ACTIONS_TEXTS.AI_ERROR + error };
    }

    // ЗМІНА: ПЕРЕВІРЯЄМО, ЧИ ДАНІ ПРИЙШЛИ
    if (!reportData) {
      return { error: ACTIONS_TEXTS.UNCORRECT_DATA };
    }

    // ЗМІНА: ПОВЕРТАЄМО ПОВНИЙ ОБ'ЄКТ
    return { success: reportData };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : ACTIONS_TEXTS.SERVER_ERROR;
    return { error: errorMessage };
  }
}
