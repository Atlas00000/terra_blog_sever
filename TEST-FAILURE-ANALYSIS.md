# Test Failure Analysis Report

Generated: 2025-12-12T15:24:23.751Z

## Summary

- Total Failures: 263
- Categories: 6
- Affected Files: 23

## Failure Categories (by count)

### 1. Database/Prisma (228 failures)

**Affected Files:** integration/tags.routes, unit/services/tags.service, unit/services/products.service, unit/services/users.service, unit/services/auth.service, integration/users.routes, integration/posts.routes, integration/products.routes, integration/contact.routes, integration/press.routes, integration/comments.routes, integration/newsletter.routes, integration/categories.routes

**Examples:**
- Tags Routes Integration › POST /api/v1/tags › should create tag for admin/editor (integration/tags.routes)
- Tags Routes Integration › POST /api/v1/tags › should return 403 for non-admin/editor (integration/tags.routes)
- Tags Routes Integration › POST /api/v1/tags › should return 409 for duplicate name (integration/tags.routes)
- Tags Routes Integration › PUT /api/v1/tags/:id › should update tag for admin/editor (integration/tags.routes)
- Tags Routes Integration › PUT /api/v1/tags/:id › should return 403 for non-admin/editor (integration/tags.routes)

### 2. TypeScript Errors (16 failures)

**Affected Files:** middleware/error.middleware, unit/services/posts.service, unit/services/newsletter.service, unit/services/media.service, unit/services/comments.service, middleware/sanitize.middleware, unit/services/categories.service

**Examples:**
- Error Handling Middleware › errorHandler › should handle AppError correctly (middleware/error.middleware)
- Error Handling Middleware › errorHandler › should include request ID in error response (middleware/error.middleware)
- Test suite failed to run (unit/services/posts.service)
- Test suite failed to run (unit/services/newsletter.service)
- Test suite failed to run (unit/services/media.service)

### 3. Assertion Failure (14 failures)

**Affected Files:** integration/tags.routes, unit/services/users.service, integration/health.routes, unit/utils/file-validation, integration/newsletter.routes, integration/categories.routes

**Examples:**
- Tags Routes Integration › GET /api/v1/tags › should return paginated tags (public) (integration/tags.routes)
- UsersService › getAll › should respect pagination limits (unit/services/users.service)
- Health Check Routes Integration › GET /health › should return basic health status (integration/health.routes)
- Health Check Routes Integration › GET /health/ready › should return readiness status (integration/health.routes)
- FileValidation › getFileExtension › should return empty string for files without extension (unit/utils/file-validation)

### 4. Validation (2 failures)

**Affected Files:** integration/auth.routes

**Examples:**
- Auth Routes Integration › POST /api/v1/auth/login › should return 400 for missing fields (integration/auth.routes)
- Auth Routes Integration › POST /api/v1/auth/login › should return 400 for missing fields (integration/auth.routes)

### 5. Not Found (404) (2 failures)

**Affected Files:** integration/comments.routes

**Examples:**
- Comments Routes Integration › POST /api/v1/comments › should return 404 for non-existent post (integration/comments.routes)
- Comments Routes Integration › POST /api/v1/comments › should return 404 for non-existent post (integration/comments.routes)

### 6. Other (1 failures)

**Affected Files:** middleware/sanitize.middleware

**Examples:**
- Cannot log after tests are done. Did you forget to wait for something async in your test? (middleware/sanitize.middleware)

## Detailed Failures by File

### integration/tags.routes

- **Tags Routes Integration › GET /api/v1/tags › should return paginated tags (public)** (Assertion Failure)
  - Error: expect(received).toBeGreaterThanOrEqual(expected)...

- **Tags Routes Integration › POST /api/v1/tags › should create tag for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › POST /api/v1/tags › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientUnknownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/h...

- **Tags Routes Integration › POST /api/v1/tags › should return 409 for duplicate name** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › PUT /api/v1/tags/:id › should update tag for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › PUT /api/v1/tags/:id › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › DELETE /api/v1/tags/:id › should delete tag for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › DELETE /api/v1/tags/:id › should return 409 if tag has posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › GET /api/v1/tags › should return paginated tags (public)** (Assertion Failure)
  - Error: expect(received).toBeGreaterThanOrEqual(expected)...

- **Tags Routes Integration › POST /api/v1/tags › should create tag for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › POST /api/v1/tags › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientUnknownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/h...

