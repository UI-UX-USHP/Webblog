import { auth } from "@/auth";

/** Đảm bảo request đến từ admin đã đăng nhập; trả về session. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Chưa đăng nhập");
  }
  return session;
}
