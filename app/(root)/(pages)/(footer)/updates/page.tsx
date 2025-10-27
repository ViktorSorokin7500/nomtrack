import { Card } from "@/components/shared";
import { FOOTER_TEXTS } from "@/components/shared/(texts)/footer-texts";
import {
  ClipboardList,
  Smartphone,
  LineChart,
  Watch,
  Users,
  Bot,
  GlassWater,
  ShoppingCart,
  Camera,
} from "lucide-react";

export default function UpdatesPage() {
  // Дані для нашої дорожньої карти
  const plannedFeatures = [
    {
      icon: <Smartphone />,
      title: FOOTER_TEXTS.UPDATES_PAGE.PLANNED_TITLE_1,
      description: FOOTER_TEXTS.UPDATES_PAGE.PLANNED_DESCRIPTION_1,
    },
    {
      icon: <LineChart />,
      title: FOOTER_TEXTS.UPDATES_PAGE.PLANNED_TITLE_2,
      description: FOOTER_TEXTS.UPDATES_PAGE.PLANNED_DESCRIPTION_2,
    },
    {
      icon: <Camera />,
      title: FOOTER_TEXTS.UPDATES_PAGE.PLANNED_TITLE_3,
      description: FOOTER_TEXTS.UPDATES_PAGE.PLANNED_DESCRIPTION_3,
    },
  ];

  const futureFeatures = [
    {
      icon: <Watch />,
      title: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_TITLE_1,
      description: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_DESCRIPTION_1,
    },
    {
      icon: <Users />,
      title: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_TITLE_2,
      description: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_DESCRIPTION_2,
    },
    {
      icon: <Bot />,
      title: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_TITLE_3,
      description: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_DESCRIPTION_3,
    },
    {
      icon: <GlassWater />,
      title: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_TITLE_4,
      description: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_DESCRIPTION_4,
    },
    {
      icon: <ShoppingCart />,
      title: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_TITLE_5,
      description: FOOTER_TEXTS.UPDATES_PAGE.FUTURE_DESCRIPTION_5,
    },
  ];

  const FeatureCard = ({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <div className="bg-orange-50/50 hover:bg-orange-100/50 cursor-default backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-lg border border-gray-200/50 transition-all duration-150">
      <div className="flex items-center gap-4 mb-3">
        <div className="text-orange-500">{icon}</div>
        <h3 className="font-bold text-gray-800 text-md">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="bg-orange-50 min-h-screen">
      <div className="container mx-auto max-w-4xl py-16 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {FOOTER_TEXTS.UPDATES_PAGE.TITLE}
          </h1>
          <p className="text-lg text-gray-600">
            {FOOTER_TEXTS.UPDATES_PAGE.DESCRIPTION}
          </p>
        </header>

        <Card>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <ClipboardList className="text-orange-500" />
              {FOOTER_TEXTS.UPDATES_PAGE.PLANNED}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plannedFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Users className="text-orange-500" />
              {FOOTER_TEXTS.UPDATES_PAGE.FUTURE}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {futureFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </section>
        </Card>
      </div>
    </div>
  );
}
