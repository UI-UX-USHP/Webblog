import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/public/PostCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tất cả bài viết",
  description: "Danh sách toàn bộ bài viết trên weblog USHP.",
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });

  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Tất cả bài viết
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Toàn bộ bài viết đã xuất bản trên weblog.
          </p>
        </header>
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Chưa có bài viết nào.
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
