import { Card } from "@/components/shared";
import { DASHBOARD_TEXTS } from "../dashboard-text";
import { Coins } from "lucide-react";
import { AI_REQUEST } from "@/lib/const";
import { Button } from "@/components/ui";

export const LoadingNutritionDashboard = () => (
  <Card className="container mx-auto px-4 py-8 max-w-4xl">
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-light text-gray-800 mb-2">
        {DASHBOARD_TEXTS.DASHBOARD_SKELETON.FOOD_JOURNAL}
      </h1>
      <p className="text-gray-500 font-light">
        {DASHBOARD_TEXTS.DASHBOARD_SKELETON.TRACK_PROGRESS}
      </p>
    </header>

    <Card className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-xl font-light text-gray-700 mb-4">
        {DASHBOARD_TEXTS.DASHBOARD_SKELETON.TODAY_SUMMARY}
      </h2>
      <div className="flex items-center justify-between gap-4 sm:gap-6">
        <div className="size-30 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">
                {DASHBOARD_TEXTS.DASHBOARD_SKELETON.PROTEIN}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">
                {DASHBOARD_TEXTS.DASHBOARD_SKELETON.CARBOHYDRATE}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">
                {DASHBOARD_TEXTS.DASHBOARD_SKELETON.FAT}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2" />
          </div>
          {/* <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        {DASHBOARD_TEXTS.DASHBOARD_SKELETON.SUGAR}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2" />
                  </div> */}
        </div>
      </div>
    </Card>

    <div className="mt-6" />
    <Card className="meal-card bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="sm:p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            {DASHBOARD_TEXTS.DASHBOARD_SKELETON.ADD_FOOD}
          </h3>

          <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
            <span className="flex justify-center flex-1 text-center cursor-pointer p-2 rounded-md transition-all text-sm">
              {DASHBOARD_TEXTS.DASHBOARD_SKELETON.AI_ANALIZE}
              <span className="flex gap-0.5 ml-1 text-green-500">
                <Coins className="size-5" />
                {AI_REQUEST}
              </span>
            </span>
            <span className="flex-1 text-center cursor-pointer p-2 rounded-md transition-all text-sm">
              {DASHBOARD_TEXTS.DASHBOARD_SKELETON.MANUAL_ENTER}
            </span>
          </div>

          <div className="h-[74px] rounded-lg pt-1 border border-gray-200">
            <div className="flex flex-col">
              <div />
              <span className="pl-3 pt-1 text-gray-300">
                {DASHBOARD_TEXTS.DASHBOARD_SKELETON.ABOUT_FOOD}
              </span>
            </div>
          </div>

          <div className="w-full border border-gray-200 rounded-lg p-3 bg-white ">
            <div className="h-6" />
          </div>

          <div className="flex justify-end">
            <Button>{DASHBOARD_TEXTS.DASHBOARD_SKELETON.SUBMIT_BUTTON}</Button>
          </div>
        </div>
      </div>
    </Card>
  </Card>
);
