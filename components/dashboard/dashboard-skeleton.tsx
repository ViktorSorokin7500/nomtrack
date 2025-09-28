import React from "react";
import { Card } from "../shared";
import { Button } from "../ui";
import { Coins } from "lucide-react";

export function DashboardSkeleton() {
  const quickAddAmounts = [-50, 250, 500];
  return (
    <div className="bg-orange-50 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 lg:order-2">
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
                      <span className="text-sm font-medium text-gray-600">
                        Білки
                      </span>
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
                      <span className="text-sm font-medium text-gray-600">
                        Жири
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2" />
                  </div>
                  {/* Sugar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        Цукор
                      </span>
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
        </div>
        <div className="lg:col-span-1 space-y-6 lg:order-1">
          <Card className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-stone-900">
                Прогрес ваги
              </h2>
            </div>

            <div className="mb-8">
              <div className="bg-green-100 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="bg-green-200 rounded-full p-2 mr-3">
                    {/* SVG icon */}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-900">
                      Відстеження ваги
                    </h4>
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

          <Card className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-medium text-stone-900 mb-4">
              Відстеження води
            </h2>

            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-lg font-bold text-blue-500">0 мл</span>
                <span className="text-sm text-gray-500">Ціль: 0 000 мл</span>
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
                <p className="text-sm text-gray-600 mb-2">Швидко додати:</p>
                <div className="flex justify-center gap-2">
                  {quickAddAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                    >
                      {/* 3. Невеличке покращення: додаємо '+' для позитивних значень */}
                      {amount > 0 ? `+${amount}` : amount} мл
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-full px-4 py-5 border rounded-md text-center" />
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Додати
                </Button>
              </div>
            </div>
          </Card>
          <Card>
            <div className="py-2">
              <h2 className="text-xl font-medium mb-4">
                Відстеження активності
              </h2>

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
        </div>
      </div>
    </div>
  );
}
