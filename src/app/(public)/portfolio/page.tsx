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
    <div className="hero-glow">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <section className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Portfolio
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Một vài dự án, sản phẩm và thử nghiệm mình đã và đang thực hiện.
          </p>
        </section>

        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
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
    </div>
  );
}
