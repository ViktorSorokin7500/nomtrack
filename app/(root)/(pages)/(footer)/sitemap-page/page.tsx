// nt/app/(root)/(pages)/(footer)/sitemap-page/page.tsx - ОНОВЛЕНИЙ ФАЙЛ
import React from "react";
import { Card } from "@/components/shared";
import Link from "next/link";
import { FOOTER_TEXTS } from "@/components/shared/(texts)/footer-texts";

interface SitemapItemProps {
  href: string;
  label: string;
  description: string;
  notes?: string;
}

const SitemapItem: React.FC<SitemapItemProps> = ({
  href,
  label,
  description,
  notes,
}) => (
  <li>
    <Link href={href} className="font-semibold text-orange-500 hover:underline">
      {label}
    </Link>
    <p className="text-gray-600">
      {description}
      {notes && (
        <>
          <br />
          <strong className="text-green-600">
            {FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.INTEGRATION_TITLE}
          </strong>{" "}
          {notes}
        </>
      )}
    </p>
  </li>
);

const publicPagesData = [
  {
    href: "/",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.HOME.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.HOME.DESC,
  },
  {
    href: "/pricing",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.PRICING.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.PRICING.DESC,
  },
  {
    href: "/sign-in",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.SIGN_IN.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.SIGN_IN.DESC,
  },
  {
    href: "/sign-up",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.SIGN_UP.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.SIGN_UP.DESC,
  },
  {
    href: "/updates",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.UPDATES.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.UPDATES.DESC,
  },
  {
    href: "/privacy-security",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.PRIVACY.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.PRIVACY.DESC,
  },
  {
    href: "/support",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.SUPPORT.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.SUPPORT.DESC,
  },
  {
    href: "/help",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.HELP.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.HELP.DESC,
  },
];

const authPagesData = [
  {
    href: "/dashboard",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.DASHBOARD.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.DASHBOARD.DESC,
    notes: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.DASHBOARD.NOTES,
  },
  {
    href: "/settings",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.SETTINGS.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.SETTINGS.DESC,
  },
  {
    href: "/archive",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.ARCHIVE.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.ARCHIVE.DESC,
    notes: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.ARCHIVE.NOTES,
  },
  {
    href: "/recipes",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.RECIPES.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.RECIPES.DESC,
    notes: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.RECIPES.NOTES,
  },
  {
    href: "/coach",
    label: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.COACH.LABEL,
    description: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.COACH.DESC,
    notes: FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.COACH.NOTES,
  },
];

export default function SitemapPage() {
  return (
    <section className="bg-orange-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {FOOTER_TEXTS.SITEMAP_TEXTS.TITLE}
        </h1>
        <p className="text-center text-gray-600 mb-12">
          {FOOTER_TEXTS.SITEMAP_TEXTS.DESCRIPTION}
        </p>

        <Card>
          <div className="prose prose-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              {FOOTER_TEXTS.SITEMAP_TEXTS.PUBLIC_PAGES.TITLE}
            </h2>
            <ul className="list-disc list-inside space-y-4 mb-8">
              {publicPagesData.map((item) => (
                <SitemapItem key={item.href} {...item} />
              ))}
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              {FOOTER_TEXTS.SITEMAP_TEXTS.AUTH_PAGES.TITLE}
            </h2>
            <ul className="list-disc list-inside space-y-4">
              {authPagesData.map((item) => (
                <SitemapItem key={item.href} {...item} />
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
}
