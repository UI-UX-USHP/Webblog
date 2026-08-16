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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Tất cả bài viết</h1>
      {posts.length === 0 ? (
        <p className="text-neutral-500">Chưa có bài viết nào.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
