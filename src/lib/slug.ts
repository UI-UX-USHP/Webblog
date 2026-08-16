import slugify from "slugify";
import { prisma } from "@/lib/prisma";

/** Chuyển tiêu đề thành slug thân thiện URL (hỗ trợ tiếng Việt). */
export function toSlug(input: string): string {
  return slugify(input, {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
}

/**
 * Sinh slug duy nhất cho Post. Nếu trùng thì thêm hậu tố -2, -3, …
 * `excludeId` để bỏ qua chính bài đang sửa.
 */
export async function uniquePostSlug(
  title: string,
  excludeId?: string,
): Promise<string> {
  const base = toSlug(title) || "bai-viet";
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}