- **Tags Routes Integration › POST /api/v1/tags › should return 409 for duplicate name** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › PUT /api/v1/tags/:id › should update tag for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › PUT /api/v1/tags/:id › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › DELETE /api/v1/tags/:id › should delete tag for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Tags Routes Integration › DELETE /api/v1/tags/:id › should return 409 if tag has posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### unit/services/tags.service

- **TagsService › getAll › should return paginated tags** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › getAll › should include post count** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **TagsService › getBySlug › should get tag by slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › getById › should get tag by ID** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › create › should throw error if name already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › create › should throw error if slug already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › update › should update tag** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › update › should throw error if name is taken by another tag** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › update › should throw error if slug is taken by another tag** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › delete › should throw error if tag has posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › getAll › should return paginated tags** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › getAll › should include post count** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **TagsService › getBySlug › should get tag by slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › getById › should get tag by ID** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › create › should throw error if name already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › create › should throw error if slug already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › update › should update tag** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › update › should throw error if name is taken by another tag** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › update › should throw error if slug is taken by another tag** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **TagsService › delete › should throw error if tag has posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### unit/services/products.service

- **ProductsService › getAll › should return paginated products** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › getAll › should include post count** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › getBySlug › should get product by slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › getById › should get product by ID** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › create › should throw error if name already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › create › should throw error if slug already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **ProductsService › update › should update product** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › update › should throw error if name is taken by another product** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › update › should throw error if slug is taken by another product** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › delete › should delete product** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.product.delete()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/services/p...

- **ProductsService › delete › should throw error if product has posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › getAll › should return paginated products** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › getAll › should include post count** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › getBySlug › should get product by slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › getById › should get product by ID** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › create › should throw error if name already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › create › should throw error if slug already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **ProductsService › update › should update product** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › update › should throw error if name is taken by another product** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › update › should throw error if slug is taken by another product** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **ProductsService › delete › should delete product** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.product.delete()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/services/p...

- **ProductsService › delete › should throw error if product has posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### unit/services/users.service

- **UsersService › getAll › should return paginated users** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › getAll › should respect pagination limits** (Assertion Failure)
  - Error: expect(received).toBe(expected) // Object.is equality...

- **UsersService › getById › should get user by ID** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › getBySlug › should get user by slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › create › should throw error if email already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › create › should throw error if slug already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › update › should update user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › update › should throw error if slug is taken by another user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › update › should allow updating to same slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › update › should hash password if provided** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › getAll › should return paginated users** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › getAll › should respect pagination limits** (Assertion Failure)
  - Error: expect(received).toBe(expected) // Object.is equality...

- **UsersService › getById › should get user by ID** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › getBySlug › should get user by slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › create › should throw error if email already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › create › should throw error if slug already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › update › should update user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › update › should throw error if slug is taken by another user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › update › should allow updating to same slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **UsersService › update › should hash password if provided** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### unit/services/auth.service

- **AuthService › register › should throw error if user already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **AuthService › login › should login with correct credentials** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **AuthService › login › should throw error for non-existent user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **AuthService › login › should throw error for incorrect password** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **AuthService › getUserById › should get user by ID** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **AuthService › register › should throw error if user already exists** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **AuthService › login › should login with correct credentials** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **AuthService › login › should throw error for non-existent user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **AuthService › login › should throw error for incorrect password** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **AuthService › getUserById › should get user by ID** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### integration/users.routes

