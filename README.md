# USHP Weblog

Weblog cá nhân cho `ushp.name.vn` — công nghệ, đời sống, portfolio, giáo dục/LMS.

## Công nghệ

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Prisma + SQLite** — CSDL 1 file, không cần DB server
- **Auth.js v5** — đăng nhập admin (1 tài khoản, JWT)
- **Tiptap** — trình soạn thảo WYSIWYG, upload ảnh
- Backend = Server Actions + Route Handlers trong cùng app

## Cấu trúc chính

```
src/
  app/(public)/        # Trang công khai: chủ, blog, post, category, portfolio, about
  app/admin/           # login + (panel): dashboard, posts CRUD, categories
  app/api/             # auth, upload
  actions/             # Server Actions (posts, categories)
  components/          # editor (Tiptap), public, admin
  lib/                 # prisma, auth helper, sanitize, slug
  auth.ts, auth.config.ts, proxy.ts
prisma/schema.prisma   # User, Category, Post, Tag
deploy/web.config      # IIS reverse proxy
DEPLOY.md              # Hướng dẫn lên VPS Windows
```

## Chạy local

```bash
npm install
npx prisma migrate dev      # tạo CSDL (đã có sẵn nếu clone kèm migrations)
npm run db:seed             # tạo admin + 4 chuyên mục
npm run dev                 # http://localhost:26105
```

Đăng nhập admin: `http://localhost:26105/admin/login`
(mặc định `admin@ushp.name.vn` / `ChangeMe@2026` — đổi trong `.env` rồi seed lại).

## Scripts

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy dev (port 26105) |
| `npm run build` | Build production (kèm `prisma generate`) |
| `npm run start` | Chạy production (port 26105) |
| `npm run db:seed` | Seed admin + chuyên mục |
| `npm run db:studio` | Mở Prisma Studio xem CSDL |

## Triển khai lên VPS

Xem [DEPLOY.md](DEPLOY.md) — hướng dẫn từng bước: NSSM (Windows service) + IIS
reverse proxy + win-acme (SSL) cho `https://ushp.name.vn`.
