# 🛒 NestJS E-Commerce API

A **production-ready RESTful backend API** for an e-commerce platform, built with **NestJS**, **TypeScript**, **MongoDB**, and **Stripe** for payments.  
The project focuses on **clean architecture**, **scalability**, **security**, and **real-world backend engineering practices**.

This API handles user authentication, product management, shopping cart operations, orders, payments, coupons, favorites, and secure access control using modern backend patterns.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- JWT-based access and refresh tokens
- Token revocation and invalidation
- Role-based authorization (User / Admin / Super Admin)
- Email verification using OTP
- Password reset functionality
- Secure credential management

---

### 👤 User Management

- Signup with email verification (OTP)
- Login and logout with token refresh
- User profile management
- Language preference handling (EN / AR ready)
- User roles and permissions

---

### 📦 Product Management

- Create and update products with multiple images
- Category and brand organization
- Discount and pricing management
- Stock tracking
- Product descriptions and metadata
- Slug-based URLs

---

### 🛒 Shopping & Orders

- Shopping cart management
- Add and remove items with quantity control
- Stock validation
- Order creation and management
- Order status tracking *(Pending, Paid, Shipped, Delivered, Cancelled)*
- Payment method selection (Cash / Card)

---

### 💳 Payment Integration

- Stripe payment gateway integration
- Checkout session creation
- Payment intent management
- Webhook handling for payment confirmation
- Coupon and discount support
- Automatic refund on order cancellation

---

### ❤️ Favorites System

- Add and remove products from favorites
- User-specific favorite lists
- Toggle favorite functionality

---

### 🎟️ Coupon System

- Create and manage discount coupons
- Usage limits and expiration dates
- Automatic discount calculation
- Coupon usage tracking

---

### 🧱 Architecture & Code Quality

- Repository pattern with generic database operations
- Feature-based module structure
- Centralized error handling
- Request validation using `class-validator`
- Custom decorators for authentication and authorization
- Interceptors for logging and language preference
- Middleware for request preprocessing

---

### 🔒 Security & Performance

- Password hashing using bcrypt
- Separate JWT secrets for different token types
- Token expiration and refresh mechanism
- Request timeout handling
- CORS configuration
- MongoDB indexing and optimized queries
- File upload handling using Multer

---

## 🧱 Project Architecture

The project follows a **feature-based structure** with a clear separation of concerns:
```
nestjs-ecommerce-api/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   ├── enums/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── interfaces/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── DB/
│   │   ├── models/
│   │   └── repository/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── product/
│   │   ├── category/
│   │   ├── brand/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── coupon/
│   │   └── favorite/
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── config/
├── uploads/
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠 Tech Stack

### Backend

- **NestJS** – Progressive Node.js framework
- **TypeScript** – Type-safe JavaScript
- **Express.js** – HTTP server

### Database

- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB

### Authentication & Security

- **JWT (jsonwebtoken)** – Token-based authentication
- **bcrypt** – Password hashing
- **class-validator** – Request validation
- **class-transformer** – Object transformation

### Payment Processing

- **Stripe** – Payment gateway integration
- Checkout sessions and payment intents
- Secure webhook handling

### File Handling

- **Multer** – File upload middleware
- Local file storage
- Image management

### Utilities & Tooling

- **Nodemailer** – Email sending
- **Slugify** – URL-friendly slugs
- **RxJS** – Reactive programming
- **dotenv** – Environment configuration

---

## 🔐 Environment Variables

Create a `.env.development` file in the `config/` directory:
```env
# Application
PORT=3000
APPLICATION_NAME=E-Commerce API

# Database
DB_URI=mongodb://localhost:27017/ecommerce

# Security
SALT=10

# JWT Tokens
ACCESS_USER_TOKEN_SIGNATURE=your_access_user_secret
REFRESH_USER_TOKEN_SIGNATURE=your_refresh_user_secret
ACCESS_SYSTEM_TOKEN_SIGNATURE=your_access_system_secret
REFRESH_SYSTEM_TOKEN_SIGNATURE=your_refresh_system_secret

ACCESS_TOKEN_EXPIRES_IN=900
REFRESH_TOKEN_EXPIRES_IN=2592000

# Email
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# Stripe
STRIPE_SECRET=your_stripe_secret_key
STRIPE_HOOK_SECRET=your_stripe_webhook_secret
SUCCESS_URL=http://localhost:3000/success
CANCEL_URL=http://localhost:3000/cancel
```

> ⚠️ **Never commit `.env` files or secrets to version control.**

---

## ▶️ Running the Project

### Install dependencies
```bash
npm install
```

### Development mode
```bash
npm run start:dev
```

Server will run on:
```
http://localhost:3000
```

---

## 🌐 API Overview

### Authentication (`/auth`)

- `POST /auth/signup` – User registration
- `POST /auth/login` – User login
- `POST /auth/resend-confirm-email` – Resend OTP
- `PATCH /auth/confirm-email` – Verify email with OTP

### User (`/user`)

- `GET /user` – Get user profile
- `GET /user/all` – Get all users (Admin only)

### Category (`/category`)

- `POST /category` – Create category (Admin only)
- `GET /category/all` – Get all categories

### Brand (`/brand`)

- `POST /brand` – Create brand (Admin only)
- `PATCH /brand/:id` – Update brand (Admin only)
- `GET /brand/all` – Get all brands

### Product (`/product`)

- `POST /product` – Create product (Admin only)
- `GET /product` – Get all products

### Cart (`/cart`)

- `POST /cart/add-to-cart` – Add product to cart

### Favorite (`/favorite`)

- `POST /favorite/:productId/toggle` – Toggle favorite

### Coupon (`/coupon`)

- `POST /coupon` – Create coupon (Admin only)

### Order (`/order`)

- `POST /order` – Create order
- `POST /order/:orderId` – Checkout order
- `PATCH /order/:orderId` – Cancel order (Admin only)
- `POST /order/webhook` – Stripe webhook handler

---

## 🧪 Error Handling

All errors follow a unified response structure with appropriate HTTP status codes.  
Errors are handled globally using NestJS exception filters.

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication (access & refresh tokens)
- Role-based authorization using guards
- Token revocation on logout
- DTO-based request validation
- CORS configuration
- Stripe webhook signature verification

---

## 📦 Key Modules

### Common Module

- Custom decorators (`@Auth`, `@User`, `@UploadImage`)
- Guards (Authentication, Authorization)
- Interceptors (Logging, Language Preference)
- Services (Token, Security, Payment)
- Utilities (Email, Hashing, OTP)

### Database Module

- Generic repository pattern
- Mongoose schemas and models
- Indexed collections
- Type-safe database operations

### Feature Modules

Each feature module follows a consistent structure:

- Controller (HTTP layer)
- Service (Business logic)
- DTOs (Validation)
- Repository (Database access)

---

## 🚀 Highlights

- Production-ready backend architecture
    
- Fully type-safe implementation
    
- Modular and scalable design
    
- Secure authentication and payments
    
- Stripe integration with webhooks and refunds
    
- Clean, readable, and well-structured codebase
    

---

## 📄 License

UNLICENSED

---

## 👤 Author

**Zeyad Mohammed**  
Backend Developer  
GitHub: [https://github.com/zeyad-mohammed-dev](https://github.com/zeyad-mohammed-dev)

---

## ⭐ Final Note

This project demonstrates a complete backend architecture for a modern e-commerce platform, focusing on **best practices**, **security**, **scalability**, and **clean code principles**.
