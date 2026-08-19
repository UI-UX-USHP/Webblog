import hljs from "highlight.js";

const ENTITIES: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&amp;": "&",
};

/** Giải mã entity HTML về mã nguồn thô để highlight.js xử lý. */
function decode(s: string): string {
  return s.replace(/&(?:lt|gt|quot|#39|amp);/g, (m) => ENTITIES[m] ?? m);
}

/**
 * Tô màu cú pháp cho các khối `<pre><code>` trong HTML đã lưu (chạy phía
 * server lúc render — với ISR chỉ chạy lại mỗi kỳ revalidate). Ngôn ngữ lấy
 * từ class `language-xxx`; không có thì tự đoán.
 */
export function highlightHtml(html: string): string {
  return html.replace(
    /<pre[^>]*><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
    (match, attrs: string, inner: string) => {
      const langMatch = /class="[^"]*language-([\w-]+)/.exec(attrs);
      const lang = langMatch?.[1];
      const code = decode(inner);

      let value: string;
      try {
        value =
          lang && hljs.getLanguage(lang)
            ? hljs.highlight(code, { language: lang }).value
            : hljs.highlightAuto(code).value;
      } catch {
        return match;
      }

      const cls = `hljs${lang ? ` language-${lang}` : ""}`;
      return `<pre><code class="${cls}">${value}</code></pre>`;
    },
  );
}
