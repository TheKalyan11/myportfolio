import type { MetadataRoute } from "next";
import { LAST_UPDATED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/music`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.4 },
  ];
}
