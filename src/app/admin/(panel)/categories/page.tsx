import { prisma } from "@/lib/prisma";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Chuyên mục</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
