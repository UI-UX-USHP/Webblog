import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, List, Eye } from "lucide-react";
import { buildToc } from "@/lib/content";
import { highlightHtml } from "@/lib/highlight";
import { getSettings } from "@/lib/settings";
import { getRelated, type FullPost } from "@/lib/post-queries";
import Badge from "@/components/ui/Badge";
import PostCard from "@/components/public/PostCard";
import ViewBeacon from "@/components/public/ViewBeacon";
import ReadingProgress from "@/components/public/ReadingProgress";
import Comments from "@/components/public/Comments";
import { buttonClasses } from "@/components/ui/Button";

const BASE = process.env.AUTH_URL ?? "http://localhost:26105";

/** Render đầy đủ 1 bài viết. Dùng chung cho trang công khai và trang xem trước. */
export default async function PostArticle({
  post,
  preview = false,
}: {
  post: FullPost;
  preview?: boolean;
}) {
  const tags = post.tags.map((pt) => pt.tag);
  const { items: toc, html: contentHtml } = buildToc(
    highlightHtml(post.contentHtml),
  );
  const related = await getRelated(
    post.id,
    post.categoryId,
    tags.map((t) => t.slug),
  );

  const settings = await getSettings();
  const showComments =
    !preview &&
    settings.giscusEnabled &&
    Boolean(settings.giscusRepo && settings.giscusRepoId && settings.giscusCategoryId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [`${BASE}${post.coverImage}`] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.author.name },
    mainEntityOfPage: `${BASE}/post/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <ReadingProgress />
      {!preview && <ViewBeacon slug={post.slug} />}
      {!preview && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {preview && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
          <Eye className="size-4" />
          Bản xem trước — bài này{" "}
          {post.status === "DRAFT" ? "còn là nháp" : "chưa tới giờ đăng"}, chỉ ai
          có link này mới xem được.
        </div>
      )}

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
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {post.readingMinutes} phút đọc
          </span>
        </div>
      </header>

      {post.coverImage && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>
      )}

      {toc.length >= 2 && (
        <nav className="mb-10 rounded-xl border border-border bg-surface-muted p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <List className="size-4 text-primary" />
            Mục lục
          </p>
          <ul className="space-y-1.5 text-sm">
            {toc.map((item) => (
              <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
                <a
                  href={`#${item.id}`}
                  className="text-muted-foreground transition hover:text-primary"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div
        className="prose prose-zinc max-w-none dark:prose-invert prose-headings:tracking-tight prose-headings:scroll-mt-24 prose-img:rounded-lg prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-blockquote:border-l-primary"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {tags.map((t) => (
            <Link key={t.slug} href={`/tag/${t.slug}`}>
              <Badge tone="neutral" className="transition hover:text-primary">
                #{t.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-14 border-t border-border pt-6">
        <Link
          href="/blog"
          className={buttonClasses({ variant: "ghost", size: "md" })}
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách bài viết
        </Link>
      </div>

      {showComments && (
        <section className="mt-16">
          <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)]" />
            Bình luận
          </h2>
          <Comments
            repo={settings.giscusRepo}
            repoId={settings.giscusRepoId}
            category={settings.giscusCategory}
            categoryId={settings.giscusCategoryId}
          />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)]" />
            Bài viết liên quan
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
