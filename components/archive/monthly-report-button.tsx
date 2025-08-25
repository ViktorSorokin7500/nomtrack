"use client";

import { useState, useTransition, useEffect } from "react"; // <-- ДОДАНО useEffect
import { Button } from "../ui";
import { analyzeMonthlyData } from "@/app/actions";
import toast from "react-hot-toast";
import { DailySummary } from "@/types";
import { Card } from "../shared";
import { AiOutlineFileText } from "react-icons/ai";

interface MonthlyReportButtonProps {
  daysData: DailySummary[];
}

export function MonthlyReportButton({ daysData }: MonthlyReportButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [report, setReport] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Використовуємо useEffect для блокування скролу на основному контенті
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Прибирання ефекту при розмонтуванні компонента
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const getReport = () => {
    startTransition(async () => {
      const result = await analyzeMonthlyData(daysData);
      if (result?.error) {
        toast.error(result.error);
        setReport(null);
      } else {
        setReport(result?.success || "Не вдалося згенерувати звіт.");
        setIsModalOpen(true);
      }
    });
  };

  return (
    <>
      <Button
        onClick={getReport}
        disabled={isPending}
        className="w-full justify-center gap-2 mt-4"
      >
        <AiOutlineFileText size={20} />
        {isPending ? "Аналізуємо..." : "Згенерувати звіт від ШІ"}
      </Button>

      {isModalOpen && (
        // НОВІ СТИЛІ: fixed inset-0, bg-gray-900/50, flex items-center justify-center, z-[100]
        <div
          className="fixed inset-0 bg-orange-300/75 flex items-center justify-center p-4 z-[100]"
          onClick={() => setIsModalOpen(false)}
        >
          {/* НОВИЙ СТИЛЬ: z-50 для картки всередині оверлея, щоб уникнути конфліктів z-index */}
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 z-[999]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                ШІ-аналіз за місяць
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl cursor-pointer"
                aria-label="close"
              >
                &times;
              </button>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{report}</p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
