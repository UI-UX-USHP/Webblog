import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, author: { select: { name: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Tăng lượt xem (không chặn render)
  prisma.post
    .update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="text-sm font-medium uppercase tracking-wide text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            {post.category.name}
          </Link>
        )}
        <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
          <span>{post.author.name}</span>
          {post.publishedAt && (
            <>
              <span>·</span>
              <time>
                {post.publishedAt.toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </>
          )}
        </div>
      </header>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="mb-8 aspect-video w-full rounded-xl object-cover"
        />
      )}

      <div
        className="prose prose-neutral max-w-none dark:prose-invert prose-img:rounded-lg prose-pre:bg-neutral-900"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div className="mt-12 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <Link href="/blog" className="text-sm text-neutral-500 hover:underline">
          ← Quay lại danh sách bài viết
        </Link>
      </div>
    </article>
  );
}
