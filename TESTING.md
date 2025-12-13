# Testing Documentation

## Overview

This document describes the comprehensive automated testing setup for the Terra Industries Blog backend.

## Test Structure

The test suite follows industry best practices with a clear separation between unit tests and integration tests:

```
server/src/__tests__/
├── setup.ts                    # Global test setup
├── helpers/
│   ├── db.helper.ts           # Database utilities
│   ├── auth.helper.ts         # Authentication helpers
│   ├── mock.helper.ts         # Mock utilities
│   ├── test-data.helper.ts    # Test data factories
│   └── app.helper.ts          # Express app setup for integration tests
├── unit/
│   ├── services/              # Service unit tests
│   │   ├── auth.service.test.ts
│   │   ├── users.service.test.ts
│   │   ├── posts.service.test.ts
│   │   ├── categories.service.test.ts
│   │   ├── tags.service.test.ts
│   │   ├── products.service.test.ts
│   │   ├── media.service.test.ts
│   │   ├── newsletter.service.test.ts
│   │   ├── comments.service.test.ts
│   │   ├── contact.service.test.ts
│   │   └── press.service.test.ts
│   └── utils/                 # Utility unit tests
│       ├── file-validation.test.ts
│       ├── logger.test.ts
│       └── redis.test.ts
└── integration/
    └── auth.routes.test.ts    # Route integration tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

## Test Configuration

### Environment Setup

Create a `.env.test` file (see `.env.test.example`):

```env
NODE_ENV=test
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/terrablog_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=test_jwt_secret_for_testing_only_min_32_chars
```

### Database Setup

Tests use a separate test database. Before running tests:

1. Ensure PostgreSQL is running
2. Create test database: `createdb terrablog_test`
3. Run migrations: `npm run db:migrate` (with TEST_DATABASE_URL)

## Test Categories

### Unit Tests

Unit tests focus on individual functions and services in isolation:

- **Service Tests**: Test business logic without database/network dependencies
- **Utility Tests**: Test helper functions and utilities
- **Mocking**: External services (Redis, Cloudflare) are mocked

### Integration Tests

Integration tests verify the full request/response cycle:

- **Route Tests**: Test API endpoints with real database
- **Authentication Flow**: Test complete auth workflows
- **End-to-End Scenarios**: Test complete user journeys

## Test Helpers

### Database Helpers

```typescript
import { cleanDatabase, seedTestData, createTestUser } from '../helpers/db.helper';

// Clean database before each test
beforeEach(async () => {
  await cleanDatabase();
});

// Create test data
const { admin, author, post } = await seedTestData();
```

### Authentication Helpers

```typescript
import { generateToken, getAdminAuthHeader } from '../helpers/auth.helper';

const token = generateToken(userId, UserRole.ADMIN);
const headers = getAdminAuthHeader(userId);
```

### Test Data Factories

```typescript
import { testData } from '../helpers/test-data.helper';

const userData = testData.user.admin;
const postData = testData.post.published;
```

## Writing Tests

### Unit Test Example

```typescript
import { postsService } from '../../../services/posts.service';
import { cleanDatabase, seedTestData } from '../../helpers/db.helper';

describe('PostsService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it('should create a new post', async () => {
    const { author } = await seedTestData();
    const data = {
      title: 'New Post',
      slug: 'new-post',
      content: 'Content',
    };

    const post = await postsService.create(data, author.id);

    expect(post).toBeDefined();
    expect(post.title).toBe(data.title);
  });
});
```

### Integration Test Example

```typescript
import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';

describe('Posts Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  it('should create a post', async () => {
    const token = 'valid-jwt-token';
    const postData = {
      title: 'New Post',
      slug: 'new-post',
      content: 'Content',
    };

    const response = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData)
      .expect(201);

    expect(response.body.data.title).toBe(postData.title);
  });
});
```

## Coverage Goals

- **Unit Tests**: 80%+ coverage for services and utilities
- **Integration Tests**: Critical user flows and API endpoints
- **E2E Tests**: Complete user journeys (future)

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean database before/after tests
3. **Mocking**: Mock external services (Redis, Cloudflare)
4. **Descriptive Names**: Use clear test descriptions
5. **Arrange-Act-Assert**: Follow AAA pattern
6. **Test Data**: Use factories for consistent test data

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-commit hooks (optional)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check TEST_DATABASE_URL is correct
- Verify database exists

### Redis Connection Issues
- Redis is mocked in unit tests
- Integration tests may require Redis (or mock it)

### Test Timeouts
- Increase timeout in `jest.config.ts`
- Check for hanging database connections

## Future Enhancements

- [ ] E2E tests with Playwright/Cypress
- [ ] Performance tests
- [ ] Load tests
- [ ] Security tests
- [ ] Contract tests (API contracts)

