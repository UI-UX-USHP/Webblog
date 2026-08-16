"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { toSlug } from "@/lib/slug";

export async function createCategory(name: string): Promise<void> {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Tên chuyên mục trống");
  const slug = toSlug(trimmed) || "chuyen-muc";
  await prisma.category.create({ data: { name: trimmed, slug } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
