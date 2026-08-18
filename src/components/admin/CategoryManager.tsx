"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createCategory, deleteCategory } from "@/actions/categories";

type Category = { id: string; name: string; slug: string; _count: { posts: number } };

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function add() {
    if (!name.trim()) return;
    setError("");
    startTransition(async () => {
      try {
        await createCategory(name);
        setName("");
        router.refresh();
      } catch {
        setError("Không thêm được (có thể trùng tên).");
      }
    });
  }

  function remove(id: string, count: number) {
    const msg =
      count > 0
        ? `Chuyên mục còn ${count} bài. Xóa sẽ chuyển các bài về "Chưa phân loại". Tiếp tục?`
        : "Xóa chuyên mục này?";
    if (!confirm(msg)) return;
    startTransition(async () => {
      await deleteCategory(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Tên chuyên mục mới"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
        />
        <Button onClick={add} disabled={isPending}>
          Thêm
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <span className="font-medium">{c.name}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                /{c.slug} · {c._count.posts} bài
              </span>
            </div>
            <button
              onClick={() => remove(c.id, c._count.posts)}
              disabled={isPending}
              className="text-sm text-red-600 transition hover:underline disabled:opacity-50 dark:text-red-400"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
