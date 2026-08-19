import Script from "next/script";
import { getSettings } from "@/lib/settings";

/**
 * Chèn script tích hợp (analytics + script tùy chỉnh) do admin cấu hình.
 * Đặt trong root layout — nội dung là dữ liệu admin nhập nên được tin cậy.
 */
export default async function SiteScripts() {
  const s = await getSettings();

  return (
    <>
      {s.analyticsProvider === "umami" && s.analyticsSrc && s.analyticsSiteId && (
        <Script
          src={s.analyticsSrc}
          data-website-id={s.analyticsSiteId}
          strategy="afterInteractive"
        />
      )}

      {s.analyticsProvider === "plausible" && s.analyticsSiteId && (
        <Script
          src={s.analyticsSrc || "https://plausible.io/js/script.js"}
          data-domain={s.analyticsSiteId}
          strategy="afterInteractive"
        />
      )}

      {s.analyticsProvider === "ga" && s.analyticsSiteId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${s.analyticsSiteId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${s.analyticsSiteId}');`}
          </Script>
        </>
      )}

      {s.customScriptSrc && (
        <Script src={s.customScriptSrc} strategy="afterInteractive" />
      )}

      {s.customScriptInline && (
        <Script id="custom-inline" strategy="afterInteractive">
          {s.customScriptInline}
        </Script>
      )}
    </>
  );
}
