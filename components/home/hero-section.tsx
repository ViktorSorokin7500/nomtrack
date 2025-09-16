import React from "react";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 lg:py-24 flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 mb-10 lg:mb-0">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Ласкаво просимо до
          <br className="sm:hidden lg:block xl:hidden" />
          <span className="bg-gradient-to-r from-orange-400 to-green-300 text-white px-4 parallelogram">
            NomTrack
          </span>
          <br />
          Ваш розумний трекер калорій і макроелементів
        </h1>
        <p className="text-lg mb-8 text-gray-700">
          Візьміть контроль над своїм харчуванням за допомогою ШІ. NomTrack — це
          сучасний інструмент, створений, щоб зробити здорове харчування легким,
          персоналізованим і приємним.
        </p>
      </div>
      <div className="lg:w-1/2 flex justify-center">
        <div className="relative w-full md:w-md max-w-md">
          <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-orange-400 bg-opacity-10 p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-50">
                  Підсумок за сьогодні
                </h3>
                <span className="text-sm text-gray-500">15 червня</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    1,450
                  </div>
                  <div className="text-xs text-gray-500">калорії</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">120г</div>
                  <div className="text-xs text-gray-500">білки</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">40г</div>
                  <div className="text-xs text-gray-500">жири</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">160г</div>
                  <div className="text-xs text-gray-500">вуглеводи</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-200 hover:bg-green-300 cursor-pointer rounded-full flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Сніданок</div>
                      <div className="text-xs text-gray-500">
                        Грецький йогурт з ягодами
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">320 ккал</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-200 hover:bg-yellow-300 cursor-pointer rounded-full flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Обід</div>
                      <div className="text-xs text-gray-500">Курячий салат</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">520 ккал</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
