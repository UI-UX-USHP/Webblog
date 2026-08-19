"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { SETTING_KEYS } from "@/lib/settings";

/** Lưu cấu hình tích hợp. Chỉ nhận các key hợp lệ trong SETTING_KEYS. */
export async function saveSettings(
  data: Record<string, string>,
): Promise<void> {
  await requireAdmin();

  const entries = SETTING_KEYS.filter((k) => k in data).map((k) => ({
    key: k,
    value: (data[k] ?? "").trim(),
  }));

  await prisma.$transaction(
    entries.map((e) =>
      prisma.siteSetting.upsert({
        where: { key: e.key },
        update: { value: e.value },
        create: e,
      }),
    ),
  );

  // Script nhúng ở root layout → làm mới toàn bộ route dưới layout.
  revalidatePath("/", "layout");
}
