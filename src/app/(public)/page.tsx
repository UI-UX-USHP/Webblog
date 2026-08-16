import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/public/PostCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 9,
    include: { category: { select: { name: true, slug: true } } },
  });

  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Xin chào, mình là USHP 👋
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Nơi mình ghi lại những điều học được về công nghệ, lập trình, đời sống,
          và các dự án cá nhân. Cảm ơn bạn đã ghé thăm.
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500 dark:border-neutral-700">
          Chưa có bài viết nào được xuất bản. Hãy vào{" "}
          <Link href="/admin" className="underline">
            trang quản trị
          </Link>{" "}
          để viết bài đầu tiên.
        </p>
      ) : (
        <>
          {/* Bài nổi bật */}
          {featured && (
            <section className="mb-12">
              <Link
                href={`/post/${featured.slug}`}
                className="group grid gap-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white md:grid-cols-2 dark:border-neutral-800 dark:bg-neutral-900"
              >
                {featured.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="h-full min-h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex min-h-56 items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-2xl font-bold text-neutral-400 dark:from-neutral-800 dark:to-neutral-900">
                    USHP
                  </div>
                )}
                <div className="flex flex-col justify-center p-6">
                  {featured.category && (
                    <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      {featured.category.name}
                    </span>
                  )}
                  <h2 className="mt-2 text-2xl font-bold group-hover:underline">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-neutral-600 dark:text-neutral-400">
                    {featured.excerpt}
                  </p>
                </div>
              </Link>
            </section>
          )}

          {/* Lưới bài viết */}
          {rest.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Bài viết mới nhất</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-block rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Xem tất cả bài viết →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
