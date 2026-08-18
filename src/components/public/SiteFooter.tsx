import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-sm font-bold text-white">
              U
            </span>
            <span className="text-lg font-bold tracking-tight">USHP</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Weblog cá nhân về công nghệ, lập trình, đời sống và các dự án cá
            nhân.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Nội dung</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/blog" className="transition hover:text-foreground">
                Bài viết
              </Link>
            </li>
            <li>
              <Link
                href="/portfolio"
                className="transition hover:text-foreground"
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-foreground">
                Giới thiệu
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Liên hệ</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>ushp.name.vn</li>
            <li>admin@ushp.name.vn</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-5 text-sm text-muted-foreground">
          © {new Date().getFullYear()} USHP · ushp.name.vn
        </div>
      </div>
    </footer>
  );
}
