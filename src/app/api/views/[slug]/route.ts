import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Tăng lượt xem tổng + lượt xem theo ngày cho bài viết đã xuất bản. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!post) return NextResponse.json({ ok: false }, { status: 404 });

  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  await prisma.$transaction([
    prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.postView.upsert({
      where: { postId_date: { postId: post.id, date } },
      update: { count: { increment: 1 } },
      create: { postId: post.id, date, count: 1 },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
