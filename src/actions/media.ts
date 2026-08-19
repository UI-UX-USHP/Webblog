"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/require-admin";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** Xóa một file trong public/uploads. Kiểm tra tên chặt để tránh path traversal. */
export async function deleteUpload(filename: string): Promise<void> {
  await requireAdmin();

  if (!/^[\w.-]+$/.test(filename) || filename.includes("..")) {
    throw new Error("Tên file không hợp lệ");
  }
  const target = path.join(UPLOAD_DIR, filename);
  if (path.dirname(target) !== UPLOAD_DIR) {
    throw new Error("Đường dẫn không hợp lệ");
  }

  await unlink(target).catch(() => {});
  revalidatePath("/admin/media");
}
