import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = process.env.AUTH_URL ?? "http://localhost:26105";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/portfolio",
    "/about",
  ].map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly", priority: 0.7 }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/post/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
