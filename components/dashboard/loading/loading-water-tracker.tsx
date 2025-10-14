import { Card } from "@/components/shared";
import { DASHBOARD_TEXTS } from "../dashboard-text";
import { Button } from "@/components/ui";

const quickAddAmounts = [-50, 250, 500];
export const LoadingWaterTracker = () => (
  <Card className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-medium text-stone-900 mb-4">
      {DASHBOARD_TEXTS.DASHBOARD_SKELETON.WATER_TRACKER}
    </h2>

    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-lg font-bold text-blue-500">
          0 {DASHBOARD_TEXTS.DASHBOARD_SKELETON.UNIT_ML}
        </span>
        <span className="text-sm text-gray-500">
          {DASHBOARD_TEXTS.DASHBOARD_SKELETON.GOAL}{" "}
          {DASHBOARD_TEXTS.DASHBOARD_SKELETON.UNIT_ML}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-400 h-2.5 rounded-full"
          style={{ width: `70%` }}
        />
      </div>
    </div>

    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          {DASHBOARD_TEXTS.DASHBOARD_SKELETON.QUICK_ADD}
        </p>
        <div className="flex justify-center gap-2">
          {quickAddAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            >
              {amount > 0 ? `+${amount}` : amount}{" "}
              {DASHBOARD_TEXTS.DASHBOARD_SKELETON.UNIT_ML}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full px-4 py-5 border rounded-md text-center" />
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          {DASHBOARD_TEXTS.DASHBOARD_SKELETON.SUBMIT_BUTTON}
        </Button>
      </div>
    </div>
  </Card>
);
