"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
        />
        <button
          onClick={add}
          disabled={isPending}
          className="rounded-lg bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Thêm
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <span className="font-medium">{c.name}</span>
              <span className="ml-2 text-sm text-neutral-500">
                /{c.slug} · {c._count.posts} bài
              </span>
            </div>
            <button
              onClick={() => remove(c.id, c._count.posts)}
              disabled={isPending}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
