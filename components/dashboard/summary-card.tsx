"use client";
import { Card } from "../shared";
import { useState } from "react";
// import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Реєстрація компонентів Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SummaryCardProps {
  calories: { current: number; target: number };
  macros: {
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fat: { current: number; target: number };
  };
  weightTracker: {
    currentWeight: number;
    weightDifference: number;
    startDate: string;
    history: { date: string; weight: number; change: number }[];
  };
}

export function SummaryCard({ weightTracker }: SummaryCardProps) {
  const [weightInput, setWeightInput] = useState("");

  const handleAddWeight = () => {
    console.log("Added weight:", weightInput);
    setWeightInput("");
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-stone-900">Summary</h2>
        <div className="text-sm text-gray-500">June 15, 2023</div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-stone-900">Current Progress</h3>
        </div>
        <div className="bg-green-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="bg-green-200 rounded-full p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-stone-900"
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
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-stone-900">Weight Tracking</h4>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    weightTracker.weightDifference <= 0
                      ? "bg-green-200"
                      : "bg-red-200"
                  }`}
                >
                  {weightTracker.weightDifference <= 0
                    ? `Lost ${Math.abs(weightTracker.weightDifference)} kg`
                    : `Gained ${weightTracker.weightDifference} kg`}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-600">
                  Started {weightTracker.startDate}
                </span>
                <span className="text-xs text-gray-600">
                  Current: {weightTracker.currentWeight} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-blue-50 rounded-xl p-4">
        <h3 className="font-medium text-stone-900 mb-3">Todays Weight</h3>
        <div className="flex items-end gap-3">
          <div className="flex-grow">
            <label
              htmlFor="weightInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight (kg)
            </label>
            <input
              type="number"
              id="weightInput"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your weight"
            />
          </div>
          <button
            onClick={handleAddWeight}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      </div>
    </Card>
  );
}
