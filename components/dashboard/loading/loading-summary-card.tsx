import { Card } from "@/components/shared";
import { DASHBOARD_TEXTS } from "../dashboard-text";
import { Button } from "@/components/ui";

export const LoadingSummaryCard = () => (
  <Card className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium text-stone-900">
        {DASHBOARD_TEXTS.DASHBOARD_SKELETON.PROGRESS_OF_WEIGHT}
      </h2>
    </div>

    <div className="mb-8">
      <div className="bg-green-100 rounded-xl p-4">
        <div className="flex items-center">
          <div className="bg-green-200 rounded-full p-2 mr-3" />
          <div className="flex-1">
            <h4 className="font-medium text-stone-900">
              {DASHBOARD_TEXTS.DASHBOARD_SKELETON.WEIGHT_PROGRESS}
            </h4>
            <div className="text-xs text-gray-600 mt-1">
              {DASHBOARD_TEXTS.DASHBOARD_SKELETON.CURRENT_WEIGHT}
              <span className="font-bold ml-1">
                {DASHBOARD_TEXTS.DASHBOARD_SKELETON.NOT_AVAILABLE}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-blue-50 rounded-xl p-4">
      <h3 className="font-medium text-stone-900 mb-3">
        {DASHBOARD_TEXTS.DASHBOARD_SKELETON.ENTER_TODAY_WEIGHT}
      </h3>
      <div className="flex items-end gap-3">
        <div className="flex-grow">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            {DASHBOARD_TEXTS.DASHBOARD_SKELETON.WEIGHT} (
            {DASHBOARD_TEXTS.DASHBOARD_SKELETON.UNIT_KG})
          </span>
          <div className="w-full px-3 py-[21px] border border-gray-300 bg-gray-200 rounded-md" />
        </div>
        <Button>{DASHBOARD_TEXTS.DASHBOARD_SKELETON.SAVE_BUTTON}</Button>
      </div>
    </div>
  </Card>
);
