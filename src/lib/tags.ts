import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

/** Tách chuỗi tag người dùng nhập (phân tách bằng dấu phẩy) thành mảng sạch. */
export function parseTagNames(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ].slice(0, 20);
}

/**
 * Đồng bộ tag cho một bài viết: upsert từng tag theo slug rồi thay toàn bộ
 * quan hệ PostTag. Dọn luôn tag mồ côi (không còn bài nào) để danh sách gọn.
 * Chỉ gọi từ server (savePost đã kiểm tra quyền admin).
 */
export async function syncPostTags(postId: string, names: string[]): Promise<void> {
  const clean = names.map((n) => n.trim()).filter(Boolean);

  const tags = await Promise.all(
    clean.map((name) => {
      const slug = toSlug(name) || "tag";
      return prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });
    }),
  );

  await prisma.postTag.deleteMany({ where: { postId } });
  if (tags.length > 0) {
    await prisma.postTag.createMany({
      data: tags.map((t) => ({ postId, tagId: t.id })),
    });
  }

  // Xóa tag không còn bài viết nào tham chiếu.
  await prisma.tag.deleteMany({ where: { posts: { none: {} } } });
}
