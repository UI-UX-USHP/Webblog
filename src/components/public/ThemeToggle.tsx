"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/** Nút chuyển giao diện sáng/tối, lưu lựa chọn vào localStorage. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "dark" : "light");

    // Nếu người dùng chưa chọn, bám theo thay đổi của hệ thống.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem("theme")) {
        const t = mq.matches ? "dark" : "light";
        document.documentElement.dataset.theme = t;
        setTheme(t);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Chuyển giao diện sáng/tối"
      title="Sáng / Tối"
      className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </button>
  );
}
