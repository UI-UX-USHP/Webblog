"use client";

import { useEffect } from "react";

/**
 * Ghi nhận 1 lượt xem cho bài viết — gọi 1 lần/phiên trình duyệt.
 * Bot không chạy JS nên không bị tính, giúp số liệu sạch hơn.
 */
export default function ViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/views/${encodeURIComponent(slug)}`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
