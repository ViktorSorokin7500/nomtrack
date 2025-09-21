import React from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { Coins } from "lucide-react";

export function AiCoachSkeleton() {
  return (
    <Card>
      <div className="py-2">
        <h2 className="text-xl font-medium mb-4">Відстеження активності</h2>

        <div className="space-y-4">
          {/* radio */}
          <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
            <span className="flex-1 p-2 rounded-md text-sm flex justify-center items-center">
              ШІ Аналіз
              <span className="ml-1 text-green-500 flex items-center gap-1">
                <Coins className="size-4" />
              </span>
            </span>

            <span className="flex-1 p-2 rounded-md text-sm flex justify-center items-center">
              Ввести вручну
            </span>

            <span className="flex-1 p-2 rounded-md text-sm flex justify-center items-center">
              Мій запис
            </span>
          </div>

          <textarea
            rows={2}
            className="w-full p-3 border rounded-lg"
            placeholder="Легкі садові роботи протягом 60 хвилин."
          />

          <div className="flex justify-end">
            <Button>Додати</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
