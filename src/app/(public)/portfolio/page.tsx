import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/public/PostCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Các dự án và sản phẩm cá nhân của USHP.",
};

export default async function PortfolioPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", category: { slug: "portfolio" } },
    orderBy: { publishedAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Portfolio</h1>
        <p className="mt-3 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Một vài dự án, sản phẩm và thử nghiệm mình đã và đang thực hiện.
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500 dark:border-neutral-700">
          Chưa có dự án nào. Hãy thêm bài viết vào chuyên mục “Portfolio”.
        </p>
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
