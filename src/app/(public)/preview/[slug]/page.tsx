import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnyPost } from "@/lib/post-queries";
import { verifyPreview } from "@/lib/preview";
import PostArticle from "@/components/public/PostArticle";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;
  const post = await getAnyPost(slug);
  if (!post || !verifyPreview(post.id, token)) notFound();

  return <PostArticle post={post} preview />;
}
