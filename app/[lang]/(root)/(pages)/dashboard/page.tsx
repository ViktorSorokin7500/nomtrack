import { Locale } from "@/i18n.config";
import React from "react";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  console.log(lang);

  return <div>Dashboard</div>;
}
