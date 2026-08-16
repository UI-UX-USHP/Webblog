import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignOutButton from "@/components/admin/SignOutButton";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const nav = [
    { href: "/admin", label: "Tổng quan" },
    { href: "/admin/posts", label: "Bài viết" },
    { href: "/admin/posts/new", label: "Viết bài mới" },
    { href: "/admin/categories", label: "Chuyên mục" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-950">
      <aside className="flex w-60 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <Link href="/admin" className="text-lg font-bold">
            USHP Admin
          </Link>
          <p className="truncate text-xs text-neutral-500">
            {session.user.email}
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
          <Link
            href="/"
            target="_blank"
            className="mb-2 block rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            ↗ Xem trang chủ
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
