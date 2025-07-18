// app/[lang]/(root)/(auth)/layout.tsx
import Link from "next/link";
import { Card } from "@/components/shared";
import { Locale } from "@/i18n.config";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <main className="h-screen flex flex-col justify-center items-center bg-orange-50 px-4">
      <div className="w-full max-w-md">
        <Link href={`/${lang}`} className="flex justify-center mb-8">
          <svg
            className="size-12"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="18" fill="#FFB982"></circle>
            <path
              d="M14 20C14 17.2386 16.2386 15 19 15H21C23.7614 15 26 17.2386 26 20V25C26 27.7614 23.7614 30 21 30H19C16.2386 30 14 27.7614 14 25V20Z"
              fill="#B4E8C2"
            ></path>
            <circle cx="20" cy="12" r="4" fill="#FFE066"></circle>
          </svg>
        </Link>
        <Card className="p-8 shadow-xl">{children}</Card>
        <Link href={`/${lang}`} className="flex justify-center mt-8">
          <span className="text-sm text-gray-600 hover:text-orange-500">
            Повернутися на головну
          </span>
        </Link>
      </div>
    </main>
  );
}
