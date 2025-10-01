"use server";
import Together from "together-ai";

export async function getAiJsonResponse<T>(
  prompt: string
): Promise<{ data: T | null; error: string | null }> {
  try {
    const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });

    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "Qwen/Qwen3-235B-A22B-Instruct-2507-tput",
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;

    console.log("Повна відповідь ШІ:", content);

    // Цей лог допоможе побачити повну, "брудну" відповідь
    if (!content) {
      return { data: null, error: "ШІ не повернув жодного контенту." };
    }

    // Крок 1: Знаходимо початок першого JSON об'єкта або масиву
    const firstBrace = content.indexOf("{");
    const firstBracket = content.indexOf("[");

    if (firstBrace === -1 && firstBracket === -1) {
      return { data: null, error: "У відповіді від ШІ не знайдено JSON." };
    }

    const startIndex =
      firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)
        ? firstBrace
        : firstBracket;

    const jsonText = content.substring(startIndex);
    const startChar = jsonText[0];
    const endChar = startChar === "{" ? "}" : "]";

    let openCount = 0;
    let endIndex = -1;

    // Крок 2: Рахуємо дужки, щоб знайти кінець першого повного JSON
    for (let i = 0; i < jsonText.length; i++) {
      if (jsonText[i] === startChar) {
        openCount++;
      } else if (jsonText[i] === endChar) {
        openCount--;
      }

      if (openCount === 0) {
        endIndex = i;
        break; // Знайшли кінець, виходимо
      }
    }

    if (endIndex === -1) {
      return {
        data: null,
        error: "Не вдалося знайти кінець JSON (непарні дужки).",
      };
    }

    // Крок 3: Вирізаємо чистий, одиночний JSON і парсимо його
    const jsonString = jsonText.substring(0, endIndex + 1);

    const parsedJson = JSON.parse(jsonString) as T;
    return { data: parsedJson, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Невідома помилка при взаємодії з ШІ.";
    return { data: null, error: errorMessage };
  }
}
