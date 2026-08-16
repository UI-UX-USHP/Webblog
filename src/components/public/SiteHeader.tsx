import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SiteHeader() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          USHP<span className="text-neutral-400">.name.vn</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          <Link
            href="/blog"
            className="rounded-lg px-3 py-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            Bài viết
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-lg px-3 py-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            Giới thiệu
          </Link>
        </nav>
      </div>
    </header>
  );
}
