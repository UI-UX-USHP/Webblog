"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { saveSettings } from "@/actions/settings";
import type { SiteSettings } from "@/lib/settings";

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring";

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function IntegrationsForm({ initial }: { initial: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [analyticsProvider, setAnalyticsProvider] = useState<string>(
    initial.analyticsProvider,
  );
  const [analyticsSrc, setAnalyticsSrc] = useState(initial.analyticsSrc);
  const [analyticsSiteId, setAnalyticsSiteId] = useState(initial.analyticsSiteId);
  const [giscusEnabled, setGiscusEnabled] = useState(initial.giscusEnabled);
  const [giscusRepo, setGiscusRepo] = useState(initial.giscusRepo);
  const [giscusRepoId, setGiscusRepoId] = useState(initial.giscusRepoId);
  const [giscusCategory, setGiscusCategory] = useState(initial.giscusCategory);
  const [giscusCategoryId, setGiscusCategoryId] = useState(
    initial.giscusCategoryId,
  );
  const [customScriptSrc, setCustomScriptSrc] = useState(initial.customScriptSrc);
  const [customScriptInline, setCustomScriptInline] = useState(
    initial.customScriptInline,
  );

  function submit() {
    setError("");
    setSaved(false);
    startTransition(async () => {
      try {
        await saveSettings({
          analyticsProvider,
          analyticsSrc,
          analyticsSiteId,
          giscusEnabled: giscusEnabled ? "1" : "",
          giscusRepo,
          giscusRepoId,
          giscusCategory,
          giscusCategoryId,
          customScriptSrc,
          customScriptInline,
        });
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại");
      }
    });
  }

  const cardCls = "space-y-4 rounded-xl border border-border bg-surface p-5";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Analytics */}
      <section className={cardCls}>
        <div>
          <h2 className="font-semibold">Thống kê truy cập (Analytics)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gắn công cụ analytics bên ngoài. Ưu tiên Umami/Plausible tự host cho
            nhẹ và tôn trọng quyền riêng tư.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nhà cung cấp</label>
          <select
            value={analyticsProvider}
            onChange={(e) => setAnalyticsProvider(e.target.value)}
            className={inputCls}
          >
            <option value="">— Tắt —</option>
            <option value="umami">Umami</option>
            <option value="plausible">Plausible</option>
            <option value="ga">Google Analytics (GA4)</option>
          </select>
        </div>
        {analyticsProvider === "umami" && (
          <>
            <Field
              label="Script URL"
              placeholder="https://analytics.tencuaban.com/script.js"
              value={analyticsSrc}
              onChange={setAnalyticsSrc}
            />
            <Field
              label="Website ID"
              placeholder="xxxxxxxx-xxxx-xxxx"
              value={analyticsSiteId}
              onChange={setAnalyticsSiteId}
            />
          </>
        )}
        {analyticsProvider === "plausible" && (
          <>
            <Field
              label="Domain"
              placeholder="ushp.name.vn"
              value={analyticsSiteId}
              onChange={setAnalyticsSiteId}
            />
            <Field
              label="Script URL (tùy chọn)"
              hint="Để trống sẽ dùng https://plausible.io/js/script.js"
              placeholder="https://plausible.io/js/script.js"
              value={analyticsSrc}
              onChange={setAnalyticsSrc}
            />
          </>
        )}
        {analyticsProvider === "ga" && (
          <Field
            label="Measurement ID"
            placeholder="G-XXXXXXXXXX"
            value={analyticsSiteId}
            onChange={setAnalyticsSiteId}
          />
        )}
      </section>

      {/* Giscus comments */}
      <section className={cardCls}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Bình luận (Giscus)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bình luận dựa trên GitHub Discussions. Lấy repoId/categoryId tại{" "}
              <a
                href="https://giscus.app"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                giscus.app
              </a>
              .
            </p>
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={giscusEnabled}
              onChange={(e) => setGiscusEnabled(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Bật
          </label>
        </div>
        {giscusEnabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Repo"
              placeholder="tentaikhoan/ten-repo"
              value={giscusRepo}
              onChange={setGiscusRepo}
            />
            <Field
              label="Repo ID"
              placeholder="R_xxx"
              value={giscusRepoId}
              onChange={setGiscusRepoId}
            />
            <Field
              label="Category"
              placeholder="Announcements"
              value={giscusCategory}
              onChange={setGiscusCategory}
            />
            <Field
              label="Category ID"
              placeholder="DIC_xxx"
              value={giscusCategoryId}
              onChange={setGiscusCategoryId}
            />
          </div>
        )}
      </section>

      {/* Custom scripts */}
      <section className={cardCls}>
        <div>
          <h2 className="font-semibold">Script tùy chỉnh</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nối thêm công cụ khác (chat, heatmap…). Chỉ dán mã bạn tin tưởng —
            script chạy trên toàn site.
          </p>
        </div>
        <Field
          label="Script ngoài (URL)"
          placeholder="https://cong-cu.com/widget.js"
          value={customScriptSrc}
          onChange={setCustomScriptSrc}
        />
        <div>
          <label className="mb-1 block text-sm font-medium">
            Mã JS nội tuyến
          </label>
          <textarea
            value={customScriptInline}
            onChange={(e) => setCustomScriptInline(e.target.value)}
            rows={4}
            placeholder="console.log('hello');"
            className={`${inputCls} resize-y font-mono`}
          />
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button type="button" disabled={isPending} onClick={submit}>
          {isPending ? "Đang lưu…" : "Lưu cấu hình"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
            Đã lưu
          </span>
        )}
      </div>
    </div>
  );
}
