import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-neutral-500 sm:flex-row">
        <p>© {new Date().getFullYear()} USHP · ushp.name.vn</p>
        <div className="flex gap-4">
          <Link href="/blog" className="hover:text-neutral-900 dark:hover:text-white">
            Bài viết
          </Link>
          <Link href="/portfolio" className="hover:text-neutral-900 dark:hover:text-white">
            Portfolio
          </Link>
          <Link href="/about" className="hover:text-neutral-900 dark:hover:text-white">
            Giới thiệu
          </Link>
        </div>
      </div>
    </footer>
  );
}
