import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeletePostButton from "@/components/admin/DeletePostButton";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Bài viết</h1>
        <Link
          href="/admin/posts/new"
          className={buttonClasses({ variant: "primary", size: "md" })}
        >
          <Plus className="size-4" />
          Viết bài mới
        </Link>
      </div>

      <Card className="overflow-x-auto">
        {posts.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            Chưa có bài viết. Bấm “Viết bài mới” để bắt đầu.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Tiêu đề</th>
                <th className="px-5 py-3 font-medium">Chuyên mục</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium">Cập nhật</th>
                <th className="px-5 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p.id} className="transition hover:bg-surface-muted">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="font-medium transition hover:text-primary"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {p.category?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      tone={p.status === "PUBLISHED" ? "success" : "warning"}
                    >
                      {p.status === "PUBLISHED" ? "Đã đăng" : "Nháp"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {p.updatedAt.toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/posts/${p.id}/edit`}
                        className="text-sm text-muted-foreground transition hover:text-primary"
                      >
                        Sửa
                      </Link>
                      <DeletePostButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
