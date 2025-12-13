# 🚀 Terrablog API Server

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![Express](https://img.shields.io/badge/Express-4.18-green.svg)
![Prisma](https://img.shields.io/badge/Prisma-5.7-blue.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-80%25+-green.svg)

**Production-ready REST API server for the Terra Industries Blog Platform**

[Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Testing](#-testing) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Development](#-development)
- [Security](#-security)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

The Terrablog API Server is a **production-ready, enterprise-grade** REST API built with Express.js and TypeScript. It provides comprehensive functionality for content management, user authentication, media handling, and engagement features.

### Key Highlights

- 🔒 **Enterprise Security** - JWT auth, rate limiting, input sanitization, security headers
- ⚡ **High Performance** - Redis caching, optimized queries, image optimization
- 📊 **Comprehensive Testing** - Unit, integration tests with 80%+ coverage
- 🚀 **Production Ready** - Health checks, monitoring, Docker support
- 📝 **Type Safe** - Full TypeScript with Prisma ORM
- 🎯 **Well Documented** - Swagger/OpenAPI documentation

---

## ✨ Features

### Core Functionality

| Module | Features | Status |
|--------|----------|--------|
| 🔐 **Authentication** | JWT-based auth, registration, login, role-based access | ✅ Complete |
| 👥 **Users** | User management, profiles, roles (ADMIN, EDITOR, AUTHOR) | ✅ Complete |
| 📝 **Posts** | Full CRUD, status management, soft deletes, pagination | ✅ Complete |
| 📂 **Categories** | Category management with slug-based routing | ✅ Complete |
| 🏷️ **Tags** | Tag management with slug-based routing | ✅ Complete |
| 🛍️ **Products** | Product showcase with features and specifications | ✅ Complete |
| 🖼️ **Media** | File uploads, Cloudflare R2 integration, image optimization | ✅ Complete |
| 💬 **Comments** | Threaded comments, moderation, status management | ✅ Complete |
| 📧 **Newsletter** | Subscription management, preferences, confirmation | ✅ Complete |
| 📬 **Contact** | Contact form submissions with status tracking | ✅ Complete |
| 📰 **Press Releases** | Press release management with featured flag | ✅ Complete |
| 📊 **Audit Logs** | Comprehensive audit trail for all operations | ✅ Complete |

### Security Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Role-Based Authorization** - Granular permissions (ADMIN, EDITOR, AUTHOR)
- 🚦 **Rate Limiting** - Multi-tier rate limiting:
  - General API: 100 req/15min
  - Authentication: 5 req/15min
  - Contact: 3 req/hour
  - Newsletter: 5 req/hour
  - Comments: 10 req/hour
- 🧹 **Input Sanitization** - DOMPurify for XSS prevention
- 🔒 **Security Headers** - Helmet.js with CSP, HSTS, CORS
- ✅ **Request Validation** - Zod schemas for runtime validation
- 📝 **Audit Logging** - Complete audit trail

### Performance Features

- ⚡ **Redis Caching** - Intelligent caching with graceful degradation
- 🖼️ **Image Optimization** - Cloudflare Images API integration
- 📦 **Soft Deletes** - Data recovery capability
- 🔄 **Query Optimization** - Efficient Prisma queries
- 📊 **Health Checks** - Monitoring endpoints
- 🚀 **CDN Integration** - Cloudflare R2 for media storage

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Express Application                    │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Middleware   │  │  Controllers │  │   Services   │  │
│  │              │  │              │  │              │  │
│  │ • Auth       │  │ • Posts      │  │ • Posts      │  │
│  │ • Rate Limit │  │ • Users      │  │ • Users      │  │
│  │ • Sanitize   │  │ • Media      │  │ • Media      │  │
│  │ • Validate   │  │ • Comments   │  │ • Auth       │  │
│  │ • Error      │  │ • Newsletter │  │ • Cache      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    Routes Layer                      │ │
│  │  /api/v1/auth, /api/v1/posts, /api/v1/media, etc.  │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────┬───────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐
│  PostgreSQL  │ │    Redis    │ │ Cloudflare │
│  (Prisma)    │ │   (Cache)   │ │ R2 & Images│
└──────────────┘ └─────────────┘ └────────────┘
```

### Project Structure

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── env.ts           # Environment validation
│   │   ├── security.ts      # Security config
│   │   └── swagger.ts       # API documentation
│   │
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── posts.controller.ts
│   │   ├── users.controller.ts
│   │   ├── media.controller.ts
│   │   └── ...
│   │
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── posts.service.ts
│   │   ├── media.service.ts
│   │   ├── cache.service.ts
│   │   ├── audit.service.ts
│   │   └── ...
│   │
│   ├── routes/              # API routes
│   │   └── v1/
│   │       ├── auth.routes.ts
│   │       ├── posts.routes.ts
│   │       └── ...
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── sanitize.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── utils/               # Utilities
│   │   ├── logger.ts
│   │   ├── redis.ts
│   │   └── file-validation.ts
│   │
│   ├── lib/                 # Libraries
│   │   └── prisma.ts        # Prisma client
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   ├── __tests__/           # Test files
│   │   ├── unit/            # Unit tests
│   │   ├── integration/     # Integration tests
│   │   └── helpers/         # Test helpers
│   │
│   └── server.ts            # Application entry point
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding
│
├── jest.config.ts           # Jest configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 🛠️ Tech Stack

### Core
- **Node.js** 18+ - Runtime environment
- **Express.js** 4.18 - Web framework
- **TypeScript** 5.3 - Type safety
- **Prisma** 5.7 - ORM and database toolkit

### Database & Cache
- **PostgreSQL** - Primary database
- **Redis** - Caching layer

### Authentication & Security
- **JWT** (jsonwebtoken) - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **DOMPurify** - XSS prevention

### Validation & Documentation
- **Zod** - Runtime type validation
- **express-validator** - Request validation
- **Swagger/OpenAPI** - API documentation

### Media & Storage
- **Cloudflare R2** - Object storage (S3-compatible)
- **Cloudflare Images** - Image optimization
- **Multer** - File upload handling

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **ts-jest** - TypeScript Jest transformer

### Utilities
- **Winston** - Logging
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Docker (optional, for local services)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Docker services** (PostgreSQL & Redis)
   ```bash
   # From root directory
   npm run dev:services
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Seed the database** (optional)
   ```bash
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Verify server is running**
   ```bash
   curl http://localhost:3001/health
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=3001
NODE_ENV=development
APP_VERSION=1.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/terrablog

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_very_secure_jwt_secret_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Client
CLIENT_URL=http://localhost:3000

# Cloudflare R2 (Optional)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=terrablog-media
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxx.r2.dev
CLOUDFLARE_R2_ENDPOINT=https://xxxx.r2.cloudflarestorage.com
CLOUDFLARE_IMAGES_API_TOKEN=your_images_api_token

# Email (Optional)
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@terraindustries.com
```

---

## 📚 API Documentation

### Interactive Documentation

Once the server is running, access the interactive Swagger documentation:

```
http://localhost:3001/api-docs
```

### API Endpoints

#### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/register` | Register new user | ❌ |
| `POST` | `/api/v1/auth/login` | Login user | ❌ |
| `GET` | `/api/v1/auth/me` | Get current user | ✅ |

#### 📝 Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/posts` | List posts (with filters) | ❌ |
| `GET` | `/api/v1/posts/:slug` | Get post by slug | ❌ |
| `GET` | `/api/v1/posts/id/:id` | Get post by ID | ✅ (Admin/Editor) |
| `POST` | `/api/v1/posts` | Create post | ✅ |
| `PUT` | `/api/v1/posts/:id` | Update post | ✅ |
| `DELETE` | `/api/v1/posts/:id` | Delete post (soft delete) | ✅ |

#### 👥 Users

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| `GET` | `/api/v1/users` | List users | ✅ | Admin/Editor |
| `GET` | `/api/v1/users/:id` | Get user by ID | ✅ | Admin/Editor |
| `PUT` | `/api/v1/users/:id` | Update user | ✅ | Admin/Editor |
| `DELETE` | `/api/v1/users/:id` | Delete user | ✅ | Admin |

#### 🖼️ Media

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| `GET` | `/api/v1/media` | List media | ✅ | Admin/Editor |
| `GET` | `/api/v1/media/:id` | Get media by ID | ✅ | Admin/Editor |
| `POST` | `/api/v1/media/upload` | Upload single file | ✅ | Any |
| `POST` | `/api/v1/media/upload-multiple` | Upload multiple files | ✅ | Any |
| `DELETE` | `/api/v1/media/:id` | Delete media | ✅ | Any (own files) |

#### 💬 Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/comments` | List comments | ❌ |
| `GET` | `/api/v1/comments/:id` | Get comment by ID | ❌ |
| `POST` | `/api/v1/comments` | Create comment | ❌ (Rate limited) |
| `PUT` | `/api/v1/comments/:id` | Update comment | ✅ |
| `DELETE` | `/api/v1/comments/:id` | Delete comment | ✅ |
| `PUT` | `/api/v1/comments/:id/moderate` | Moderate comment | ✅ (Admin/Editor) |

#### 📧 Newsletter

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/newsletter/subscribe` | Subscribe to newsletter | ❌ |
| `POST` | `/api/v1/newsletter/confirm` | Confirm subscription | ❌ |
| `POST` | `/api/v1/newsletter/unsubscribe` | Unsubscribe | ❌ |
| `PUT` | `/api/v1/newsletter/preferences` | Update preferences | ❌ |
| `GET` | `/api/v1/newsletter` | List subscribers | ✅ (Admin/Editor) |

#### 📬 Contact

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/contact` | Submit contact form | ❌ (Rate limited) |
| `GET` | `/api/v1/contact` | List submissions | ✅ (Admin/Editor) |
| `GET` | `/api/v1/contact/:id` | Get submission | ✅ (Admin/Editor) |
| `PUT` | `/api/v1/contact/:id/status` | Update status | ✅ (Admin/Editor) |

#### 📰 Press Releases

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/press` | List press releases | ❌ |
| `GET` | `/api/v1/press/:slug` | Get by slug | ❌ |
| `POST` | `/api/v1/press` | Create press release | ✅ (Admin/Editor) |
| `PUT` | `/api/v1/press/:id` | Update press release | ✅ (Admin/Editor) |
| `DELETE` | `/api/v1/press/:id` | Delete press release | ✅ (Admin) |

#### 🏥 Health Checks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Basic health check |
| `GET` | `/health/live` | Liveness probe |
| `GET` | `/health/ready` | Readiness probe (checks DB & Redis) |
| `GET` | `/health/detailed` | Detailed health with system stats |

### Request/Response Examples

#### Create Post

```bash
POST /api/v1/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Post",
  "slug": "my-new-post",
  "excerpt": "This is a great post",
  "content": "Full content here...",
  "status": "DRAFT",
  "categoryIds": ["cat1", "cat2"],
  "tagIds": ["tag1", "tag2"]
}
```

#### Upload Media

```bash
POST /api/v1/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

---

## 🧪 Testing

### Testing Philosophy

We follow **industry best practices** with comprehensive test coverage:

- ✅ **Unit Tests** - Test services and utilities in isolation
- ✅ **Integration Tests** - Test API endpoints with real database
- ✅ **Test Helpers** - Reusable utilities for consistent testing
- ✅ **Mocking** - External services (Redis, Cloudflare) are mocked
- ✅ **Coverage** - 80%+ code coverage target

### Test Structure

```
src/__tests__/
├── setup.ts                    # Global test setup
├── helpers/                    # Test utilities
│   ├── db.helper.ts           # Database helpers
│   ├── auth.helper.ts         # Authentication helpers
│   ├── app.helper.ts          # Express app setup
│   ├── mock.helper.ts         # Mock utilities
│   └── test-data.helper.ts    # Test data factories
├── unit/                       # Unit tests
│   ├── services/              # Service unit tests
│   │   ├── auth.service.test.ts
│   │   ├── posts.service.test.ts
│   │   └── ...
│   └── utils/                 # Utility unit tests
│       ├── file-validation.test.ts
│       └── logger.test.ts
└── integration/               # Integration tests
    ├── auth.routes.test.ts
    ├── posts.routes.test.ts
    ├── users.routes.test.ts
    └── ...
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (for development)
npm run test:watch

# Coverage report
npm run test:coverage

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# CI mode (with coverage)
npm run test:ci
```

### Test Configuration

1. **Create test environment file**
   ```bash
   cp .env.test.example .env.test
   ```

2. **Configure test database**
   ```env
   NODE_ENV=test
   TEST_DATABASE_URL=postgresql://user:password@localhost:5432/terrablog_test
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=test_jwt_secret_for_testing_only_min_32_chars
   ```

3. **Create test database**
   ```bash
   createdb terrablog_test
   ```

### Testing Best Practices

#### ✅ Test Patterns

**Arrange-Act-Assert (AAA)**
```typescript
it('should create a post', async () => {
  // Arrange
  const { author } = await seedTestData();
  const postData = {
    title: 'Test Post',
    slug: 'test-post',
    content: 'Content'
  };
  
  // Act
  const post = await postsService.create(postData, author.id);
  
  // Assert
  expect(post).toBeDefined();
  expect(post.title).toBe(postData.title);
});
```

**Test Isolation**
- Each test is independent
- Database is cleaned before each test
- Mocks are reset between tests

**Descriptive Test Names**
```typescript
describe('PostsService', () => {
  it('should return published posts only for public access', async () => {
    // ...
  });
  
  it('should filter posts by category slug', async () => {
    // ...
  });
  
  it('should throw error when creating post with duplicate slug', async () => {
    // ...
  });
});
```

#### 📊 Coverage Goals

- **Unit Tests**: 80%+ coverage for services and utilities
- **Integration Tests**: All critical API endpoints
- **Edge Cases**: Error scenarios, boundary conditions

#### 🎯 What We Test

- ✅ **Business Logic** - All service methods
- ✅ **API Endpoints** - All routes with various scenarios
- ✅ **Authentication** - Login, registration, token validation
- ✅ **Authorization** - Role-based access control
- ✅ **Validation** - Input validation and error handling
- ✅ **Edge Cases** - Error scenarios, boundary conditions

### Test Helpers

#### Database Helpers

```typescript
import { cleanDatabase, seedTestData, createTestPost } from '../helpers/db.helper';

beforeEach(async () => {
  await cleanDatabase();
});

const { admin, author, post } = await seedTestData();
```

#### Authentication Helpers

```typescript
import { generateToken, getAdminAuthHeader } from '../helpers/auth.helper';

const token = generateToken(userId, Role.ADMIN);
const headers = getAdminAuthHeader(userId);
```

#### Test Data Factories

```typescript
import { testData } from '../helpers/test-data.helper';

const userData = testData.user.admin;
const postData = testData.post.published;
```

### Continuous Integration

Tests run automatically on:
- ✅ Pull requests
- ✅ Commits to main branch
- ✅ Pre-commit hooks (optional)

For detailed testing documentation, see [TESTING.md](./TESTING.md).

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev                    # Start with hot reload (tsx watch)

# Building
npm run build                  # Build for production
npm start                      # Start production server

# Database
npm run db:generate            # Generate Prisma client
npm run db:migrate             # Run migrations
npm run db:migrate:deploy      # Deploy migrations (production)
npm run db:seed                # Seed database
npm run db:studio              # Open Prisma Studio
npm run db:reset               # Reset database (⚠️ deletes all data)

# Testing
npm test                       # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests only
npm run test:ci                # CI mode with coverage

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix               # Fix ESLint errors
```

### Database Management

#### Migrations

```bash
# Create a new migration
npm run db:migrate

# Apply migrations in production
npm run db:migrate:deploy
```

#### Seeding

```bash
# Seed the database
npm run db:seed

# Open Prisma Studio (Database GUI)
npm run db:studio
```

### Code Style

- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks (if configured)

---

## 🔒 Security

### Security Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Role-Based Authorization** - Granular permissions
- 🚦 **Rate Limiting** - Multi-tier protection
- 🧹 **Input Sanitization** - XSS prevention
- 🔒 **Security Headers** - Helmet.js configuration
- ✅ **Request Validation** - Zod schemas
- 📝 **Audit Logging** - Complete audit trail

### Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Authentication | 5 requests | 15 minutes |
| Contact Form | 3 requests | 1 hour |
| Newsletter | 5 requests | 1 hour |
| Comments | 10 requests | 1 hour |

### Security Best Practices

1. **Environment Variables** - Never commit secrets
2. **JWT Secret** - Use strong, random secret (min 32 chars)
3. **HTTPS** - Always use HTTPS in production
4. **Input Validation** - All inputs validated with Zod
5. **SQL Injection** - Protected by Prisma ORM
6. **XSS Prevention** - DOMPurify sanitization
7. **CORS** - Configured for allowed origins only

---

## 🚢 Deployment

### Prerequisites

- PostgreSQL database (managed or self-hosted)
- Redis instance (managed or self-hosted)
- Cloudflare R2 account (for media storage)
- Environment variables configured

### Environment Setup

1. **Configure production environment**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   ```

2. **Required Variables**
   - `DATABASE_URL` - PostgreSQL connection string
   - `REDIS_URL` - Redis connection string
   - `JWT_SECRET` - Secret key (min 32 chars)
   - `CLOUDFLARE_R2_*` - Cloudflare R2 credentials
   - `CLIENT_URL` - Frontend URL for CORS

### Deployment Options

#### Option 1: Docker

```bash
docker build -t terrablog-api .
docker run -p 3001:3001 --env-file .env.production terrablog-api
```

#### Option 2: Railway / Render / AWS

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

### Health Checks

Monitor your deployment:

```bash
# Basic health
curl https://api.example.com/health

# Readiness (for Kubernetes)
curl https://api.example.com/health/ready

# Detailed health
curl https://api.example.com/health/detailed
```

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL
```

#### Redis Connection

```bash
# Check Redis is running
redis-cli ping
```

#### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Debug Mode

Enable debug logging:

```bash
DEBUG=* npm run dev
```

---

## 📚 Additional Resources

- [API Documentation](./docs/API.md) - Detailed API reference
- [Testing Guide](./TESTING.md) - Comprehensive testing documentation
- [Deployment Guide](../DEPLOYMENT.md) - Production deployment
- [Architecture Docs](../terrablog-system-design.md) - System design

---

## 📄 License

**UNLICENSED** - Proprietary to Terra Industries

---

<div align="center">

**Built with ❤️ using Express, TypeScript, and Prisma**

[⬆ Back to Top](#-terrablog-api-server)

</div>
