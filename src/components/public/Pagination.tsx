import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

type Props = {
  page: number;
  totalPages: number;
  query?: string;
};

/** Phân trang cho /blog (Trước / số trang / Sau), giữ nguyên từ khóa tìm kiếm. */
export default function Pagination({ page, totalPages, query = "" }: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  const disabled = "pointer-events-none opacity-40";

  return (
    <nav className="mt-12 flex items-center justify-center gap-3">
      <Link
        href={href(page - 1)}
        aria-disabled={page <= 1}
        className={`${buttonClasses({ variant: "outline", size: "md" })} ${page <= 1 ? disabled : ""}`}
      >
        <ChevronLeft className="size-4" />
        Trước
      </Link>
      <span className="text-sm text-muted-foreground">
        Trang {page} / {totalPages}
      </span>
      <Link
        href={href(page + 1)}
        aria-disabled={page >= totalPages}
        className={`${buttonClasses({ variant: "outline", size: "md" })} ${page >= totalPages ? disabled : ""}`}
      >
        Sau
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
