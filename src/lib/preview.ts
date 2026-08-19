import crypto from "node:crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-preview-secret";

/** Token xem trước theo từng bài (HMAC của postId) — link chia sẻ không lộ secret. */
export function previewToken(postId: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(postId)
    .digest("hex")
    .slice(0, 24);
}

export function verifyPreview(postId: string, token: string | undefined): boolean {
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(previewToken(postId));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
