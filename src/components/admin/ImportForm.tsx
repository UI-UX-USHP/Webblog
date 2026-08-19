"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { importMarkdown } from "@/actions/markdown";

export default function ImportForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [md, setMd] = useState("");
  const [error, setError] = useState("");

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setMd(String(reader.result ?? ""));
      if (!title) setTitle(file.name.replace(/\.mdx?$/i, ""));
    };
    reader.readAsText(file);
  }

  function submit() {
    setError("");
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề.");
      return;
    }
    startTransition(async () => {
      try {
        await importMarkdown(title, md);
        router.push("/admin/posts");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Import thất bại");
      }
    });
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-2xl space-y-4">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Tiêu đề</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề bài viết"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Nội dung Markdown
        </label>
        <div className="mb-2">
          <label className="inline-flex cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm transition hover:bg-surface-muted">
            Chọn file .md
            <input
              type="file"
              accept=".md,.markdown,text/markdown"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          rows={16}
          placeholder="# Tiêu đề&#10;&#10;Dán nội dung Markdown ở đây…"
          className={`${inputCls} resize-y font-mono`}
        />
      </div>
      <Button type="button" disabled={isPending} onClick={submit}>
        {isPending ? "Đang import…" : "Import thành bản nháp"}
      </Button>
    </div>
  );
}
