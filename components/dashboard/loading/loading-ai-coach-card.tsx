import { Card } from "@/components/shared";
import { DASHBOARD_TEXTS } from "../dashboard-text";
import { AI_REQUEST } from "@/lib/const";
import { Button } from "@/components/ui";
import { Coins } from "lucide-react";

export const LoadingAICoachCard = () => (
  <Card>
    <div className="py-2">
      <h2 className="text-xl font-medium mb-4">
        {DASHBOARD_TEXTS.DASHBOARD_SKELETON.ACTIVITY_PROGRESS}
      </h2>

      <div className="space-y-4">
        <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
          <span className="flex-1 p-2 rounded-md text-sm flex justify-center items-center">
            {DASHBOARD_TEXTS.DASHBOARD_SKELETON.AI_ANALIZE}
            <span className="ml-1 text-green-500 flex items-center gap-1">
              <Coins className="size-4" /> {AI_REQUEST}
            </span>
          </span>

          <span className="flex-1 p-2 rounded-md text-sm flex justify-center items-center">
            {DASHBOARD_TEXTS.DASHBOARD_SKELETON.MANUAL_ENTER}
          </span>

          <span className="flex-1 p-2 rounded-md text-sm flex justify-center items-center">
            {DASHBOARD_TEXTS.DASHBOARD_SKELETON.MY_ENTER}
          </span>
        </div>

        <textarea
          rows={2}
          className="w-full p-3 border rounded-lg"
          placeholder="Легкі садові роботи протягом 60 хвилин."
        />

        <div className="flex justify-end">
          <Button>{DASHBOARD_TEXTS.DASHBOARD_SKELETON.SUBMIT_BUTTON}</Button>
        </div>
      </div>
    </div>
  </Card>
);
