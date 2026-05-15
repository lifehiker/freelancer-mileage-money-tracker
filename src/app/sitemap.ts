import type { MetadataRoute } from "next";

import { APP_URL, COMPARE_PAGES, PERSONA_PAGES, ROOT_SEO_PAGES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/pricing", "/faq", "/privacy", "/terms", "/sign-in"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${APP_URL}${route}`,
      lastModified: new Date(),
    })),
    ...Object.keys(ROOT_SEO_PAGES).map((slug) => ({
      url: `${APP_URL}/${slug}`,
      lastModified: new Date(),
    })),
    ...Object.keys(PERSONA_PAGES).map((slug) => ({
      url: `${APP_URL}/for/${slug}`,
      lastModified: new Date(),
    })),
    ...Object.keys(COMPARE_PAGES).map((slug) => ({
      url: `${APP_URL}/compare/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
