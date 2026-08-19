import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteScripts from "@/components/SiteScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.AUTH_URL ?? "http://localhost:26105";

// Đặt data-theme trước khi paint để tránh nhấp nháy (đã lưu > hệ thống).
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "USHP — Weblog cá nhân",
    template: "%s · USHP",
  },
  description:
    "Weblog cá nhân của USHP: chia sẻ về công nghệ, lập trình, đời sống, portfolio và giáo dục.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "USHP",
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
        <SiteScripts />
      </body>
    </html>
  );
}
