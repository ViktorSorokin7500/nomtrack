"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "../ui";
import { analyzeMonthlyData } from "@/app/actions";
import toast from "react-hot-toast";
import { DailySummary, Profile } from "@/types"; // <-- ОНОВЛЕНИЙ ІМПОРТ
import { Card } from "../shared";
import { AiOutlineFileText } from "react-icons/ai";
import { AiReportData, ReportDisplay } from "./report-display";

interface MonthlyReportButtonProps {
  daysData: DailySummary[];
  userProfile: Profile;
}

export function MonthlyReportButton({
  daysData,
  userProfile,
}: MonthlyReportButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [report, setReport] = useState<AiReportData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const getReport = () => {
    startTransition(async () => {
      // ЗМІНА: ПРЯМО ПРИЙМАЄМО ОБ'ЄКТ
      const result = await analyzeMonthlyData(daysData, userProfile);
      if (result?.error) {
        toast.error(result.error);
        setReport(null);
      } else {
        // ЗМІНА: НЕМАЄ НЕОБХІДНОСТІ В JSON.parse()
        setReport(result?.success || null);
        setIsModalOpen(true);
      }
    });
  };

  return (
    <>
      {" "}
      <Button
        onClick={getReport}
        disabled={isPending}
        className="w-full justify-center gap-2 mt-4"
      >
        <AiOutlineFileText size={20} />{" "}
        {isPending ? "Аналізуємо..." : "Згенерувати звіт від ШІ"}{" "}
      </Button>{" "}
      {isModalOpen && report && (
        <div
          className="fixed inset-0 bg-orange-100/90 flex items-center justify-center p-4 z-[100]"
          onClick={() => setIsModalOpen(false)}
        >
          {" "}
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 z-[999]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {" "}
            <div className="flex justify-between items-center mb-6">
              {" "}
              <h2 className="text-2xl font-bold text-gray-800">
                ШІ-аналіз за місяць{" "}
              </h2>{" "}
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl cursor-pointer"
                aria-label="close"
              >
                &times;{" "}
              </button>{" "}
            </div>
            <ReportDisplay reportData={report} />{" "}
          </Card>{" "}
        </div>
      )}{" "}
    </>
  );
}
