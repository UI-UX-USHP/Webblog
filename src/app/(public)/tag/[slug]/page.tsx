import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag as TagIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/post-queries";
import PostCard from "@/components/public/PostCard";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return { title: "Không tìm thấy" };
  return {
    title: `#${tag.name}`,
    description: `Các bài viết gắn thẻ ${tag.name}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { post: publishedFilter() },
        orderBy: { post: { publishedAt: "desc" } },
        include: {
          post: {
            include: { category: { select: { name: true, slug: true } } },
          },
        },
      },
    },
  });

  if (!tag) notFound();

  const posts = tag.posts.map((pt) => pt.post);

  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10">
          <p className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-primary">
            <TagIcon className="size-4" />
            Thẻ
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            #{tag.name}
          </h1>
        </header>
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Chưa có bài viết nào gắn thẻ này.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
