import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Viết bài mới</h1>
      <PostForm categories={categories} />
    </div>
  );
}
