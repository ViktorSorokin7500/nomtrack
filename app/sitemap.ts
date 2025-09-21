import { MetadataRoute } from "next";

const pages = ["", "pricing", "updates", "privacy-security", "help", "support"];

// Генерує sitemap тільки для однієї мови (без i18n)
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.nomtrack.site"; // заміни на свій домен

  const sitemapEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}/${page}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: page === "" ? 1.0 : 0.8, // головна сторінка найважливіша
  }));

  return sitemapEntries;
}
