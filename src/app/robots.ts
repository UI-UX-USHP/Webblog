import type { MetadataRoute } from "next";

const BASE = process.env.AUTH_URL ?? "http://localhost:26105";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
