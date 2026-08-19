import slugify from "slugify";

/** Bỏ toàn bộ thẻ HTML, trả về text thuần đã gọn khoảng trắng. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Ước lượng thời gian đọc (phút) — ~200 từ/phút, tối thiểu 1 phút. */
export function readingMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * Trích mục lục từ H2/H3 và chèn `id` (slug) vào chính HTML để anchor nhảy đúng.
 * Trả về danh sách mục lục + HTML đã gắn id. Dùng lúc render trang bài.
 */
export function buildToc(html: string): { items: TocItem[]; html: string } {
  const items: TocItem[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return match;

      const level = tag.toLowerCase() === "h2" ? 2 : 3;
      let id = slugify(text, { lower: true, strict: true, locale: "vi" }) || "muc";
      let n = 2;
      while (used.has(id)) id = `${id}-${n++}`;
      used.add(id);

      items.push({ id, text, level });

      // Giữ id sẵn có nếu đã có, ngược lại chèn id mới vào thẻ mở.
      if (/\sid=/.test(attrs)) return match;
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );

  return { items, html: withIds };
}
