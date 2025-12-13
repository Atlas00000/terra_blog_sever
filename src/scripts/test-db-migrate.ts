/**
 * Test Database Migration Script
 * Runs Prisma migrations on the test database
 */

import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load test environment
config({ path: '.env.test' });

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

if (!TEST_DATABASE_URL) {
  console.error('❌ TEST_DATABASE_URL or DATABASE_URL not set in .env.test');
  process.exit(1);
}

/**
 * Run Prisma migrations on test database
 */
async function runMigrations() {
  try {
    console.log('🔄 Running migrations on test database...');

    // Set DATABASE_URL to test database for migrations
    const env = {
      ...process.env,
      DATABASE_URL: TEST_DATABASE_URL,
    };

    // Run migrations
    execSync('npx prisma migrate deploy', {
      env,
      stdio: 'inherit',
    });

    console.log('✅ Migrations completed successfully');
  } catch (error: any) {
    console.error('❌ Error running migrations:', error.message);
    throw error;
  }
}

/**
 * Generate Prisma client
 */
async function generateClient() {
  try {
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', {
      stdio: 'inherit',
    });
    console.log('✅ Prisma client generated');
  } catch (error: any) {
    console.error('❌ Error generating Prisma client:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await generateClient();
    await runMigrations();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Failed to set up test database:', error.message);
    process.exit(1);
  }
}

main();

