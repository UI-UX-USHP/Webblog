import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Cố định thư mục gốc để Turbopack không nhầm với lockfile ở thư mục cha
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
