"use server";

import { marked } from "marked";
import { requireAdmin } from "@/lib/require-admin";
import { savePost } from "@/actions/posts";

/** Tạo bài nháp mới từ nội dung Markdown. Trả về slug bài vừa tạo. */
export async function importMarkdown(
  title: string,
  markdown: string,
): Promise<string> {
  await requireAdmin();
  const t = title.trim();
  if (!t) throw new Error("Vui lòng nhập tiêu đề");

  const html = await marked.parse(markdown ?? "");

  // savePost tự sanitize, tính thời gian đọc và sinh slug.
  return savePost({
    title: t,
    categoryId: null,
    status: "DRAFT",
    contentHtml: html,
    coverImage: null,
  });
}
