# Hướng dẫn deploy lên VPS Windows (ushp.name.vn)

Blog chạy như một tiến trình Next.js nội bộ ở cổng **26105**, còn **IIS** làm
reverse proxy để đưa ra `https://ushp.name.vn`. Chạy song song với LMS mà không đụng
cổng 80/443 của nhau.

```
Internet ──443──> IIS (ushp.name.vn, SSL) ──proxy──> Next.js 127.0.0.1:26105 ──> SQLite
```

---

## 0. Chuẩn bị trên VPS (một lần)

- **Node.js 20+** (khớp máy dev: v22). Tải từ nodejs.org, cài bản LTS.
- **IIS** + hai module:
  - [URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
  - [Application Request Routing (ARR)](https://www.iis.net/downloads/microsoft/application-request-routing)
  - Sau khi cài ARR: mở IIS Manager → chọn node **Server** (tên máy) → **Application Request Routing Cache** → **Server Proxy Settings** → tick **Enable proxy** → Apply.
- **NSSM** (chạy Next.js như Windows service): tải từ nssm.cc, giải nén, chép `nssm.exe` vào `C:\Windows\System32` (hoặc nhớ đường dẫn).
- **win-acme** (SSL Let's Encrypt): tải từ win-acme.com, giải nén ra ví dụ `C:\win-acme`.
- **DNS**: trỏ bản ghi **A** của `ushp.name.vn` về IP công khai của VPS. Kiểm tra:
  `nslookup ushp.name.vn`.

---

## 1. Đưa mã nguồn lên VPS

Chép cả thư mục dự án lên VPS, ví dụ vào `C:\apps\ushp-blog` (qua git clone hoặc copy).
**Không chép** `node_modules`, `.next`, `prisma/blog.db` — sẽ tạo lại trên VPS.

```powershell
cd C:\apps\ushp-blog
npm ci
```

## 2. Tạo file `.env` trên VPS

Chép `.env.example` thành `.env` rồi điền:

```ini
DATABASE_URL="file:./blog.db"
AUTH_SECRET="<sinh mới bằng lệnh bên dưới>"
AUTH_URL="https://ushp.name.vn"
AUTH_TRUST_HOST=true
PORT=26105
ADMIN_EMAIL="admin@ushp.name.vn"
ADMIN_PASSWORD="<mật khẩu mạnh của bạn>"
ADMIN_NAME="USHP"
```

Sinh `AUTH_SECRET` mới:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3. Khởi tạo CSDL + build

```powershell
npx prisma migrate deploy   # tạo bảng theo migration
npm run db:seed             # tạo admin + 4 chuyên mục (chạy 1 lần)
npm run build               # build production
```

Chạy thử tại chỗ: `npm run start` rồi mở `http://127.0.0.1:26105`. Ổn thì Ctrl+C.

## 4. Chạy nền như Windows service (NSSM)

```powershell
nssm install ushp-blog "C:\Program Files\nodejs\node.exe"
nssm set ushp-blog AppDirectory "C:\apps\ushp-blog"
nssm set ushp-blog AppParameters "node_modules\next\dist\bin\next start -p 26105"
nssm set ushp-blog AppEnvironmentExtra NODE_ENV=production
nssm set ushp-blog Start SERVICE_AUTO_START
nssm start ushp-blog
```

Kiểm tra: `http://127.0.0.1:26105` vẫn chạy sau khi đóng terminal. Xem log:
`nssm status ushp-blog`. Cập nhật code sau này: `git pull && npm ci && npm run build`
rồi `nssm restart ushp-blog`.

> Lưu ý: đảm bảo tài khoản chạy service có quyền ghi vào thư mục dự án (để ghi
> `blog.db` và `public/uploads`).

## 5. Tạo Site IIS + reverse proxy

1. IIS Manager → **Sites** → **Add Website**:
   - Site name: `ushp-blog`
   - Physical path: một thư mục trống, ví dụ `C:\inetpub\ushp-blog`
   - Binding: **http**, host name `ushp.name.vn`, port 80.
2. Chép file [`deploy/web.config`](deploy/web.config) vào thư mục vật lý đó
   (`C:\inetpub\ushp-blog\web.config`). File này rewrite mọi request về
   `http://127.0.0.1:26105`.
3. (Nếu IIS chặn `serverVariables`) IIS Manager → **URL Rewrite** → **View Server
   Variables** → thêm `HTTP_X_FORWARDED_HOST`, `HTTP_X_FORWARDED_PROTO`,
   `HTTP_X_FORWARDED_FOR`.

Test HTTP: mở `http://ushp.name.vn` → phải thấy blog.

## 6. Cấp SSL (HTTPS) bằng win-acme

```powershell
cd C:\win-acme
.\wacs.exe
```

Chọn: **N** (tạo chứng chỉ mới) → chọn site `ushp-blog` → xác nhận host
`ushp.name.vn` → win-acme tự xin cert Let's Encrypt, tạo binding **https 443** và
lịch tự gia hạn. Xong, mở `https://ushp.name.vn` (khóa xanh).

> Thay thế: nếu DNS đi qua **Cloudflare**, có thể bật SSL ở Cloudflare (Full) và
> không cần win-acme — nhưng vẫn nên có cert ở IIS để dùng "Full (strict)".

## 7. Firewall

Mở cổng **80** và **443** cho Inbound (thường LMS đã mở). Cổng 26105 **không** cần
mở ra ngoài — chỉ IIS gọi nội bộ.

---

## Vận hành

- **Đăng bài**: đăng nhập `https://ushp.name.vn/admin/login` bằng `ADMIN_EMAIL` /
  `ADMIN_PASSWORD`.
- **Đổi mật khẩu admin**: hiện tại đổi qua seed (sửa `.env` rồi `npm run db:seed`),
  hoặc mình bổ sung trang đổi mật khẩu sau.
- **Backup** (quan trọng): định kỳ copy 2 thứ:
  - `C:\apps\ushp-blog\prisma\blog.db` (toàn bộ bài viết)
  - `C:\apps\ushp-blog\public\uploads\` (ảnh)
  Có thể lập Task Scheduler copy hằng ngày sang ổ khác/đám mây.
- **Cập nhật code**: `git pull` → `npm ci` → `npx prisma migrate deploy` →
  `npm run build` → `nssm restart ushp-blog`.

## Sự cố thường gặp

| Triệu chứng | Nguyên nhân / cách xử lý |
|---|---|
| 502 / 504 khi mở web | Service `ushp-blog` chưa chạy → `nssm status`, `nssm start` |
| Trang trắng, lỗi CSS | Chưa `npm run build`, hoặc thiếu thư mục `.next` |
| Đăng nhập xong lại về login | `AUTH_URL` sai hoặc thiếu `AUTH_TRUST_HOST=true` |
| Upload ảnh 500 | Service không có quyền ghi `public/uploads` |
| `serverVariables` bị chặn | Khai báo biến ở IIS (bước 5.3) |
