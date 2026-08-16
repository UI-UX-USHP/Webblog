import DOMPurify from "isomorphic-dompurify";

/**
 * Làm sạch HTML nhận từ trình soạn thảo Tiptap trước khi lưu vào DB,
 * chặn XSS nhưng vẫn giữ các thẻ định dạng/hình ảnh/liên kết hợp lệ.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "code", "pre",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "hr",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
      "span", "div",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "src", "alt", "title",
      "class", "colspan", "rowspan", "width", "height",
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/** Trích đoạn ngắn (excerpt) từ HTML để hiển thị ở danh sách. */
export function htmlToExcerpt(html: string, maxLen = 180): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}
