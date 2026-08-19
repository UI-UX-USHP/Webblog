"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, ExternalLink, Download } from "lucide-react";
import TiptapEditor from "@/components/editor/TiptapEditor";
import Button from "@/components/ui/Button";
import { savePost, type SavePostInput } from "@/actions/posts";

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  initial?: {
    id: string;
    title: string;
    slug?: string;
    categoryId: string | null;
    status: "DRAFT" | "PUBLISHED";
    contentHtml: string;
    coverImage: string | null;
    excerpt: string;
    tagNames?: string[];
    publishedAt?: string | null;
    previewToken?: string;
  };
};

/** ISO → "YYYY-MM-DDTHH:mm" theo giờ địa phương cho input datetime-local. */
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PostForm({ categories, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [contentHtml, setContentHtml] = useState(initial?.contentHtml ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tagNames ?? []);
  const [tagInput, setTagInput] = useState("");
  const [publishAt, setPublishAt] = useState(toLocalInput(initial?.publishedAt));
  const [uploadingCover, setUploadingCover] = useState(false);

  const previewUrl =
    initial?.slug && initial?.previewToken
      ? `/preview/${initial.slug}?token=${initial.previewToken}`
      : null;

  function addTag(raw: string) {
    const parts = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    setTags((prev) => [...new Set([...prev, ...parts])].slice(0, 20));
    setTagInput("");
  }

  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

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
      tagNames: tags,
      publishedAt: publishAt ? new Date(publishAt).toISOString() : null,
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
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-xl font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
        />
        <TiptapEditor value={contentHtml} onChange={setContentHtml} />
      </div>

      {/* Cột phụ */}
      <aside className="space-y-5">
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Chuyên mục</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
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
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Thẻ (tags)</label>
            {tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                      className="transition hover:text-primary-hover"
                      aria-label={`Xóa thẻ ${t}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              onBlur={() => addTag(tagInput)}
              placeholder="Nhập rồi Enter hoặc dấu phẩy"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <label className="block text-sm font-medium">Ảnh bìa</label>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt="cover"
              className="aspect-video w-full rounded-lg border border-border object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-surface-muted text-sm text-muted-foreground">
              Chưa có ảnh
            </div>
          )}
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer rounded-lg border border-border px-3 py-2 text-center text-sm transition hover:bg-surface-muted">
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
                className="rounded-lg border border-border px-3 py-2 text-sm text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Thời gian đăng
            </label>
            <input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Đặt tương lai = hẹn giờ đăng. Trống = đăng ngay khi bấm Xuất bản.
            </p>
          </div>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="size-4" />
              Xem trước (link chia sẻ được)
            </a>
          )}
          {initial?.id && (
            <a
              href={`/api/posts/${initial.id}/markdown`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Download className="size-4" />
              Xuất Markdown
            </a>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            disabled={isPending}
            onClick={() => submit("PUBLISHED")}
          >
            {isPending ? "Đang lưu…" : "Xuất bản"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => submit("DRAFT")}
          >
            Lưu nháp
          </Button>
        </div>
      </aside>
    </div>
  );
}
