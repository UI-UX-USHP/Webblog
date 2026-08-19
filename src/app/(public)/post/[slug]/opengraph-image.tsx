import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "USHP Weblog";

/** Tải font hỗ trợ tiếng Việt cho ảnh OG; lỗi thì fallback font mặc định. */
async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700",
      { headers: { "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0)" } },
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, category: { select: { name: true } } },
  });

  const title = post?.title ?? "USHP Weblog";
  const category = post?.category?.name;
  const font = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0b0b12 0%, #1e1b4b 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            }}
          >
            U
          </div>
          USHP.name.vn
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {category && (
            <div style={{ fontSize: 30, color: "#a5b4fc", display: "flex" }}>
              {category}
            </div>
          )}
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.15, display: "flex" }}>
            {title}
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#a1a1aa", display: "flex" }}>
          Weblog cá nhân · công nghệ, lập trình, đời sống
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Be Vietnam Pro", data: font, weight: 700 as const, style: "normal" as const }]
        : undefined,
    },
  );
}
