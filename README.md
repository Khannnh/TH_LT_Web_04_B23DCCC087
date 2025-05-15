# WEB BASE V3

## Web base v3 based on:

- React 17, umijs, antd v4
- TypeScript
- SSO with Keycloak
- Back-end: NestJS, PostgreSQL

This project is initialized with [Web Base](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
yarn
```

## Provided Scripts

RIPT S-Link provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
yarn start
```

### Build project

```bash
yarn build
```
khánh bị hâm nặng
jztr 🙄
admin_notes (TEXT, NULLABLE)
requested_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
processed_at (TIMESTAMP, NULLABLE)
processed_by_admin_id (INT, FK REFERENCES Users(user_id), NULLABLE)
Thiết Kế API Endpoints (RESTful):

Xác thực (Auth):
POST /api/auth/login
POST /api/auth/register (Nếu cho phép sinh viên tự đăng ký, hoặc chỉ admin tạo)
POST /api/auth/logout
Sinh viên (Student):
GET /api/equipment: Xem danh sách thiết bị (có filter theo tình trạng, tìm kiếm theo tên).
GET /api/equipment/{id}: Xem chi tiết thiết bị.
POST /api/borrow-requests: Gửi yêu cầu mượn.
GET /api/borrow-requests/me: Xem lịch sử mượn của bản thân.
PUT /api/borrow-requests/me/{id}/cancel: (Optional) Sinh viên hủy yêu cầu nếu chưa được duyệt.
Quản trị viên (Admin):
Quản lý Yêu Cầu:
GET /api/admin/borrow-requests: Xem danh sách tất cả yêu cầu (có filter, sort).
GET /api/admin/borrow-requests/{id}: Xem chi tiết yêu cầu.
PUT /api/admin/borrow-requests/{id}/approve: Duyệt yêu cầu.
PUT /api/admin/borrow-requests/{id}/reject: Từ chối yêu cầu.
PUT /api/admin/borrow-requests/{id}/confirm-return: Xác nhận đã trả thiết bị.
Quản lý Thiết Bị:
GET /api/admin/equipment: Xem danh sách thiết bị.
POST /api/admin/equipment: Thêm thiết bị mới.
GET /api/admin/equipment/{id}: Xem chi tiết thiết bị.
PUT /api/admin/equipment/{id}: Cập nhật thông tin/số lượng thiết bị.
DELETE /api/admin/equipment/{id}: Xóa thiết bị.
Thống Kê:
GET /api/admin/statistics/most-borrowed?month=YYYY-MM&year=YYYY: Thiết bị mượn nhiều trong tháng/năm.
GET /api/admin/statistics/overdue: Danh sách thiết bị quá hạn trả.
(Optional) Quản lý người dùng:
GET /api/admin/users
POST /api/admin/users
PUT /api/admin/users/{id}
DELETE /api/admin/users/{id}
Chọn Công Cụ và Thiết Lập Môi Trường:

IDE: Visual Studio Code.
Quản lý phiên bản: Git, GitHub (tạo repository, ví dụ: club-equipment-lending-system).
Backend (Node.js/Express.js):
npm hoặc yarn làm trình quản lý gói.
Các thư viện chính: express, mysql2 (hoặc ORM như Sequelize, Prisma), bcryptjs (mã hóa mật khẩu), jsonwebtoken (tạo và xác thực token), dotenv (biến môi trường), cors (xử lý Cross-Origin Resource Sharing), nodemailer (gửi email), node-cron (lập lịch tác vụ).
Công cụ kiểm thử API: Postman hoặc Insomnia.
Frontend (ReactJS/UmiJS):
yarn hoặc npm.
UmiJS CLI (@umijs/cli).
Ant Design (antd).
axios (hoặc Workspace API) để gọi API.
Thư viện quản lý state (UmiJS có sẵn DVA, hoặc cân nhắc Zustand, Redux Toolkit nếu cần).
Database Tool: MySQL Workbench, DBeaver, hoặc phpMyAdmin.
Cấu Trúc Thư Mục Dự Án (Tham khảo ví dụ và chuẩn):

Thư mục gốc:
