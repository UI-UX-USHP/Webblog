import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.AUTH_URL ?? "http://localhost:26105";

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
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
