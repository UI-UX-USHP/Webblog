import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MobileNav from "./MobileNav";

export default async function SiteHeader() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  const links = [
    { href: "/blog", label: "Bài viết" },
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
    { href: "/about", label: "Giới thiệu" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-sm font-bold text-white shadow-[var(--shadow-soft)]">
            U
          </span>
          <span className="text-lg font-bold tracking-tight">
            USHP<span className="text-muted-foreground">.name.vn</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <MobileNav links={links} />
      </div>
    </header>
  );
}
