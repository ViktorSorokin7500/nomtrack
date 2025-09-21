import React from "react";
import { Card } from "../shared";
import { Button } from "../ui";

export function SummarySkeleton() {
  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-stone-900">Прогрес ваги</h2>
      </div>

      <div className="mb-8">
        <div className="bg-green-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="bg-green-200 rounded-full p-2 mr-3">
              {/* SVG icon */}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-stone-900">Відстеження ваги</h4>
              <div className="text-xs text-gray-600 mt-1">
                Поточна вага:
                <span className="font-bold ml-1">N/A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-medium text-stone-900 mb-3">
          Записати сьогоднішню вагу
        </h3>
        <div className="flex items-end gap-3">
          <div className="flex-grow">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Вага (кг)
            </span>
            <div className="w-full px-3 py-1.5 border border-gray-300 bg-gray-200 rounded-md" />
          </div>
          <Button>Зберегти</Button>
        </div>
      </div>
    </Card>
  );
}
