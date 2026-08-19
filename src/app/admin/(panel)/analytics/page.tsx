import Link from "next/link";
import { Eye, CalendarRange, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ViewsChart from "@/components/admin/ViewsChart";

/** 30 ngày gần nhất dạng "YYYY-MM-DD" (UTC), khớp với cách beacon ghi ngày. */
function last30Dates(): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export default async function AnalyticsPage() {
  const dates = last30Dates();
  const start = dates[0];

  const [agg, topPosts, daily] = await Promise.all([
    prisma.post.aggregate({ _sum: { viewCount: true } }),
    prisma.post.findMany({
      orderBy: { viewCount: "desc" },
      take: 10,
      select: { id: true, title: true, slug: true, viewCount: true, status: true },
    }),
    prisma.postView.groupBy({
      by: ["date"],
      _sum: { count: true },
      where: { date: { gte: start } },
    }),
  ]);

  const map = new Map(daily.map((d) => [d.date, d._sum.count ?? 0]));
  const series = dates.map((date) => ({ date, count: map.get(date) ?? 0 }));
  const total = agg._sum.viewCount ?? 0;
  const last30 = series.reduce((s, d) => s + d.count, 0);

  const stats = [
    { label: "Tổng lượt xem", value: total, icon: Eye },
    { label: "30 ngày gần đây", value: last30, icon: CalendarRange },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Thống kê</h1>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold tracking-tight text-primary">
                  {s.value.toLocaleString("vi-VN")}
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
        <h2 className="mb-3 text-lg font-semibold">Lượt xem 30 ngày qua</h2>
        <Card className="p-5">
          <ViewsChart data={series} />
        </Card>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="size-5 text-primary" />
          Bài viết nhiều lượt xem nhất
        </h2>
        <Card className="overflow-hidden">
          {topPosts.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Chưa có dữ liệu lượt xem.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {topPosts.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-center gap-4 px-5 py-3 transition hover:bg-surface-muted"
                >
                  <span className="w-5 shrink-0 text-center text-sm font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <Link
                    href={`/admin/posts/${p.id}/edit`}
                    className="flex-1 truncate font-medium transition hover:text-primary"
                  >
                    {p.title}
                  </Link>
                  {p.status === "DRAFT" && (
                    <Badge tone="warning" className="shrink-0">
                      Nháp
                    </Badge>
                  )}
                  <span className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                    <Eye className="size-4" />
                    {p.viewCount.toLocaleString("vi-VN")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
