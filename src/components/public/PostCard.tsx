import Link from "next/link";

type PostCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
};

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <Link href={`/post/${post.slug}`}>
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="aspect-video w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400 dark:from-neutral-800 dark:to-neutral-900">
            USHP
          </div>
        )}
      </Link>
      <div className="p-5">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="text-xs font-medium uppercase tracking-wide text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            {post.category.name}
          </Link>
        )}
        <h3 className="mt-1 text-lg font-semibold leading-snug">
          <Link
            href={`/post/${post.slug}`}
            className="hover:underline"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {post.excerpt}
        </p>
        {post.publishedAt && (
          <time className="mt-3 block text-xs text-neutral-400">
            {post.publishedAt.toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </div>
    </article>
  );
}
