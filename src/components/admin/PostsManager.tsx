"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { buttonClasses } from "@/components/ui/Button";
import { bulkPosts } from "@/actions/posts";

type Row = {
  id: string;
  title: string;
  categoryName: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  updatedAt: string;
};

export default function PostsManager({ posts }: { posts: Row[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const allChecked = posts.length > 0 && selected.size === posts.length;

  function toggleAll() {
    setSelected(allChecked ? new Set() : new Set(posts.map((p) => p.id)));
  }
  function toggle(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function run(action: "publish" | "draft" | "delete") {
    if (selected.size === 0) return;
    if (action === "delete" && !confirm(`Xóa ${selected.size} bài đã chọn?`))
      return;
    const ids = [...selected];
    startTransition(async () => {
      await bulkPosts(ids, action);
      setSelected(new Set());
      router.refresh();
    });
  }

  const now = Date.now();
  function statusBadge(p: Row) {
    if (p.status === "PUBLISHED") {
      if (p.publishedAt && new Date(p.publishedAt).getTime() > now)
        return <Badge tone="accent">Hẹn giờ</Badge>;
      return <Badge tone="success">Đã đăng</Badge>;
    }
    return <Badge tone="warning">Nháp</Badge>;
  }

  if (posts.length === 0) {
    return (
      <Card>
        <p className="p-6 text-sm text-muted-foreground">
          Chưa có bài viết. Bấm “Viết bài mới” để bắt đầu.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-2 text-sm">
          <span className="px-2 font-medium">Đã chọn {selected.size}</span>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run("publish")}
            className={buttonClasses({ variant: "primary", size: "sm" })}
          >
            Xuất bản
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run("draft")}
            className={buttonClasses({ variant: "secondary", size: "sm" })}
          >
            Chuyển nháp
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run("delete")}
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
          >
            Xóa
          </button>
        </div>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="px-5 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  aria-label="Chọn tất cả"
                  className="size-4 accent-[var(--primary)]"
                />
              </th>
              <th className="px-5 py-3 font-medium">Tiêu đề</th>
              <th className="px-5 py-3 font-medium">Chuyên mục</th>
              <th className="px-5 py-3 font-medium">Trạng thái</th>
              <th className="px-5 py-3 font-medium">Cập nhật</th>
              <th className="px-5 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((p) => (
              <tr key={p.id} className="transition hover:bg-surface-muted">
                <td className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                    aria-label={`Chọn ${p.title}`}
                    className="size-4 accent-[var(--primary)]"
                  />
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/posts/${p.id}/edit`}
                    className="font-medium transition hover:text-primary"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {p.categoryName ?? "—"}
                </td>
                <td className="px-5 py-3">{statusBadge(p)}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(p.updatedAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="text-sm text-muted-foreground transition hover:text-primary"
                    >
                      Sửa
                    </Link>
                    <DeletePostButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
