import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";

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
    <article className="mx-auto max-w-3xl px-4 py-14">
      <header className="hero-glow mb-8">
        {post.category && (
          <Link href={`/category/${post.category.slug}`}>
            <Badge tone="accent">{post.category.name}</Badge>
          </Link>
        )}
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="size-4" />
            {post.author.name}
          </span>
          {post.publishedAt && (
            <time className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {post.publishedAt.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </div>
      </header>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="mb-10 aspect-video w-full rounded-2xl border border-border object-cover"
        />
      )}

      <div
        className="prose prose-zinc max-w-none dark:prose-invert prose-headings:tracking-tight prose-img:rounded-lg prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-blockquote:border-l-primary"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div className="mt-14 border-t border-border pt-6">
        <Link
          href="/blog"
          className={buttonClasses({ variant: "ghost", size: "md" })}
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách bài viết
        </Link>
      </div>
    </article>
  );
}
