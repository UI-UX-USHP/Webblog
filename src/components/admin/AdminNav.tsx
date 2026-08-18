"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  FolderTree,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Bài viết", icon: FileText, exact: true },
  { href: "/admin/posts/new", label: "Viết bài mới", icon: PenSquare },
  { href: "/admin/categories", label: "Chuyên mục", icon: FolderTree },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3">
      {nav.map((n) => {
        const active = n.exact
          ? pathname === n.href
          : pathname.startsWith(n.href);
        const Icon = n.icon;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
