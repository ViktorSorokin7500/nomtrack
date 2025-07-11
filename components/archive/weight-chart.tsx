"use client";

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
  Filler,
} from "chart.js";
import { Card } from "../shared";

// Реєструємо всі необхідні частини для Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Типи для пропсів
interface WeightChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: (number | null)[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      fill: boolean;
    }[];
  };
}

export function WeightChart({ chartData }: WeightChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Динаміка зміни ваги",
      },
    },
    scales: {
      y: {
        beginAtZero: false, // Не починати з нуля, щоб графік був наочним
      },
    },
  };

  return (
    <Card>
      <Line options={options} data={chartData} />
    </Card>
  );
}
