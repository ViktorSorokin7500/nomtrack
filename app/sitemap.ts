import { MetadataRoute } from "next";
import { i18n } from "@/i18n.config";

const pages = ["", "pricing", "updates", "privacy-security", "help", "support"];

// This function will generate the sitemap
export default function sitemap(): MetadataRoute.Sitemap {
  const locales = i18n.locales;
  const baseUrl = "https://www.nomtrack.site"; // Replace with your domain

  // Generate a sitemap entry for each page and locale
  const sitemapEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}/${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: page === "" ? 1.0 : 0.8, // Prioritize the homepage
    }))
  );

  return sitemapEntries;
}
