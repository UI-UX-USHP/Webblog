import { Search } from "lucide-react";

/** Ô tìm kiếm — form GET thuần, hoạt động cả khi không có JS. */
export default function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/blog" method="get" className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Tìm bài viết…"
        aria-label="Tìm bài viết"
        className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
      />
    </form>
  );
}
