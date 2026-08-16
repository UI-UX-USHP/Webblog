import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16: quy ước "proxy" thay cho "middleware".
export default NextAuth(authConfig).auth;

export const config = {
  // Chỉ áp dụng cho khu vực admin
  matcher: ["/admin/:path*"],
};
