"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/actions/posts";

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Xóa bài viết này? Hành động không thể hoàn tác.")) return;
        startTransition(async () => {
          await deletePost(id);
          router.refresh();
        });
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Đang xóa…" : "Xóa"}
    </button>
  );
}
