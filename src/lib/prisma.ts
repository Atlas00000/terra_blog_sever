import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load test environment if in test mode
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use test database URL if in test environment
const getDatabaseUrl = () => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  }
  return undefined; // Use default from DATABASE_URL env var
};

const databaseUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl
      ? {
          db: {
            url: databaseUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Soft delete middleware (only for models with deletedAt field)
prisma.$use(async (params, next) => {
  // Only apply to models that have deletedAt field (Post model only)
  // Comments use status-based soft deletes (REJECTED status), not deletedAt
  const modelsWithSoftDelete = ['Post'];
  
  if (!modelsWithSoftDelete.includes(params.model || '')) {
    return next(params);
  }

  // Handle delete operations
  if (params.action === 'delete') {
    params.action = 'update';
    params.args['data'] = { deletedAt: new Date() };
  }

  // Handle deleteMany operations
  if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    if (params.args.data !== undefined) {
      params.args.data['deletedAt'] = new Date();
    } else {
      params.args['data'] = { deletedAt: new Date() };
    }
  }

  // Filter out deleted records in find operations
  if (params.action === 'findUnique' || params.action === 'findFirst') {
    if (params.args.where !== undefined) {
      if (params.args.where.deletedAt === undefined) {
        params.args.where['deletedAt'] = null;
      }
    } else {
      params.args['where'] = { deletedAt: null };
    }
  }

  if (params.action === 'findMany') {
    if (params.args.where !== undefined) {
      if (params.args.where.deletedAt === undefined) {
        params.args.where['deletedAt'] = null;
      }
    } else {
      params.args['where'] = { deletedAt: null };
    }
  }

  return next(params);
});

export default prisma;

