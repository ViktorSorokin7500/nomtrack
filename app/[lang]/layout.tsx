import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { Locale } from "@/i18n.config";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const localizedMetadata = {
  en: {
    description: "123",
    keywords: "123",
  },
  uk: {
    description: "123",
    keywords: "123",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: {
      template: "%s | NomTrack",
      default: "NomTrack",
    },
    description: localizedMetadata[lang].description,
    keywords: localizedMetadata[lang].keywords,
    openGraph: {
      title: "NomTrack",
      description: localizedMetadata[lang].description,
      url: `https://www.commentpulse.site/${lang}`,
      type: "website",
      locale: lang === "uk" ? "uk_UA" : "en_US",
      siteName: "Social Analyzer",
    },
    twitter: {
      card: "summary_large_image",
      title: "NomTrack",
      description: localizedMetadata[lang].description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
