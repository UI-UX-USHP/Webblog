import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import MediaGrid from "@/components/admin/MediaGrid";

export const dynamic = "force-dynamic";

const IMG = /\.(jpe?g|png|webp|gif|avif)$/i;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export default async function MediaPage() {
  let files: { name: string; url: string; size: number }[] = [];
  try {
    const names = await readdir(UPLOAD_DIR);
    const withMeta = await Promise.all(
      names
        .filter((n) => IMG.test(n))
        .map(async (n) => {
          const s = await stat(path.join(UPLOAD_DIR, n));
          return { name: n, url: `/uploads/${n}`, size: s.size, mtime: s.mtimeMs };
        }),
    );
    withMeta.sort((a, b) => b.mtime - a.mtime);
    files = withMeta.map(({ name, url, size }) => ({ name, url, size }));
  } catch {
    // Thư mục uploads chưa tồn tại → danh sách rỗng.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thư viện ảnh</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {files.length} ảnh trong <code>public/uploads</code>.
        </p>
      </div>
      <MediaGrid files={files} />
    </div>
  );
}
