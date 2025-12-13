import { PrismaClient } from '@prisma/client';
import { Role, PostStatus, CommentStatus, ContactStatus } from '@prisma/client';
import { config } from 'dotenv';

// Load test environment
config({ path: '.env.test' });

// Use global prisma if available, otherwise create new instance with test database
const getPrisma = () => {
  if (global.prisma) {
    return global.prisma;
  }
  
  const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  
  return new PrismaClient({
    datasources: {
      db: {
        url: TEST_DATABASE_URL,
      },
    },
  });
};

export const prisma = getPrisma();

/**
 * Clean database - removes all data from all tables
 * Properly handles foreign keys and resets sequences
 */
export async function cleanDatabase() {
  // Disable foreign key checks temporarily
  await prisma.$executeRawUnsafe('SET session_replication_role = replica;');

  // Get all tables
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  // Truncate all tables (including soft-deleted records)
  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        // Use TRUNCATE with RESTART IDENTITY to reset sequences
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`
        );
      } catch (error) {
        // If TRUNCATE fails, try DELETE (for tables with dependencies)
        try {
          await prisma.$executeRawUnsafe(`DELETE FROM "public"."${tablename}";`);
        } catch (deleteError) {
          // Ignore errors for tables that don't exist or have issues
        }
      }
    }
  }

  // Re-enable foreign key checks
  await prisma.$executeRawUnsafe('SET session_replication_role = DEFAULT;');
}

/**
 * Seed test data - creates minimal test data
 */
export async function seedTestData() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Test Admin',
      email: 'admin@test.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', // password: test123
      role: Role.ADMIN,
      slug: 'test-admin',
    },
  });

  // Create editor user
  const editor = await prisma.user.create({
    data: {
      name: 'Test Editor',
      email: 'editor@test.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5', // password: test123
      role: Role.EDITOR,
      slug: 'test-editor',
    },
  });

  // Create author user
  const author = await prisma.user.create({
    data: {
      name: 'Test Author',
      email: 'author@test.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5', // password: test123
      role: Role.AUTHOR,
      slug: 'test-author',
    },
  });

  // Create category
  const category = await prisma.category.create({
    data: {
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test category description',
    },
  });

  // Create tag
  const tag = await prisma.tag.create({
    data: {
      name: 'Test Tag',
      slug: 'test-tag',
      description: 'Test tag description',
    },
  });

  // Create product
  const product = await prisma.product.create({
    data: {
      name: 'Test Product',
      slug: 'test-product',
      description: 'Test product description',
      features: ['Feature 1', 'Feature 2'],
      specifications: { key: 'value' },
    },
  });

  // Create post
  const post = await prisma.post.create({
    data: {
      title: 'Test Post',
      slug: 'test-post',
      excerpt: 'Test post excerpt',
      content: 'Test post content with enough words to calculate reading time properly.',
      status: PostStatus.PUBLISHED,
      authorId: author.id,
      publishedAt: new Date(),
      readingTime: 1,
      categories: {
        connect: { id: category.id },
      },
      tags: {
        connect: { id: tag.id },
      },
      products: {
        connect: { id: product.id },
      },
    },
  });

  // Create comment
  const comment = await prisma.comment.create({
    data: {
      content: 'Test comment',
      authorName: 'Test Commenter',
      authorEmail: 'commenter@test.com',
      status: CommentStatus.APPROVED,
      postId: post.id,
    },
  });

  return {
    admin,
    editor,
    author,
    category,
    tag,
    product,
    post,
    comment,
  };
}

/**
 * Create a test user
 */
export async function createTestUser(data: {
  name: string;
  email: string;
  password?: string;
  role?: Role;
  slug?: string;
}) {
  const hashedPassword = data.password || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5';
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: data.role || Role.AUTHOR,
      slug: data.slug || data.email.split('@')[0],
    },
  });
}

/**
 * Create a test post
 */
export async function createTestPost(data: {
  title: string;
  slug: string;
  authorId: string;
  content?: string;
  status?: PostStatus;
  categoryIds?: string[];
  tagIds?: string[];
  productIds?: string[];
  publishedAt?: Date | null;
}) {
  const content = data.content || 'Test post content with enough words to calculate reading time properly.';
  const readingTime = Math.ceil(content.split(/\s+/).length / 200);
  const publishedAt = data.status === PostStatus.PUBLISHED ? (data.publishedAt || new Date()) : null;
  
  return prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: 'Test excerpt',
      content,
      status: data.status || PostStatus.DRAFT,
      authorId: data.authorId,
      readingTime,
      publishedAt,
      categories: data.categoryIds ? { connect: data.categoryIds.map((id) => ({ id })) } : undefined,
      tags: data.tagIds ? { connect: data.tagIds.map((id) => ({ id })) } : undefined,
      products: data.productIds ? { connect: data.productIds.map((id) => ({ id })) } : undefined,
    },
  });
}

/**
 * Create a test category
 */
export async function createTestCategory(data: { name: string; slug: string; description?: string }) {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || 'Test category description',
    },
  });
}

/**
 * Create a test tag
 */
export async function createTestTag(data: { name: string; slug: string; description?: string }) {
  return prisma.tag.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || 'Test tag description',
    },
  });
}

/**
 * Create a test product
 */
export async function createTestProduct(data: {
  name: string;
  slug: string;
  description?: string;
  features?: string[];
  specifications?: any;
}) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || 'Test product description',
      features: data.features || [],
      specifications: data.specifications || {},
    },
  });
}

