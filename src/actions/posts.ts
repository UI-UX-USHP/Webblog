"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uniquePostSlug } from "@/lib/slug";
import { sanitizeHtml, htmlToExcerpt } from "@/lib/sanitize";
import { readingMinutes } from "@/lib/content";
import { syncPostTags } from "@/lib/tags";

export type SavePostInput = {
  id?: string;
  title: string;
  categoryId: string | null;
  status: "DRAFT" | "PUBLISHED";
  contentHtml: string;
  coverImage: string | null;
  excerpt?: string;
  tagNames?: string[];
  publishedAt?: string | null; // ISO; đặt tương lai để hẹn giờ đăng
};

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/feed.xml");
  if (slug) revalidatePath(`/post/${slug}`);
}

/** Tạo mới hoặc cập nhật bài viết. Trả về slug để redirect. */
export async function savePost(input: SavePostInput): Promise<string> {
  const session = await requireAdmin();

  const title = input.title.trim();
  if (!title) throw new Error("Tiêu đề không được để trống");

  const cleanHtml = sanitizeHtml(input.contentHtml ?? "");
  const excerpt =
    (input.excerpt?.trim() || htmlToExcerpt(cleanHtml)) ?? "";
  const isPublished = input.status === "PUBLISHED";
  const reading = readingMinutes(cleanHtml);
  const chosenDate = input.publishedAt ? new Date(input.publishedAt) : null;

  if (input.id) {
    // Cập nhật
    const existing = await prisma.post.findUnique({
      where: { id: input.id },
      select: { publishedAt: true, slug: true },
    });
    if (!existing) throw new Error("Không tìm thấy bài viết");

    const slug = await uniquePostSlug(title, input.id);
    const post = await prisma.post.update({
      where: { id: input.id },
      data: {
        title,
        slug,
        excerpt,
        contentHtml: cleanHtml,
        coverImage: input.coverImage,
        categoryId: input.categoryId,
        status: input.status,
        readingMinutes: reading,
        publishedAt: isPublished
          ? (chosenDate ?? existing.publishedAt ?? new Date())
          : null,
      },
    });
    await syncPostTags(post.id, input.tagNames ?? []);
    revalidatePublic(post.slug);
    if (existing.slug !== post.slug) revalidatePath(`/post/${existing.slug}`);
    return post.slug;
  }

  // Tạo mới
  const slug = await uniquePostSlug(title);
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      contentHtml: cleanHtml,
      coverImage: input.coverImage,
      categoryId: input.categoryId,
      status: input.status,
      readingMinutes: reading,
      publishedAt: isPublished ? (chosenDate ?? new Date()) : null,
      authorId: session.user.id,
    },
  });
  await syncPostTags(post.id, input.tagNames ?? []);
  revalidatePublic(post.slug);
  return post.slug;
}

/** Xóa bài viết. */
export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  const post = await prisma.post.delete({ where: { id } });
  revalidatePublic(post.slug);
  revalidatePath("/admin/posts");
}

/** Thao tác hàng loạt trên nhiều bài viết cùng lúc. */
export async function bulkPosts(
  ids: string[],
  action: "publish" | "draft" | "delete",
): Promise<void> {
  await requireAdmin();
  if (ids.length === 0) return;

  if (action === "delete") {
    await prisma.post.deleteMany({ where: { id: { in: ids } } });
  } else if (action === "publish") {
    // Bài chưa từng đăng thì đặt thời gian đăng = bây giờ.
    await prisma.post.updateMany({
      where: { id: { in: ids }, publishedAt: null },
      data: { publishedAt: new Date() },
    });
    await prisma.post.updateMany({
      where: { id: { in: ids } },
      data: { status: "PUBLISHED" },
    });
  } else {
    await prisma.post.updateMany({
      where: { id: { in: ids } },
      data: { status: "DRAFT" },
    });
  }

  revalidatePublic();
  revalidatePath("/admin/posts");
}

/** Tạo bài mới nhanh rồi chuyển tới trang sửa. */
export async function saveAndRedirect(input: SavePostInput) {
  const slug = await savePost(input);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
  return slug;
}
