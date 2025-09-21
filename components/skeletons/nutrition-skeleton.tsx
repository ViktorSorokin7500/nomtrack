import React from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { Coins } from "lucide-react";

export function NutritionSkeleton() {
  return (
    <Card className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          Журнал харчування
        </h1>
        <p className="text-gray-500 font-light">
          Відстежуйте прийоми їжі, щоб стежити за своїм прогресом
        </p>
      </header>

      {/* Блок з прогресом, що використовує реальні дані */}
      <Card className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-light text-gray-700 mb-4">
          Підсумок за сьогодні
        </h2>
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <div className="size-30 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-4">
            {/* Protein */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Білки</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2" />
            </div>
            {/* Carbs */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  Вуглеводи
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2" />
            </div>
            {/* Fat */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Жири</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2" />
            </div>
            {/* Sugar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Цукор</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2" />
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6" />
      <Card className="meal-card bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="sm:p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">
              Додати прийом їжі
            </h3>

            <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
              <span className="flex justify-center flex-1 text-center cursor-pointer p-2 rounded-md transition-all text-sm">
                ШІ Аналіз
                <span className="flex gap-0.5 ml-1 text-green-500">
                  <Coins className="size-5" />1
                </span>
              </span>
              <span className="flex-1 text-center cursor-pointer p-2 rounded-md transition-all text-sm">
                Ввести вручну
              </span>
            </div>

            <div className="h-[74px] rounded-lg pt-1 border border-gray-200">
              <div className="flex flex-col">
                <div />
                <span className="pl-3 pt-1 text-gray-300">
                  Опишіть вашу страву для аналізу...
                </span>
              </div>
            </div>

            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white ">
              <div className="h-6" />
            </div>

            <div className="flex justify-end">
              <Button>Додати запис</Button>
            </div>
          </div>
        </div>
      </Card>
    </Card>
  );
}
