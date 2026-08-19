import TurndownService from "turndown";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Xuất bài viết ra Markdown (.md) — chỉ admin. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      contentHtml: true,
      publishedAt: true,
    },
  });
  if (!post) return new Response("Not found", { status: 404 });

  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });
  const front =
    `---\n` +
    `title: ${post.title}\n` +
    `slug: ${post.slug}\n` +
    `date: ${post.publishedAt?.toISOString() ?? ""}\n` +
    `excerpt: ${post.excerpt.replace(/\n/g, " ")}\n` +
    `---\n\n`;
  const md = front + td.turndown(post.contentHtml || "") + "\n";

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${post.slug}.md"`,
    },
  });
}
