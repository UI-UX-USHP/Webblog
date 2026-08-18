import Link from "next/link";
import { FileText, CheckCircle2, FileEdit, FolderTree, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";

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
    { label: "Tổng bài", value: total, icon: FileText },
    { label: "Đã xuất bản", value: published, icon: CheckCircle2 },
    { label: "Bản nháp", value: drafts, icon: FileEdit },
    { label: "Chuyên mục", value: categories, icon: FolderTree },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <Link
          href="/admin/posts/new"
          className={buttonClasses({ variant: "primary", size: "md" })}
        >
          <Plus className="size-4" />
          Viết bài mới
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold tracking-tight text-primary">
                  {s.value}
                </div>
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Bài viết gần đây</h2>
        <Card className="overflow-hidden">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Chưa có bài viết nào.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/posts/${p.id}/edit`}
                    className="flex items-center justify-between px-5 py-3 transition hover:bg-surface-muted"
                  >
                    <span className="truncate font-medium">{p.title}</span>
                    <Badge
                      tone={p.status === "PUBLISHED" ? "success" : "warning"}
                      className="ml-4 shrink-0"
                    >
                      {p.status === "PUBLISHED" ? "Đã đăng" : "Nháp"}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
