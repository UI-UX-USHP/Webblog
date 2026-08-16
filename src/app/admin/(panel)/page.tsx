import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [total, published, drafts, categories, recent] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.category.count(),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { category: true },
    }),
  ]);

  const stats = [
    { label: "Tổng bài", value: total },
    { label: "Đã xuất bản", value: published },
    { label: "Bản nháp", value: drafts },
    { label: "Chuyên mục", value: categories },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
        >
          + Viết bài mới
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-sm text-neutral-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Bài viết gần đây</h2>
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-neutral-500">Chưa có bài viết nào.</p>
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/posts/${p.id}/edit`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    <span className="truncate font-medium">{p.title}</span>
                    <span
                      className={`ml-4 shrink-0 rounded-full px-2 py-0.5 text-xs ${
                        p.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      }`}
                    >
                      {p.status === "PUBLISHED" ? "Đã đăng" : "Nháp"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
