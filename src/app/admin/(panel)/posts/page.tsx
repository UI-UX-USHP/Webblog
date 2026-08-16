import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeletePostButton from "@/components/admin/DeletePostButton";

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bài viết</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
        >
          + Viết bài mới
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {posts.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">
            Chưa có bài viết. Bấm “Viết bài mới” để bắt đầu.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
              <tr>
                <th className="px-5 py-3 font-medium">Tiêu đề</th>
                <th className="px-5 py-3 font-medium">Chuyên mục</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium">Cập nhật</th>
                <th className="px-5 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {p.category?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        p.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      }`}
                    >
                      {p.status === "PUBLISHED" ? "Đã đăng" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {p.updatedAt.toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/posts/${p.id}/edit`}
                        className="text-sm text-neutral-700 hover:underline dark:text-neutral-300"
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
      </div>
    </div>
  );
}
