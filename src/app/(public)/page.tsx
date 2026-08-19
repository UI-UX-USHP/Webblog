import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/post-queries";
import PostCard from "@/components/public/PostCard";
import Badge from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: publishedFilter(),
    orderBy: { publishedAt: "desc" },
    take: 9,
    include: { category: { select: { name: true, slug: true } } },
  });

  const [featured, ...rest] = posts;

  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero */}
        <section className="mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Weblog cá nhân
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            Xin chào, mình là{" "}
            <span className="text-gradient">USHP</span> 👋
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Nơi mình ghi lại những điều học được về công nghệ, lập trình, đời
            sống, và các dự án cá nhân. Cảm ơn bạn đã ghé thăm.
          </p>
        </section>

        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Chưa có bài viết nào được xuất bản. Hãy vào{" "}
            <Link href="/admin" className="font-medium text-primary underline">
              trang quản trị
            </Link>{" "}
            để viết bài đầu tiên.
          </p>
        ) : (
          <>
            {/* Bài nổi bật */}
            {featured && (
              <section className="mb-16">
                <Link
                  href={`/post/${featured.slug}`}
                  className="group grid gap-6 overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:shadow-[var(--shadow-lift)] md:grid-cols-2"
                >
                  {featured.coverImage ? (
                    <div className="relative min-h-60 md:h-full">
                      <Image
                        src={featured.coverImage}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-60 items-center justify-center bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-3xl font-bold text-white/90">
                      USHP
                    </div>
                  )}
                  <div className="flex flex-col justify-center p-7">
                    {featured.category && (
                      <div>
                        <Badge tone="accent">{featured.category.name}</Badge>
                      </div>
                    )}
                    <h2 className="mt-3 text-2xl font-bold tracking-tight transition group-hover:text-primary">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      {featured.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Đọc bài
                      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </section>
            )}

            {/* Lưới bài viết */}
            {rest.length > 0 && (
              <section>
                <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold">
                  <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)]" />
                  Bài viết mới nhất
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className={buttonClasses({ variant: "outline", size: "lg" })}
              >
                Xem tất cả bài viết
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
