import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Điều kiện "đã xuất bản & tới giờ đăng" — dùng cho mọi truy vấn công khai. */
export function publishedFilter(): Prisma.PostWhereInput {
  return { status: "PUBLISHED", publishedAt: { lte: new Date() } };
}

const postInclude = {
  category: true,
  author: { select: { name: true } },
  tags: { include: { tag: { select: { name: true, slug: true } } } },
} satisfies Prisma.PostInclude;

export type FullPost = Prisma.PostGetPayload<{ include: typeof postInclude }>;

/** Bài đã xuất bản (đã tới giờ đăng). Cache theo render. */
export const getPublishedPost = cache((slug: string) =>
  prisma.post.findFirst({
    where: { slug, ...publishedFilter() },
    include: postInclude,
  }),
);

/** Bài bất kỳ theo slug (dùng cho xem trước bản nháp/hẹn giờ). */
export const getAnyPost = cache((slug: string) =>
  prisma.post.findUnique({ where: { slug }, include: postInclude }),
);

/** 3 bài liên quan theo tag chung hoặc cùng chuyên mục. */
export async function getRelated(
  postId: string,
  categoryId: string | null,
  tagSlugs: string[],
) {
  const or: Prisma.PostWhereInput[] = [];
  if (categoryId) or.push({ categoryId });
  if (tagSlugs.length) {
    or.push({ tags: { some: { tag: { slug: { in: tagSlugs } } } } });
  }

  return prisma.post.findMany({
    where: {
      ...publishedFilter(),
      id: { not: postId },
      ...(or.length ? { OR: or } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      readingMinutes: true,
      category: { select: { name: true, slug: true } },
    },
  });
}
