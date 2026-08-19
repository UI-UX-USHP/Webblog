import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/post-queries";
import PostCard from "@/components/public/PostCard";
import SearchBox from "@/components/public/SearchBox";
import Pagination from "@/components/public/Pagination";

export const metadata: Metadata = {
  title: "Tất cả bài viết",
  description: "Danh sách toàn bộ bài viết trên weblog USHP.",
};

const PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.PostWhereInput = {
    ...publishedFilter(),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
          ],
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        readingMinutes: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Tất cả bài viết
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {q
                ? `Kết quả cho “${q}” — ${total} bài viết.`
                : "Toàn bộ bài viết đã xuất bản trên weblog."}
            </p>
          </div>
          <SearchBox defaultValue={q} />
        </header>

        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            {q ? "Không tìm thấy bài viết phù hợp." : "Chưa có bài viết nào."}
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} query={q} />
          </>
        )}
      </div>
    </div>
  );
}
