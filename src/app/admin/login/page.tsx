"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="hero-glow flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow-lift)]">
        <div className="mb-6 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-lg font-bold text-white shadow-[var(--shadow-soft)]">
            U
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Đăng nhập</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản trị ushp.name.vn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Tài khoản</label>
            <input
              type="text"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
