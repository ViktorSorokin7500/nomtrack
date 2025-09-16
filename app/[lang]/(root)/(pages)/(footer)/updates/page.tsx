import { Card } from "@/components/shared";
import {
  ClipboardList,
  Smartphone,
  LineChart,
  Watch,
  Users,
  Bot,
  GlassWater,
  ShoppingCart,
} from "lucide-react";

export default function UpdatesPage() {
  // Дані для нашої дорожньої карти
  const plannedFeatures = [
    {
      icon: <Smartphone />,
      title: "Повноцінний мобільний додаток",
      description:
        "Розробка додатків для iOS та Android для максимальної зручності.",
    },
    {
      icon: <LineChart />,
      title: "Розширений аналіз та звіти",
      description:
        "Створення тижневих та місячних звітів з візуальними графіками.",
    },
  ];

  const futureFeatures = [
    {
      icon: <Watch />,
      title: "Інтеграція з фітнес-трекерами",
      description:
        "Синхронізація даних з Apple Health, Google Fit та іншими сервісами.",
    },
    {
      icon: <Users />,
      title: "Соціальні функції та челенджі",
      description:
        "Можливість ділитися успіхами з друзями або брати участь у спільних челенджах.",
    },
    {
      icon: <Bot />,
      title: "Персоналізовані плани харчування",
      description:
        "Використання ШІ для генерації індивідуальних планів харчування.",
    },
    {
      icon: <GlassWater />,
      title: "Поглиблене відстеження гідратації",
      description:
        "Відстеження не тільки води, а й інших напоїв, налаштування нагадувань.",
    },
    {
      icon: <ShoppingCart />,
      title: "Списки покупок",
      description:
        "Автоматичне створення списку покупок на основі твого плану харчування.",
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
            Дорожня карта
          </h1>
          <p className="text-lg text-gray-600">
            Наш план з розвитку та покращення NomTrack
          </p>
        </header>

        <Card>
          {/* --- Секція "Заплановано" --- */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <ClipboardList className="text-orange-500" />
              Заплановано
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plannedFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </section>

          {/* --- Секція "Розглядається" --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Users className="text-orange-500" />
              Розглядається
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
