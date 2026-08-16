# Hướng dẫn cập nhật code & redeploy (ushp.name.vn)

Dùng mỗi khi bạn **sửa code** và muốn đưa bản mới lên VPS.

## Tổng quan luồng

```
Máy dev (sửa code) --git push--> GitHub --git pull--> VPS --build + restart--> https://ushp.name.vn
```

- **Repo:** https://github.com/UI-UX-USHP/Webblog
- **Trên VPS:** thư mục `C:\apps\ushp-blog`, chạy nền bằng NSSM service `ushp-blog` (cổng 26105).
- **Không đụng** tới ovncr/DNS/SSL khi update code — chỉ build lại + restart service.

---

## PHẦN A — Trên MÁY DEV (đẩy code mới lên GitHub)

Mở terminal tại thư mục dự án (`...\Webblog`):

```bash
git add -A
git commit -m "Mô tả thay đổi"
git push
```

> `.env` và `blog.db` đã được `.gitignore` nên không bao giờ bị đẩy lên — an toàn.
> Nếu muốn test trước khi đẩy: `npm run build` chạy ổn ở máy dev rồi hãy push.

---

## PHẦN B — Trên VPS (kéo code mới về & chạy lại)

RDP vào VPS (`59.153.245.146:4389`), mở **Command Prompt / PowerShell**:

```bash
cd C:\apps\ushp-blog
git pull
```

Tùy nội dung thay đổi, chạy thêm:

| Bạn đã thay đổi gì? | Lệnh cần chạy thêm |
|---|---|
| Thêm/bớt thư viện (`package.json` đổi) | `npm ci` |
| Sửa `prisma/schema.prisma` (đổi cấu trúc DB) | `npx prisma migrate deploy` |
| Chỉ sửa code thường (page, component…) | *(không cần lệnh nào thêm)* |

Sau đó **luôn luôn** build lại và restart service:

```bash
npm run build
```
```bash
nssm restart ushp-blog
```

### ✅ Lệnh gọn cho trường hợp phổ biến (chỉ sửa code)

Copy cả khối, chạy trên VPS:
```bash
cd C:\apps\ushp-blog && git pull && npm run build && nssm restart ushp-blog
```

### Lệnh đầy đủ (khi đổi cả thư viện + schema)
```bash
cd C:\apps\ushp-blog && git pull && npm ci && npx prisma migrate deploy && npm run build && nssm restart ushp-blog
```

---

## PHẦN C — Kiểm tra sau khi deploy

Trên VPS:
```bash
nssm status ushp-blog
```
→ phải `SERVICE_RUNNING`.

```bash
curl http://127.0.0.1:26105
```
→ ra HTML là app đã chạy bản mới.

Rồi mở `https://ushp.name.vn` (Ctrl+F5) xem thay đổi đã lên chưa.

---

## Xử lý sự cố

### Trang báo 503 sau khi deploy
Thường do app chưa kịp lên hoặc tunnel mất kết nối. Trên VPS:
```bash
netstat -ano | findstr :26105
```
- Có `LISTENING` → app OK, restart lại tunnel:
```bash
powershell -Command "Stop-Service ProxyManagerAgent -Force; Start-Sleep 2; Get-Process frpc -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep 2; Start-Service ProxyManagerAgent"
```
- Không có `LISTENING` → app chưa chạy: `nssm start ushp-blog` (hoặc xem log build có lỗi không).

### Build lỗi
Đọc thông báo lỗi từ `npm run build`. Nếu thiếu package do vừa thêm thư viện: chạy `npm ci` rồi build lại.

### “EADDRINUSE / port 26105 đang bận”
Có tiến trình khác giữ cổng 26105 (vd còn `npm start` chạy tay). Chỉ nên để **service NSSM** dùng cổng này:
```bash
nssm restart ushp-blog
```
Nếu vẫn kẹt, tìm & tắt tiến trình chiếm cổng:
```bash
netstat -ano | findstr :26105
```
→ lấy PID ở cột cuối → `taskkill /PID <PID> /F` (đừng tắt nhầm PID của chính service).

---

## Ghi nhớ nhanh (cheat sheet)

| Việc | Nơi chạy | Lệnh |
|---|---|---|
| Đẩy code mới | Máy dev | `git add -A && git commit -m "..." && git push` |
| Cập nhật + chạy lại | VPS | `cd C:\apps\ushp-blog && git pull && npm run build && nssm restart ushp-blog` |
| Xem service | VPS | `nssm status ushp-blog` |
| Test nội bộ | VPS | `curl http://127.0.0.1:26105` |
| Sửa 503 (restart tunnel) | VPS | `Restart-Service ProxyManagerAgent -Force` |
| Đổi mật khẩu admin | VPS | sửa `ADMIN_PASSWORD` trong `.env` → `npm run db:seed` |
| Backup dữ liệu | VPS | copy `prisma\blog.db` + thư mục `public\uploads\` |
```
