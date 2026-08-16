import type { NextAuthConfig } from "next-auth";

/**
 * Cấu hình edge-safe (dùng chung cho middleware).
 * KHÔNG import Prisma/bcrypt ở đây — middleware chạy trên edge runtime.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isLoginPage = path === "/admin/login";
      const isAdminArea = path.startsWith("/admin");

      // Đã đăng nhập mà vào trang login -> đẩy về dashboard
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      // Khu vực admin (trừ trang login) yêu cầu đăng nhập
      if (isAdminArea && !isLoginPage) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) ?? "ADMIN";
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
