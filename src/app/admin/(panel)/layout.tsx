import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { auth } from "@/auth";
import SignOutButton from "@/components/admin/SignOutButton";
import AdminNav from "@/components/admin/AdminNav";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="flex w-60 flex-col border-r border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-sm font-bold text-white">
              U
            </span>
            <span className="text-lg font-bold tracking-tight">Admin</span>
          </Link>
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {session.user.email}
          </p>
        </div>

        <AdminNav />

        <div className="border-t border-border p-3">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            Xem trang chủ
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
