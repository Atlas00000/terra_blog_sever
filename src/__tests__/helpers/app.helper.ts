import express from 'express';
import request from 'supertest';
import cors from 'cors';
import { cleanDatabase } from './db.helper';
import { errorHandler } from '../../middleware/error.middleware';
import routes from '../../routes';
import { healthController } from '../../controllers/health.controller';

/**
 * Create a test Express app
 * This mirrors the main server.ts setup but with test-specific configurations
 */
export function createTestApp() {
  const app = express();

  // Trust proxy
  app.set('trust proxy', 1);

  // CORS (relaxed for tests)
  app.use(cors({
    origin: '*',
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health checks
  app.get('/health', healthController.basic.bind(healthController));
  app.get('/health/live', healthController.live.bind(healthController));
  app.get('/health/ready', healthController.ready.bind(healthController));

  // API Routes (without rate limiting for tests - rate limiting is disabled in test environment)
  app.use('/api', routes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Helper to make authenticated requests
 */
export function authenticatedRequest(
  app: express.Application,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  path: string,
  token: string,
  body?: any
) {
  const req = request(app)[method](path)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  if (body) {
    req.send(body);
  }

  return req;
}

/**
 * Setup test environment before each test
 */
export async function setupTestEnvironment() {
  await cleanDatabase();
}

