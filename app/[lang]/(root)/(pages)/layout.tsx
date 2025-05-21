import { Footer } from "@/components/shared";
import { Header } from "@/components/shared/header";
import { Locale } from "@/i18n.config";
import React from "react";

export default async function PagesLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;
  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="bg-orange-50">
        <Header lang={lang} />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
