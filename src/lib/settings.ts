import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  analyticsProvider: "" | "umami" | "plausible" | "ga";
  analyticsSrc: string;
  analyticsSiteId: string;
  giscusEnabled: boolean;
  giscusRepo: string;
  giscusRepoId: string;
  giscusCategory: string;
  giscusCategoryId: string;
  customScriptSrc: string;
  customScriptInline: string;
};

/** Danh sách key được phép lưu (chống ghi key lạ vào bảng SiteSetting). */
export const SETTING_KEYS = [
  "analyticsProvider",
  "analyticsSrc",
  "analyticsSiteId",
  "giscusEnabled",
  "giscusRepo",
  "giscusRepoId",
  "giscusCategory",
  "giscusCategoryId",
  "customScriptSrc",
  "customScriptInline",
] as const;

/** Đọc toàn bộ cấu hình tích hợp (cache trong 1 render). */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await prisma.siteSetting.findMany();
  const m = new Map(rows.map((r) => [r.key, r.value]));
  const g = (k: string) => m.get(k) ?? "";
  const provider = g("analyticsProvider");

  return {
    analyticsProvider: (["umami", "plausible", "ga"].includes(provider)
      ? provider
      : "") as SiteSettings["analyticsProvider"],
    analyticsSrc: g("analyticsSrc"),
    analyticsSiteId: g("analyticsSiteId"),
    giscusEnabled: g("giscusEnabled") === "1",
    giscusRepo: g("giscusRepo"),
    giscusRepoId: g("giscusRepoId"),
    giscusCategory: g("giscusCategory"),
    giscusCategoryId: g("giscusCategoryId"),
    customScriptSrc: g("customScriptSrc"),
    customScriptInline: g("customScriptInline"),
  };
});
