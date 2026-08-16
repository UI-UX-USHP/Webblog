import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Đôi nét về USHP và weblog này.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold tracking-tight">Giới thiệu</h1>
      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
        <p>
          Chào bạn, mình là <strong>USHP</strong>. Đây là không gian cá nhân nơi
          mình chia sẻ về công nghệ, lập trình, đời sống và các dự án mình đang
          theo đuổi.
        </p>
        <p>
          Weblog này được xây dựng bằng Next.js, lưu dữ liệu với SQLite và chạy
          trên VPS riêng. Nếu bạn muốn trao đổi, đừng ngần ngại liên hệ.
        </p>
        <h2>Liên hệ</h2>
        <ul>
          <li>Website: ushp.name.vn</li>
          <li>Email: admin@ushp.name.vn</li>
        </ul>
      </div>
    </div>
  );
}
