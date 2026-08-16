"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { savePost, type SavePostInput } from "@/actions/posts";

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  initial?: {
    id: string;
    title: string;
    categoryId: string | null;
    status: "DRAFT" | "PUBLISHED";
    contentHtml: string;
    coverImage: string | null;
    excerpt: string;
  };
};

export default function PostForm({ categories, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [contentHtml, setContentHtml] = useState(initial?.contentHtml ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);

  function submit(status: "DRAFT" | "PUBLISHED") {
    setError("");
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề.");
      return;
    }
    const payload: SavePostInput = {
      id: initial?.id,
      title,
      categoryId: categoryId || null,
      status,
      contentHtml,
      coverImage: coverImage || null,
      excerpt,
    };
    startTransition(async () => {
      try {
        await savePost(payload);
        router.push("/admin/posts");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại");
      }
    });
  }

  async function uploadCover(file: File) {
    setUploadingCover(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploadingCover(false);
    if (!res.ok) {
      setError("Tải ảnh bìa thất bại");
      return;
    }
    const { url } = await res.json();
    setCoverImage(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Cột chính */}
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề bài viết"
          className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-xl font-semibold text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <TiptapEditor value={contentHtml} onChange={setContentHtml} />
      </div>

      {/* Cột phụ */}
      <aside className="space-y-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <label className="mb-1 block text-sm font-medium">Chuyên mục</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <option value="">— Chưa phân loại —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Mô tả ngắn (excerpt)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Để trống sẽ tự lấy từ nội dung"
              className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="block text-sm font-medium">Ảnh bìa</label>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt="cover"
              className="aspect-video w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-100 text-sm text-neutral-400 dark:bg-neutral-800">
              Chưa có ảnh
            </div>
          )}
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer rounded-lg border border-neutral-300 px-3 py-2 text-center text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
              {uploadingCover ? "Đang tải…" : "Chọn ảnh"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadCover(f);
                  e.target.value = "";
                }}
              />
            </label>
            {coverImage && (
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-950/30"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => submit("PUBLISHED")}
            className="rounded-lg bg-neutral-900 px-4 py-2.5 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            {isPending ? "Đang lưu…" : "Xuất bản"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => submit("DRAFT")}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 font-medium transition hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Lưu nháp
          </button>
        </div>
      </aside>
    </div>
  );
}
