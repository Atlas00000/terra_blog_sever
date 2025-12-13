/**
 * Test Database Creation Script
 * Creates the test database if it doesn't exist
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
 * Extract database connection details from URL
 */
function parseDatabaseUrl(url: string): {
  user: string;
  password: string;
  host: string;
  port: string;
  database: string;
} {
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }

  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5].split('?')[0],
  };
}

/**
 * Create database using psql
 */
async function createDatabase() {
  try {
    const dbConfig = parseDatabaseUrl(TEST_DATABASE_URL);
    const dbName = dbConfig.database;

    console.log(`📦 Creating test database '${dbName}'...`);

    // Connect to postgres database to create the test database
    const postgresUrl = TEST_DATABASE_URL.replace(`/${dbName}`, '/postgres');
    
    // Use createdb command if available, otherwise use psql
    try {
      execSync(`createdb -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} ${dbName}`, {
        env: { ...process.env, PGPASSWORD: dbConfig.password },
        stdio: 'inherit',
      });
      console.log(`✅ Test database '${dbName}' created successfully`);
    } catch (error: any) {
      // Fallback to psql
      const createDbSql = `CREATE DATABASE ${dbName};`;
      execSync(
        `psql "${postgresUrl}" -c "${createDbSql}"`,
        {
          env: { ...process.env, PGPASSWORD: dbConfig.password },
          stdio: 'inherit',
        }
      );
      console.log(`✅ Test database '${dbName}' created successfully`);
    }
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log(`ℹ️  Test database already exists`);
      return;
    }
    console.error('❌ Error creating database:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await createDatabase();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Failed to create test database:', error.message);
    process.exit(1);
  }
}

main();