- **Users Routes Integration › GET /api/v1/users › should return paginated users for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users › should return 403 for non-admin user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users/:id › should return user by ID for authenticated user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users/:id › should return 401 without authentication** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users/:id › should return 404 for non-existent user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Users Routes Integration › GET /api/v1/users/slug/:slug › should return user by slug (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › POST /api/v1/users › should create user for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › POST /api/v1/users › should return 403 for non-admin user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › POST /api/v1/users › should return 400 for invalid data** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › POST /api/v1/users › should return 409 for duplicate email** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › PUT /api/v1/users/:id › should update user for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › PUT /api/v1/users/:id › should allow user to update own profile** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › PUT /api/v1/users/:id › should return 403 when user tries to update another user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › PUT /api/v1/users/:id › should return 401 without authentication** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › DELETE /api/v1/users/:id › should delete user for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › DELETE /api/v1/users/:id › should return 403 for non-admin user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › DELETE /api/v1/users/:id › should return 404 for non-existent user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users › should return paginated users for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users › should return 403 for non-admin user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users/:id › should return user by ID for authenticated user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users/:id › should return 401 without authentication** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › GET /api/v1/users/:id › should return 404 for non-existent user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Users Routes Integration › GET /api/v1/users/slug/:slug › should return user by slug (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › POST /api/v1/users › should create user for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › POST /api/v1/users › should return 403 for non-admin user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › POST /api/v1/users › should return 400 for invalid data** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › POST /api/v1/users › should return 409 for duplicate email** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › PUT /api/v1/users/:id › should update user for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › PUT /api/v1/users/:id › should allow user to update own profile** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › PUT /api/v1/users/:id › should return 403 when user tries to update another user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › PUT /api/v1/users/:id › should return 401 without authentication** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › DELETE /api/v1/users/:id › should delete user for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › DELETE /api/v1/users/:id › should return 403 for non-admin user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Users Routes Integration › DELETE /api/v1/users/:id › should return 404 for non-existent user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### integration/posts.routes

- **Posts Routes Integration › GET /api/v1/posts › should return paginated published posts (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should filter by category** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should filter by tag** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should search posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should not return draft posts for public** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts/:slug › should return post by slug (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts/:slug › should return 404 for draft post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts/id/:id › should return post by ID for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts/id/:id › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › POST /api/v1/posts › should create post for authenticated user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Posts Routes Integration › POST /api/v1/posts › should return 400 for invalid data** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › POST /api/v1/posts › should return 409 for duplicate slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Posts Routes Integration › PUT /api/v1/posts/:id › should update post for author** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › PUT /api/v1/posts/:id › should allow admin to update any post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › PUT /api/v1/posts/:id › should return 403 when author tries to update another author's post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › PUT /api/v1/posts/:id › should return 401 without authentication** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › DELETE /api/v1/posts/:id › should soft delete post for author** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › DELETE /api/v1/posts/:id › should allow admin to delete any post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › DELETE /api/v1/posts/:id › should return 403 when author tries to delete another author's post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Posts Routes Integration › DELETE /api/v1/posts/:id › should return 401 without authentication** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should return paginated published posts (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should filter by category** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should filter by tag** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should search posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts › should not return draft posts for public** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts/:slug › should return post by slug (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts/:slug › should return 404 for draft post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts/id/:id › should return post by ID for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › GET /api/v1/posts/id/:id › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › POST /api/v1/posts › should create post for authenticated user** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Posts Routes Integration › POST /api/v1/posts › should return 400 for invalid data** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › POST /api/v1/posts › should return 409 for duplicate slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Posts Routes Integration › PUT /api/v1/posts/:id › should update post for author** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › PUT /api/v1/posts/:id › should allow admin to update any post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › PUT /api/v1/posts/:id › should return 403 when author tries to update another author's post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › PUT /api/v1/posts/:id › should return 401 without authentication** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › DELETE /api/v1/posts/:id › should soft delete post for author** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › DELETE /api/v1/posts/:id › should allow admin to delete any post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Posts Routes Integration › DELETE /api/v1/posts/:id › should return 403 when author tries to delete another author's post** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Posts Routes Integration › DELETE /api/v1/posts/:id › should return 401 without authentication** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### integration/health.routes

- **Health Check Routes Integration › GET /health › should return basic health status** (Assertion Failure)
  - Error: expect(received).toBe(expected) // Object.is equality...

- **Health Check Routes Integration › GET /health/ready › should return readiness status** (Assertion Failure)
  - Error: expected 200 "OK", got 503 "Service Unavailable"...

- **Health Check Routes Integration › GET /health › should return basic health status** (Assertion Failure)
  - Error: expect(received).toBe(expected) // Object.is equality...

- **Health Check Routes Integration › GET /health/ready › should return readiness status** (Assertion Failure)
  - Error: expected 200 "OK", got 503 "Service Unavailable"...

### unit/utils/file-validation

- **FileValidation › getFileExtension › should return empty string for files without extension** (Assertion Failure)
  - Error: expect(received).toBe(expected) // Object.is equality...

- **FileValidation › getFileExtension › should return empty string for files without extension** (Assertion Failure)
  - Error: expect(received).toBe(expected) // Object.is equality...

### integration/auth.routes

- **Auth Routes Integration › POST /api/v1/auth/login › should return 400 for missing fields** (Validation)
  - Error: expected 400 "Bad Request", got 429 "Too Many Requests"...

- **Auth Routes Integration › POST /api/v1/auth/login › should return 400 for missing fields** (Validation)
  - Error: expected 400 "Bad Request", got 429 "Too Many Requests"...

### middleware/error.middleware

- **Error Handling Middleware › errorHandler › should handle AppError correctly** (TypeScript Errors)
  - Error: TypeError: req.get is not a function...

- **Error Handling Middleware › errorHandler › should include request ID in error response** (TypeScript Errors)
  - Error: TypeError: req.get is not a function...

- **Error Handling Middleware › errorHandler › should handle AppError correctly** (TypeScript Errors)
  - Error: TypeError: req.get is not a function...

- **Error Handling Middleware › errorHandler › should include request ID in error response** (TypeScript Errors)
  - Error: TypeError: req.get is not a function...

### integration/products.routes

- **Products Routes Integration › GET /api/v1/products/:slug › should return product by slug (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.product.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Products Routes Integration › POST /api/v1/products › should create product for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › POST /api/v1/products › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › POST /api/v1/products › should return 409 for duplicate name** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › PUT /api/v1/products/:id › should update product for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › PUT /api/v1/products/:id › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › DELETE /api/v1/products/:id › should delete product for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Products Routes Integration › DELETE /api/v1/products/:id › should return 409 if product has posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › GET /api/v1/products/:slug › should return product by slug (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.product.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Products Routes Integration › POST /api/v1/products › should create product for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › POST /api/v1/products › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › POST /api/v1/products › should return 409 for duplicate name** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › PUT /api/v1/products/:id › should update product for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › PUT /api/v1/products/:id › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Products Routes Integration › DELETE /api/v1/products/:id › should delete product for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Products Routes Integration › DELETE /api/v1/products/:id › should return 409 if product has posts** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### integration/contact.routes

- **Contact Routes Integration › GET /api/v1/contact › should return submissions for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › GET /api/v1/contact › should filter by status** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › GET /api/v1/contact › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › PUT /api/v1/contact/:id/status › should update submission status for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › DELETE /api/v1/contact/:id › should delete submission for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › GET /api/v1/contact › should return submissions for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › GET /api/v1/contact › should filter by status** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › GET /api/v1/contact › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › PUT /api/v1/contact/:id/status › should update submission status for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Contact Routes Integration › DELETE /api/v1/contact/:id › should delete submission for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### integration/press.routes

- **Press Routes Integration › POST /api/v1/press › should create press release for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › POST /api/v1/press › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › POST /api/v1/press › should return 409 for duplicate slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › PUT /api/v1/press/:id › should update press release for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › PUT /api/v1/press/:id › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › DELETE /api/v1/press/:id › should delete press release for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Press Routes Integration › DELETE /api/v1/press/:id › should return 403 for non-admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › POST /api/v1/press › should create press release for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › POST /api/v1/press › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › POST /api/v1/press › should return 409 for duplicate slug** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › PUT /api/v1/press/:id › should update press release for admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › PUT /api/v1/press/:id › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Press Routes Integration › DELETE /api/v1/press/:id › should delete press release for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Press Routes Integration › DELETE /api/v1/press/:id › should return 403 for non-admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### integration/comments.routes

- **Comments Routes Integration › GET /api/v1/comments › should return paginated approved comments (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › GET /api/v1/comments › should filter by postId** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › POST /api/v1/comments › should create comment (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Comments Routes Integration › POST /api/v1/comments › should return 400 for invalid data** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › POST /api/v1/comments › should return 404 for non-existent post** (Not Found (404))
  - Error: expected 404 "Not Found", got 400 "Bad Request"...

- **Comments Routes Integration › PUT /api/v1/comments/:id › should update comment for author** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › PUT /api/v1/comments/:id › should return 403 when user tries to update another user's comment** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.product.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Comments Routes Integration › PUT /api/v1/comments/:id/moderate › should moderate comment for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Comments Routes Integration › PUT /api/v1/comments/:id/moderate › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › DELETE /api/v1/comments/:id › should soft delete comment for author** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › GET /api/v1/comments › should return paginated approved comments (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › GET /api/v1/comments › should filter by postId** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › POST /api/v1/comments › should create comment (public)** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.comment.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Comments Routes Integration › POST /api/v1/comments › should return 400 for invalid data** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › POST /api/v1/comments › should return 404 for non-existent post** (Not Found (404))
  - Error: expected 404 "Not Found", got 400 "Bad Request"...

- **Comments Routes Integration › PUT /api/v1/comments/:id › should update comment for author** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › PUT /api/v1/comments/:id › should return 403 when user tries to update another user's comment** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.product.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/...

- **Comments Routes Integration › PUT /api/v1/comments/:id/moderate › should moderate comment for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.tag.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/help...

- **Comments Routes Integration › PUT /api/v1/comments/:id/moderate › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Comments Routes Integration › DELETE /api/v1/comments/:id › should soft delete comment for author** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### integration/newsletter.routes

- **Newsletter Routes Integration › POST /api/v1/newsletter/subscribe › should return 409 if already subscribed** (Assertion Failure)
  - Error: expected 409 "Conflict", got 201 "Created"...

- **Newsletter Routes Integration › GET /api/v1/newsletter › should return subscribers for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Newsletter Routes Integration › GET /api/v1/newsletter › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Newsletter Routes Integration › GET /api/v1/newsletter/:email › should return subscriber by email for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Newsletter Routes Integration › POST /api/v1/newsletter/subscribe › should return 409 if already subscribed** (Assertion Failure)
  - Error: expected 409 "Conflict", got 201 "Created"...

- **Newsletter Routes Integration › GET /api/v1/newsletter › should return subscribers for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Newsletter Routes Integration › GET /api/v1/newsletter › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.user.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Newsletter Routes Integration › GET /api/v1/newsletter/:email › should return subscriber by email for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

### unit/services/posts.service

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/posts.service.test.ts[0m:[93m106[0m:[93m32[0m - [91merror[0m[90m TS7006: [0mParameter 'p' implicitly has an ...

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/posts.service.test.ts[0m:[93m106[0m:[93m32[0m - [91merror[0m[90m TS7006: [0mParameter 'p' implicitly has an ...

### unit/services/newsletter.service

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/newsletter.service.test.ts[0m:[93m173[0m:[93m9[0m - [91merror[0m[90m TS2345: [0mArgument of type '{ weekly: ...

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/newsletter.service.test.ts[0m:[93m173[0m:[93m9[0m - [91merror[0m[90m TS2345: [0mArgument of type '{ weekly: ...

### unit/services/media.service

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/media.service.test.ts[0m:[93m43[0m:[93m41[0m - [91merror[0m[90m TS2339: [0mProperty 'uploadFile' does not ex...

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/media.service.test.ts[0m:[93m43[0m:[93m41[0m - [91merror[0m[90m TS2339: [0mProperty 'uploadFile' does not ex...

### unit/services/comments.service

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/comments.service.test.ts[0m:[93m84[0m:[93m44[0m - [91merror[0m[90m TS2554: [0mExpected 1 arguments, but got ...

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/comments.service.test.ts[0m:[93m84[0m:[93m44[0m - [91merror[0m[90m TS2554: [0mExpected 1 arguments, but got ...

### middleware/sanitize.middleware

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/middleware/sanitize.middleware.test.ts[0m:[93m2[0m:[93m20[0m - [91merror[0m[90m TS2305: [0mModule '"../../middleware/sanit...

- **Cannot log after tests are done. Did you forget to wait for something async in your test?** (Other)
  - Error: Attempted to log "✅ Redis connected"....

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/middleware/sanitize.middleware.test.ts[0m:[93m2[0m:[93m20[0m - [91merror[0m[90m TS2305: [0mModule '"../../middleware/sanit...

### unit/services/categories.service

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/categories.service.test.ts[0m:[93m25[0m:[93m46[0m - [91merror[0m[90m TS2554: [0mExpected 1 arguments, but go...

- **Test suite failed to run** (TypeScript Errors)
  - Error: [96msrc/__tests__/unit/services/categories.service.test.ts[0m:[93m25[0m:[93m46[0m - [91merror[0m[90m TS2554: [0mExpected 1 arguments, but go...

### integration/categories.routes

- **Categories Routes Integration › GET /api/v1/categories › should return paginated categories (public)** (Assertion Failure)
  - Error: expect(received).toBeGreaterThanOrEqual(expected)...

- **Categories Routes Integration › POST /api/v1/categories › should create category for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Categories Routes Integration › POST /api/v1/categories › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Categories Routes Integration › PUT /api/v1/categories/:id › should update category for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Categories Routes Integration › GET /api/v1/categories › should return paginated categories (public)** (Assertion Failure)
  - Error: expect(received).toBeGreaterThanOrEqual(expected)...

- **Categories Routes Integration › POST /api/v1/categories › should create category for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Categories Routes Integration › POST /api/v1/categories › should return 403 for non-admin/editor** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

- **Categories Routes Integration › PUT /api/v1/categories/:id › should update category for admin** (Database/Prisma)
  - Error: PrismaClientKnownRequestError: Invalid `prisma.post.create()` invocation in /Users/celestineemili/Desktop/Code Root/terrablog/server/src/__tests__/hel...

