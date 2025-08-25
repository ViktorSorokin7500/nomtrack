"use client";

export interface AiReportData {
  summary: {
    title: string;
    content: string;
  };
  weightAnalysis: {
    title: string;
    startWeight: number;
    endWeight: number;
    change: number;
    unit: string;
    analysis: string;
  };
  recommendations: {
    title: string;
    items: string[];
  };
}

interface ReportDisplayProps {
  reportData: AiReportData;
}

export function ReportDisplay({ reportData }: ReportDisplayProps) {
  return (
    <div className="space-y-8 text-gray-700">
      {/* Загальна оцінка прогресу */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {reportData.summary.title}
        </h3>
        <p className="text-gray-600 italic">{reportData.summary.content}</p>
      </div>

      {/* Аналіз метрик (таблиця або список) */}

      <div className="h-[2px] w-full bg-gray-200" />

      <h4 className="font-semibold text-xl text-gray-800  text-center mb-4">
        {reportData.weightAnalysis.title}
      </h4>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-sky-600">
            {reportData.weightAnalysis.startWeight}{" "}
            {reportData.weightAnalysis.unit}
          </p>
          <p className="text-sm text-gray-500">Вага на початку місяця</p>
        </div>
        <div>
          <p className="text-lg font-bold text-sky-600">
            {reportData.weightAnalysis.endWeight}{" "}
            {reportData.weightAnalysis.unit}
          </p>
          <p className="text-sm text-gray-500">Вага в кінці місяця</p>
        </div>
      </div>
      <p className="mt-4 text-center">{reportData.weightAnalysis.analysis}</p>

      <div className="h-[2px] w-full bg-gray-200" />

      <h4 className="font-semibold text-xl text-gray-800 mb-4  text-center">
        {reportData.recommendations.title}
      </h4>
      <ul className="list-disc list-inside space-y-2">
        {reportData.recommendations.items.map((item, index) => (
          <li key={index} className="text-gray-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
