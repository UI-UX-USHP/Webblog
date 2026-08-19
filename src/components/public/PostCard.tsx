import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";

type PostCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  readingMinutes?: number;
  category: { name: string; slug: string } | null;
};

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <Link
        href={`/post/${post.slug}`}
        className="relative block aspect-video overflow-hidden"
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-2xl font-bold text-white/90">
            USHP
          </div>
        )}
      </Link>
      <div className="p-5">
        {post.category && (
          <Link href={`/category/${post.category.slug}`}>
            <Badge tone="accent">{post.category.name}</Badge>
          </Link>
        )}
        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
          <Link
            href={`/post/${post.slug}`}
            className="transition group-hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          {post.publishedAt && (
            <time className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {post.publishedAt.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {post.readingMinutes ? (
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {post.readingMinutes} phút đọc
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
