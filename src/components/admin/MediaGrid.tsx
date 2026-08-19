"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Copy } from "lucide-react";
import { deleteUpload } from "@/actions/media";

type File = { name: string; url: string; size: number };

function kb(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function MediaGrid({ files }: { files: File[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove(name: string) {
    if (!confirm(`Xóa ảnh "${name}"? Các bài đang dùng ảnh này sẽ bị lỗi ảnh.`))
      return;
    startTransition(async () => {
      await deleteUpload(name);
      router.refresh();
    });
  }

  if (files.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Chưa có ảnh nào trong thư viện.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {files.map((f) => (
        <div
          key={f.name}
          className="group overflow-hidden rounded-xl border border-border bg-surface"
        >
          <div className="relative aspect-square bg-surface-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.url}
              alt={f.name}
              className="size-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(f.url)}
                title="Copy đường dẫn"
                className="grid size-9 place-items-center rounded-lg bg-white/90 text-zinc-900 transition hover:bg-white"
              >
                <Copy className="size-4" />
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => remove(f.name)}
                title="Xóa ảnh"
                className="grid size-9 place-items-center rounded-lg bg-red-500/90 text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <div className="truncate px-3 py-2 text-xs text-muted-foreground">
            {kb(f.size)}
          </div>
        </div>
      ))}
    </div>
  );
}
