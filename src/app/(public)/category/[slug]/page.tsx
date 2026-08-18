import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/public/PostCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Không tìm thấy" };
  return {
    title: category.name,
    description: `Các bài viết thuộc chuyên mục ${category.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { category: { select: { name: true, slug: true } } },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Chuyên mục
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            {category.name}
          </h1>
        </header>
        {category.posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Chưa có bài viết trong chuyên mục này.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
