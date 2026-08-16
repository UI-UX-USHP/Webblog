import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Công nghệ", slug: "cong-nghe" },
  { name: "Đời sống", slug: "doi-song" },
  { name: "Portfolio", slug: "portfolio" },
  { name: "Giáo dục / LMS", slug: "giao-duc-lms" },
];

async function main() {
  // Seed 4 chuyên mục mặc định
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }
  console.log(`✓ Đã seed ${CATEGORIES.length} chuyên mục`);

  // Seed tài khoản admin
  const email = process.env.ADMIN_EMAIL ?? "admin@ushp.name.vn";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe@2026";
  const name = process.env.ADMIN_NAME ?? "USHP";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name, passwordHash, role: "ADMIN" },
  });
  console.log(`✓ Đã tạo/cập nhật admin: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
