import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/post-queries";

export const revalidate = 3600; // làm mới feed mỗi giờ (hoặc on-demand khi lưu bài)

const BASE = process.env.AUTH_URL ?? "http://localhost:26105";
const SITE_NAME = "USHP — Weblog cá nhân";
const SITE_DESC =
  "Chia sẻ về công nghệ, lập trình, đời sống, portfolio và giáo dục.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: publishedFilter(),
    orderBy: { publishedAt: "desc" },
    take: 30,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      category: { select: { name: true } },
    },
  });

  const items = posts
    .map((p) => {
      const url = `${BASE}/post/${p.slug}`;
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      ${p.category ? `<category>${escapeXml(p.category.name)}</category>` : ""}
      ${p.publishedAt ? `<pubDate>${p.publishedAt.toUTCString()}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${BASE}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>vi</language>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
