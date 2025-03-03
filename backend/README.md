# S-Blog Backend

Backend API cho ứng dụng blog sử dụng Node.js, Express và MongoDB.

## Tính năng

- **Xác thực & Phân quyền**
  - Đăng ký, đăng nhập
  - Xác thực email
  - Quên/đặt lại mật khẩu
  - Phân quyền: Admin, Moderator, User
  - JWT authentication
  - OAuth (Google, Facebook)

- **Quản lý Bài viết**
  - CRUD bài viết
  - Tìm kiếm, lọc, phân trang
  - Thống kê lượt xem
  - Like/Unlike
  - Tự động tạo slug và tính thời gian đọc
  - Upload ảnh với Cloudinary

- **Bình luận**
  - CRUD bình luận
  - Trả lời bình luận
  - Like/Unlike bình luận

- **Phân loại & Thẻ**
  - Quản lý danh mục (có hỗ trợ danh mục cha-con)
  - Quản lý thẻ
  - Tùy chỉnh icon và màu sắc

- **Bảo mật**
  - CORS
  - Rate limiting
  - Helmet security headers
  - XSS protection
  - NoSQL injection protection
  - Parameter pollution protection

- **Logging & Error Handling**
  - Winston logger
  - Error logging
  - Unhandled rejection/exception handling

## Yêu cầu

- Node.js 18+
- MongoDB 5+
- NPM hoặc Yarn

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Tạo file .env và cấu hình các biến môi trường:
```env
# Environment
NODE_ENV=development

# Server
PORT=5000
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/s-blog

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# CORS
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@s-blog.com

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Cloud Storage (Cloudinary)
CLOUD_NAME=your-cloud-name
CLOUD_API_KEY=your-api-key
CLOUD_API_SECRET=your-api-secret
```

4. Chạy ứng dụng:

```bash
# Development
npm run dev
# hoặc
yarn dev

# Production
npm run build
npm start
# hoặc
yarn build
yarn start
```

## Cấu trúc thư mục

```
src/
├── config/         # Cấu hình ứng dụng
│   ├── env.config.ts        # Biến môi trường
│   ├── database.config.ts   # Kết nối MongoDB
│   ├── email.config.ts      # Cấu hình email
│   ├── cloudinary.config.ts # Upload ảnh
│   ├── jwt.config.ts        # JWT authentication
│   ├── security.config.ts   # CORS, Helmet,...
│   ├── swagger.config.ts    # API documentation
│   └── logger.config.ts     # Winston logger
├── controllers/    # Xử lý request/response
├── middleware/     # Middleware (auth, validation,...)
├── models/        # Mongoose models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Helper functions
└── app.ts         # Express app setup
```

## API Documentation

API được tài liệu hóa sử dụng Swagger UI và có thể truy cập tại:
```
http://localhost:5000/api/docs
```

### Các routes chính:

- Auth:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password
  - GET /api/auth/google
  - GET /api/auth/facebook

- Users:
  - GET /api/users
  - GET /api/users/:id
  - PATCH /api/users/:id
  - DELETE /api/users/:id

- Posts:
  - GET /api/posts
  - POST /api/posts
  - GET /api/posts/:id
  - PATCH /api/posts/:id
  - DELETE /api/posts/:id
  - POST /api/posts/:id/like
  - POST /api/posts/:id/upload-image

- Comments:
  - GET /api/comments
  - POST /api/comments
  - PATCH /api/comments/:id
  - DELETE /api/comments/:id
  - POST /api/comments/:id/like

- Categories:
  - GET /api/categories
  - POST /api/categories
  - PATCH /api/categories/:id
  - DELETE /api/categories/:id

- Tags:
  - GET /api/tags
  - POST /api/tags
  - PATCH /api/tags/:id
  - DELETE /api/tags/:id

## Scripts

- `npm run dev`: Chạy ứng dụng trong môi trường development với hot-reload
- `npm run build`: Build ứng dụng cho production
- `npm start`: Chạy ứng dụng đã build trong môi trường production
- `npm run lint`: Kiểm tra lỗi với ESLint
- `npm run lint:fix`: Tự động fix các lỗi ESLint
- `npm test`: Chạy unit tests
- `npm run test:watch`: Chạy unit tests trong chế độ watch

## Công nghệ sử dụng

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose
- **Authentication**: 
  - JWT
  - Passport.js (OAuth)
- **Validation**: Express Validator
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Security**:
  - Helmet
  - CORS
  - Rate Limiting
  - XSS Protection
  - MongoDB Sanitization
  - HPP (HTTP Parameter Pollution)

## Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

MIT License 