import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sửa bài viết</h1>
      <PostForm
        categories={categories}
        initial={{
          id: post.id,
          title: post.title,
          categoryId: post.categoryId,
          status: post.status,
          contentHtml: post.contentHtml,
          coverImage: post.coverImage,
          excerpt: post.excerpt,
        }}
      />
    </div>
  );
}
