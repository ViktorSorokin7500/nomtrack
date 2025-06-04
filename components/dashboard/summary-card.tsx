"use client";
import { Card } from "../shared";
// import { ProgressBar } from "./progress-bar";
// import { ProgressRing } from "./progress-ring";
import { useState } from "react";
import { Line } from "react-chartjs-2";
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

export function SummaryCard({
  // calories,
  // macros,
  weightTracker,
}: SummaryCardProps) {
  const [weightInput, setWeightInput] = useState("");
  const [chartPeriod, setChartPeriod] = useState("10");

  const handleAddWeight = () => {
    console.log("Added weight:", weightInput);
    setWeightInput("");
  };

  // Фільтрація даних для графіка за вибраним періодом
  const filterHistoryByPeriod = (period: string) => {
    const days = parseInt(period);
    const today = new Date();
    const cutoffDate = new Date(today);
    cutoffDate.setDate(today.getDate() - days);

    return weightTracker.history.filter((entry) => {
      const entryDate = new Date(entry.date.split(".").reverse().join("-")); // Перетворюємо DD.MM.YYYY у YYYY-MM-DD
      return entryDate >= cutoffDate;
    });
  };

  // Дані для графіка
  const filteredHistory = filterHistoryByPeriod(chartPeriod);
  const chartData = {
    labels: filteredHistory.map((entry) => entry.date).reverse(), // Дати для осі X (у зворотному порядку)
    datasets: [
      {
        label: "Weight (kg)",
        data: filteredHistory.map((entry) => entry.weight).reverse(), // Вага для осі Y
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Опції для графіка
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight (kg)",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      {/* Current Progress Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-stone-900">Summary</h2>
        <div className="text-sm text-gray-500">June 15, 2023</div>
      </div>

      {/* <div className="flex items-center justify-between mb-8">
        <ProgressRing current={calories.current} target={calories.target} />
        <div className="flex-1 ml-6 space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">Protein</span>
              <span className="text-sm text-gray-600">
                {macros.protein.current}g / {macros.protein.target}g
              </span>
            </div>
            <ProgressBar
              current={macros.protein.current}
              target={macros.protein.target}
              color="bg-yellow-200"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">Carbs</span>
              <span className="text-sm text-gray-600">
                {macros.carbs.current}g / {macros.carbs.target}g
              </span>
            </div>
            <ProgressBar
              current={macros.carbs.current}
              target={macros.carbs.target}
              color="bg-green-200"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">Fat</span>
              <span className="text-sm text-gray-600">
                {macros.fat.current}g / {macros.fat.target}g
              </span>
            </div>
            <ProgressBar
              current={macros.fat.current}
              target={macros.fat.target}
              color="bg-orange-200"
            />
          </div>
        </div>
      </div> */}

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

      {/* Weight Entry Section */}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      </div>

      {/* Weight History Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-stone-900">Recent Entries</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Weight (kg)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weightTracker.history.slice(-3).map((entry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.weight}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      entry.change <= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {entry.change === 0
                      ? "—"
                      : entry.change > 0
                      ? `+${entry.change}`
                      : entry.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-stone-900">Weight Trend</h3>
          <div className="relative">
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm"
            >
              <option value="10">Last 5 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div style={{ height: "250px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </Card>
  );
}
