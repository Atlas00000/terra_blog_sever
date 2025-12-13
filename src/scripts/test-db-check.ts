/**
 * Test Database Check Script
 * Checks if the test database exists
 */

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load test environment
config({ path: '.env.test' });

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

if (!TEST_DATABASE_URL) {
  console.error('❌ TEST_DATABASE_URL or DATABASE_URL not set in .env.test');
  process.exit(1);
}

/**
 * Extract database name from connection string
 */
function getDatabaseName(url: string): string {
  const match = url.match(/\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
  if (match) {
    return match[5];
  }
  // Fallback: try to extract from URL
  const parts = url.split('/');
  return parts[parts.length - 1].split('?')[0];
}

/**
 * Check if database exists by trying to connect
 */
async function checkDatabaseExists(): Promise<boolean> {
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: TEST_DATABASE_URL,
        },
      },
    });

    // Try to connect
    await prisma.$connect();
    
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    await prisma.$disconnect();
    return true;
  } catch (error: any) {
    // Database doesn't exist or connection failed
    if (error.code === 'P1001' || error.message?.includes('does not exist')) {
      return false;
    }
    // Other connection errors
    throw error;
  }
}

async function main() {
  const dbName = getDatabaseName(TEST_DATABASE_URL);
  console.log(`🔍 Checking if test database '${dbName}' exists...`);

  try {
    const exists = await checkDatabaseExists();
    
    if (exists) {
      console.log(`✅ Test database '${dbName}' exists`);
      process.exit(0);
    } else {
      console.log(`❌ Test database '${dbName}' does not exist`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error checking database:', error.message);
    process.exit(1);
  }
}

main();

