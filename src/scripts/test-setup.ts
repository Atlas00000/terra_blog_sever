/**
 * Test Setup Script
 * Orchestrates the complete test database setup process
 */

import { execSync } from 'child_process';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

// Load test environment
config({ path: '.env.test' });

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

if (!TEST_DATABASE_URL) {
  console.error('❌ TEST_DATABASE_URL or DATABASE_URL not set in .env.test');
  process.exit(1);
}

/**
 * Check if .env.test exists
 */
function checkEnvFile(): boolean {
  const envPath = join(process.cwd(), '.env.test');
  if (!existsSync(envPath)) {
    console.error('❌ .env.test file not found');
    console.log('💡 Create .env.test file from .env.test.example');
    return false;
  }
  return true;
}

/**
 * Check if test database exists
 */
async function checkDatabase(): Promise<boolean> {
  try {
    execSync('tsx src/scripts/test-db-check.ts', {
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Create test database
 */
async function createDatabase(): Promise<void> {
  console.log('📦 Creating test database...');
  execSync('tsx src/scripts/test-db-create.ts', {
    stdio: 'inherit',
  });
}

/**
 * Run migrations
 */
async function runMigrations(): Promise<void> {
  console.log('🔄 Running migrations...');
  execSync('tsx src/scripts/test-db-migrate.ts', {
    stdio: 'inherit',
  });
}

/**
 * Main setup process
 */
async function main() {
  console.log('🚀 Starting test database setup...\n');

  // Step 1: Check .env.test file
  if (!checkEnvFile()) {
    process.exit(1);
  }
  console.log('✅ .env.test file found\n');

  // Step 2: Check if database exists
  const dbExists = await checkDatabase();
  
  if (!dbExists) {
    // Step 3: Create database
    try {
      await createDatabase();
      console.log('');
    } catch (error: any) {
      console.error('❌ Failed to create database:', error.message);
      process.exit(1);
    }
  } else {
    console.log('ℹ️  Test database already exists\n');
  }

  // Step 4: Run migrations
  try {
    await runMigrations();
    console.log('');
  } catch (error: any) {
    console.error('❌ Failed to run migrations:', error.message);
    process.exit(1);
  }

  console.log('✅ Test database setup complete!');
  console.log('💡 You can now run: npm test\n');
}

main().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});

