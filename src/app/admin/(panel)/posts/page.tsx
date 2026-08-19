import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PostsManager from "@/components/admin/PostsManager";
import { buttonClasses } from "@/components/ui/Button";

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  const rows = posts.map((p) => ({
    id: p.id,
    title: p.title,
    categoryName: p.category?.name ?? null,
    status: p.status,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Bài viết</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts/import"
            className={buttonClasses({ variant: "secondary", size: "md" })}
          >
            <Upload className="size-4" />
            Import MD
          </Link>
          <Link
            href="/admin/posts/new"
            className={buttonClasses({ variant: "primary", size: "md" })}
          >
            <Plus className="size-4" />
            Viết bài mới
          </Link>
        </div>
      </div>

      <PostsManager posts={rows} />
    </div>
  );
}
