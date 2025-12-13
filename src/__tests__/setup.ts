import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock jsdom before any imports to avoid ES module issues
jest.mock('jsdom', () => {
  // Create a proper window-like object for DOMPurify
  const mockWindow = {
    document: {
      createElement: jest.fn(),
    },
    HTMLElement: class {},
    Element: class {},
    Node: class {},
    Document: class {},
  };
  return {
    JSDOM: jest.fn().mockImplementation(() => ({
      window: mockWindow as any,
    })),
  };
});

// Mock DOMPurify to return a working sanitize function
jest.mock('dompurify', () => {
  const mockSanitize = jest.fn((input: string, config?: any) => {
    if (!config || !config.ALLOWED_TAGS || config.ALLOWED_TAGS.length === 0) {
      // Remove all HTML tags
      return input.replace(/<[^>]*>/g, '');
    }
    // For content fields, allow specified tags but remove dangerous attributes
    let result = input;
    // Remove script tags and event handlers
    result = result.replace(/<script[^>]*>.*?<\/script>/gi, '');
    result = result.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    // Remove tags not in ALLOWED_TAGS
    const allowedTags = config.ALLOWED_TAGS || [];
    const tagPattern = new RegExp(`<(?!\/?(?:${allowedTags.join('|')})\\b)[^>]+>`, 'gi');
    result = result.replace(tagPattern, '');
    return result;
  });
  // DOMPurify is called as a function with window, so return an object with sanitize method
  function mockDOMPurify(window: any) {
    return {
      sanitize: mockSanitize,
    };
  }
  return {
    __esModule: true,
    default: mockDOMPurify,
  };
});

// Mock cache service before any imports
jest.mock('../services/cache.service', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    deletePattern: jest.fn().mockResolvedValue(undefined),
    invalidateResource: jest.fn().mockResolvedValue(undefined),
    generateKey: jest.fn((resource: string, identifier: string, ...params: string[]) => {
      const parts = [resource, identifier, ...params].filter(Boolean);
      return parts.join(':');
    }),
    isAvailable: jest.fn().mockResolvedValue(true),
  },
  cacheKeys: {
    post: (id: string) => `post:${id}`,
    postList: (page: number, limit: number, filters?: string) =>
      `post:list:${page}:${limit}${filters ? `:${filters}` : ''}`,
    category: (id: string) => `category:${id}`,
    categorySlug: (slug: string) => `category:slug:${slug}`,
    categoryList: (page: number, limit: number) => `category:list:${page}:${limit}`,
    tag: (id: string) => `tag:${id}`,
    tagSlug: (slug: string) => `tag:slug:${slug}`,
    tagList: (page: number, limit: number) => `tag:list:${page}:${limit}`,
    product: (id: string) => `product:${id}`,
    productSlug: (slug: string) => `product:slug:${slug}`,
    productList: (page: number, limit: number) => `product:list:${page}:${limit}`,
    user: (id: string) => `user:${id}`,
    userList: (page: number, limit: number) => `user:list:${page}:${limit}`,
  },
}));

// Database setup/teardown utilities
let prisma: PrismaClient | undefined;

beforeAll(async () => {
  // Create test database connection
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });

  // Run migrations for test database
  try {
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL },
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn('Migration warning:', error);
  }

  // Global test utilities
  global.prisma = prisma;
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

// Extend global type for TypeScript
declare global {
  var prisma: PrismaClient;
}

