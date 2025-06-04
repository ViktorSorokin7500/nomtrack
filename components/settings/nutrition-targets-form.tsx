"use client";
import { useState } from "react";
import { InputWithUnit } from "./input-with-unit";
import { Card } from "../shared";

interface NutritionTargets {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export function NutritionTargetsForm() {
  const [activeTab, setActiveTab] = useState<"manual" | "auto">("manual");
  const [manualData, setManualData] = useState<NutritionTargets>({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [showAIResult, setShowAIResult] = useState(false);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualData({ ...manualData, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Manual Targets Submitted:", manualData);
    // Здесь можно отправить данные на сервер
  };

  const handleGenerateAI = () => {
    setShowAIResult(true);
    // Здесь можно вызвать API для генерации AI-рекомендаций
  };

  const handleApplyAI = () => {
    setManualData({
      calories: "2150",
      protein: "160",
      carbs: "215",
      fat: "60",
    });
    setActiveTab("manual");
    setShowAIResult(false);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Nutrition Targets</h2>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`flex-1 py-3 font-medium text-center transition-colors ${
            activeTab === "manual"
              ? "border-b-2 border-orange-200 text-orange-400"
              : "text-gray-500 cursor-pointer hover:text-gray-700"
          }`}
        >
          Set Manually
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("auto")}
          className={`flex-1 py-3 font-medium text-center transition-colors ${
            activeTab === "auto"
              ? "border-b-2 border-orange-200 text-orange-400"
              : "text-gray-500 cursor-pointer hover:text-gray-700"
          }`}
        >
          AI Recommendation
        </button>
      </div>

      {activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithUnit
              id="calories"
              label="Daily Calories"
              name="calories"
              value={manualData.calories}
              unit="kcal"
              placeholder="2000"
              onChange={handleManualChange}
            />
            <InputWithUnit
              id="protein"
              label="Protein"
              name="protein"
              value={manualData.protein}
              unit="g"
              placeholder="150"
              onChange={handleManualChange}
            />
            <InputWithUnit
              id="carbs"
              label="Carbohydrates"
              name="carbs"
              value={manualData.carbs}
              unit="g"
              placeholder="200"
              onChange={handleManualChange}
            />
            <InputWithUnit
              id="fat"
              label="Fat"
              name="fat"
              value={manualData.fat}
              unit="g"
              placeholder="65"
              onChange={handleManualChange}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-200 hover:bg-orange-400 hover:shadow-lg active:shadow-none cursor-pointer text-white rounded-xl hover:bg-opacity-90 transition-colors duration-300"
            >
              Save Targets
            </button>
          </div>
        </form>
      )}

      {activeTab === "auto" && (
        <div className="space-y-6">
          <div className="bg-mint bg-opacity-10 rounded-xl p-6">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-mint flex-shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="ml-3 text-sm text-gray-700">
                Our AI will analyze your personal data and goals to recommend
                optimal calorie and macro targets. Make sure your personal
                information is up to date for the most accurate recommendations.
              </p>
            </div>
          </div>

          {showAIResult && (
            <div className="bg-white border border-mint rounded-xl p-6">
              <h3 className="font-medium text-lg mb-4">
                AI Recommended Targets
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-2xl font-bold text-orange-200">
                    2,150
                  </div>
                  <div className="text-sm text-gray-500">Daily Calories</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-2xl font-bold text-blue-500">160g</div>
                  <div className="text-sm text-gray-500">Protein</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-2xl font-bold text-yellow-500">215g</div>
                  <div className="text-sm text-gray-500">Carbohydrates</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-2xl font-bold text-green-500">60g</div>
                  <div className="text-sm text-gray-500">Fat</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                These targets are optimized for your goal to maintain weight
                while supporting your activity level. Adjust as needed based on
                your progress.
              </p>
            </div>
          )}

          <div className="flex justify-center">
            {!showAIResult && (
              <button
                type="button"
                onClick={handleGenerateAI}
                className="px-6 py-3 bg-orange-200 hover:bg-orange-400 hover:shadow-lg active:shadow-none cursor-pointer text-white rounded-xl hover:bg-opacity-90 transition-colors duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate AI Recommendation
              </button>
            )}
            {showAIResult && (
              <button
                type="button"
                onClick={handleApplyAI}
                className="px-6 py-3 bg-green-200 hover:bg-green-400 hover:text-white hover:shadow-lg active:shadow-none cursor-pointer text-stone-400 rounded-xl transition-colors duration-300 ml-4"
              >
                Apply These Targets
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
