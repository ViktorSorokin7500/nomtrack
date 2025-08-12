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
      Analyze the following list of recipe ingredients. Your task is to normalize each ingredient into its English name and its total weight in GRAMS.

      Follow these rules:
      1. If you see "кг", "kg", or same meaninig, multiply the number by 1000 to get grams. (e.g., "2 кг муки" -> weightGrams: 2000).
      2. For items by count (like eggs, onions, etc.), use a standard average weight to calculate the total weight in grams. (e.g., "8 large eggs" -> assume 60g per egg -> weightGrams: 480).
      3. For liquids in "ml", assume density is 1 g/ml. (e.g., "200 ml milk" -> weightGrams: 200).
      4. The 'ingredientName' should be a clean, simple English name suitable for an API query (e.g., "cauliflower", "large eggs", "milk").
      5. If the input text does not appear to be a list of ingredients, or if it's nonsensical, return an empty JSON array: []
      Your response MUST be a valid JSON object. Do not include any text, explanations, or markdown formatting before or after the JSON object. The response should strictly adhere to the specified format.
      Return the output ONLY as a valid JSON array of objects. Each object must have two keys: "ingredientName" (string) and "weightGrams" (number).

      Input List:
      ${userText}

      JSON Output:
    `;
