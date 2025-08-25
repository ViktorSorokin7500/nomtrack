import { DailySummary, Profile } from "@/types";

export const promptWithIngredients = (
  userText: string
) => `You are a nutritional assistant that analyzes a user's meal description and outputs a flat JSON list of ingredients with estimated weights in grams.

Your step-by-step logic:
1. If the input is not in English, detect the language and translate it to English before analysis.
2. If the user explicitly lists ingredients and quantities, use them as-is.
3. If the user provides a common dish name (e.g. "Borscht", "Caesar salad") without ingredients, deconstruct it into typical ingredients with approximate weights per standard portion. Adjust portion size if words like “large” or “small” are present.
4. Exclude emotional, irrelevant, or decorative phrases.
5. Output ONLY a valid JSON object in the format below without any additional text or explanations.
Your response MUST be a valid JSON object. Do not include any text, explanations, or markdown formatting before or after the JSON object. The response should strictly adhere to the specified format.
JSON format:
{
  "ingredients": [
    { "name": "<english_food_item_name>", "weight_g": <integer> }
  ]
}

--- Examples ---

User Text: "my custom soup: 150g chicken broth, 50g chicken, 50g noodles"  
JSON:
{
  "ingredients": [
    { "name": "chicken broth", "weight_g": 150 },
    { "name": "chicken", "weight_g": 50 },
    { "name": "noodles", "weight_g": 50 }
  ]
}

User Text: "a large Chicken Kyiv"  
JSON:
{
  "ingredients": [
    { "name": "chicken fillet", "weight_g": 200 },
    { "name": "butter", "weight_g": 40 },
    { "name": "breadcrumbs", "weight_g": 30 },
    { "name": "egg", "weight_g": 25 }
  ]
}

--- Now analyze the following ---

User Text: ${userText}
Your JSON Response:`;

export const promptWithActivity = (
  userText: string
) => `You are a fitness analysis API.

Your job is to analyze a user's physical activity description and estimate the total number of calories burned. Follow this exact logic:

1. If the user's input is not in English, translate it to English before analyzing.
2. Estimate calories burned based on the activity type and duration.
3. If the input is vague or missing key data (e.g. no duration), make a realistic assumption based on common values.
4. If the text is NOT a physical activity (e.g., "hello world", "2+2", "what is the weather"), return 0 for calories_burned.
Your response MUST be a valid JSON object. Do not include any text, explanations, or markdown formatting before or after the JSON object. The response should strictly adhere to the specified format.
Return ONLY a valid JSON, without any additional text. The JSON should be an object in the following format:
{
  "calories_burned": <integer>
}

--- Examples ---

User Text: "Running for 30 minutes"  
Your JSON Response: { "calories_burned": 350 }

User Text: "Силове тренування в залі 1 годину"  
Your JSON Response: { "calories_burned": 400 }

--- Now analyze the following ---
  User Text: "${userText}"
  Your JSON Response:`;

export const promptWithRecipe = (userText: string) => `
You are an AI culinary assistant and nutritional calculator. Your task is to analyze a list of recipe ingredients. For each ingredient, you must normalize its name and estimate its weight after cooking or preparation.

Follow these rules:
1. Identify each ingredient and its raw weight in grams. Normalize the ingredient name to a simple English name for a nutritional API query.
2. If you see "кг", "kg", multiply the number by 1000 to get grams.
3. For items by count (like eggs, onions), use a standard average weight to calculate the total grams.
4. For liquids in "ml", assume a density of 1 g/ml.
5. **Crucially, for each ingredient, estimate its weight after cooking.** Account for typical weight changes:
    - **Meat (chicken, beef, etc.):** Typically loses 20-30% of its weight. (e.g., 100g raw chicken becomes ~75g cooked).
    - **Rice, Pasta, Legumes:** Typically gains 200-300% of its weight due to water absorption. (e.g., 50g raw rice becomes ~125g cooked).
    - **Vegetables:** Weight change varies, usually loses 10-20% when cooked.
    - **Oils, Sauces:** Weight usually doesn't change.
6. If the input text is not a list of ingredients, return an empty JSON array: [].

Your response MUST be a valid JSON array. Do not include any text, explanations, or markdown formatting before or after the JSON object. The response should strictly adhere to the specified format.

JSON format:
[
  { "ingredientName": "<english_food_item_name>", "weightGrams": <estimated_cooked_weight_in_grams> },
  // ... more ingredients with their cooked weight
]

Example:
Input List:
100г курячого філе
50г рису

JSON Output:
[
    { "ingredientName": "chicken fillet", "weightGrams": 75},
    { "ingredientName": "rice", "weightGrams": 125}
]

Input List:
${userText}

JSON Output:
`;

export const promptWithMonthlyReport = (
  daysData: DailySummary[],
  userProfile: Profile
) => `You are an experienced nutritionist and a professional data analyst. Your task is to generate a detailed, actionable, and encouraging monthly nutrition and body progress analysis for the user.

The analysis MUST be provided as a structured JSON object, formatted strictly according to the schema below. The tone should be professional, precise, and empathetic, but avoid generic phrases. The language of the report's content MUST be entirely in fluent Ukrainian. Base your conclusions strictly on the provided numerical data and the user's profile information. Always refer to averages, percentages, deviations, and the number of days above/below target. Be specific and fact-driven.

### User Profile and Goals:
- Goal: ${userProfile.goal}
- Activity Level: ${userProfile.activity_level}
- Gender: ${userProfile.gender}
- Age: ${userProfile.age}
- Height: ${userProfile.height_cm} cm
- Starting Weight (month start): ${
  daysData.length > 0 ? daysData[daysData.length - 1].end_of_day_weight : "N/A"
} kg
- **Ending Weight (month end):** ${
  daysData.length > 0 ? daysData[0].end_of_day_weight : "N/A"
} kg

### Data to analyze:
${JSON.stringify(daysData, null, 2)}

Your final response MUST be a complete and valid JSON object in the following format, and NOTHING else. Ensure the report is in fluent Ukrainian.

{
  "summary": {
    "title": "Загальна оцінка прогресу",
    "content": "Тут буде короткий, мотивуючий висновок, що посилається на цілі та результати. Наприклад: 'Протягом місяця ви показали стабільний прогрес у досягненні вашої цілі «Зменшення ваги», що свідчить про хорошу дисципліну.'"
  },
  "weightAnalysis": {
    "title": "Динаміка ваги",
    "startWeight": 105.2,
    "endWeight": 105.0,
    "change": -0.2,
    "unit": "кг",
    "analysis": "Ваша вага знизилася на 0.2 кг, що відповідає вашій цілі. Продовжуйте в тому ж дусі!"
  },
  "recommendations": {
    "title": "Персональні рекомендації",
    "items": [
      "Зосередьтеся на збільшенні споживання білка, щоб підтримувати м'язову масу. Додайте в раціон бобові або нежирне м'ясо.",
      "Для ефективного зменшення ваги, вам потрібно зменшити середнє споживання жирів, замінивши їх на корисні, наприклад, авокадо чи горіхи."
    ]
  }
}
`;
