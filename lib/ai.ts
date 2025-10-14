// nmt/lib/ai.ts
"use server";
import { LIB_TEXTS } from "@/components/shared/(texts)/lib-texts";
import Together from "together-ai";
import { TOGETHER_MODEL } from "./const";

export async function getAiJsonResponse<T>(
  prompt: string
): Promise<{ data: T | null; error: string | null }> {
  try {
    if (!process.env.TOGETHER_AI_API_KEY) {
      return { data: null, error: LIB_TEXTS.AI_TEXT.NO_API };
    }

    const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });

    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: TOGETHER_MODEL,
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return { data: null, error: LIB_TEXTS.AI_TEXT.NO_RETURN };
    }

    // --- ВИПРАВЛЕННЯ КРИТИЧНОЇ ПОМИЛКИ ПАРСИНГУ ---
    // Замість ненадійного підрахунку дужок:
    let jsonString = content.trim();

    // 1. Знаходимо початок ({ або [)
    const firstBrace = jsonString.indexOf("{");
    const firstBracket = jsonString.indexOf("[");

    if (firstBrace > -1 || firstBracket > -1) {
      const startIndex =
        firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)
          ? firstBrace
          : firstBracket;

      jsonString = jsonString.substring(startIndex);
    } else {
      return { data: null, error: LIB_TEXTS.AI_TEXT.NO_JSON };
    }

    // 2. Знаходимо кінець, обрізаючи все, що після нього
    const lastBrace = jsonString.lastIndexOf("}");
    const lastBracket = jsonString.lastIndexOf("]");
    const endIndex = Math.max(lastBrace, lastBracket);

    if (endIndex === -1) {
      return {
        data: null,
        error: LIB_TEXTS.AI_TEXT.UNBALANCED,
      };
    }

    jsonString = jsonString.substring(0, endIndex + 1);
    // ------------------------------------------

    const parsedJson = JSON.parse(jsonString) as T;
    return { data: parsedJson, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : LIB_TEXTS.AI_TEXT.ERROR;
    return { data: null, error: errorMessage };
  }
}
