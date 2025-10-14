import React from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { Coins } from "lucide-react";
import { DASHBOARD_TEXTS } from "./dashboard-text";
import { AI_REQUEST } from "@/lib/const";

export function DashboardSkeleton() {
  const quickAddAmounts = [-50, 250, 500];
  return (
    <div className="bg-orange-50 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 lg:order-2">
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
                        {DASHBOARD_TEXTS.DASHBOARD_SKELETON.CARBS}
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
                    <Button>
                      {DASHBOARD_TEXTS.DASHBOARD_SKELETON.SUBMIT_BUTTON}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6 lg:order-1">
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
                <Button>
                  {DASHBOARD_TEXTS.DASHBOARD_SKELETON.SAVE_BUTTON}
                </Button>
              </div>
            </div>
          </Card>

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
                  <Button>
                    {DASHBOARD_TEXTS.DASHBOARD_SKELETON.SUBMIT_BUTTON}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
