import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { createTestUser } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { Role } from '@prisma/client';

describe('Auth Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'test123456',
        name: 'New User',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 409 if email already exists', async () => {
      await createTestUser({
        name: 'Existing User',
        email: 'existing@test.com',
        password: 'test123456',
      });

      const userData = {
        email: 'existing@test.com',
        password: 'test123456',
        name: 'Existing User',
      };

      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409);
    });

    it('should return 400 for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'test123456',
      };

      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should return 400 for short password', async () => {
      const userData = {
        email: 'user@test.com',
        password: 'short',
      };

      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a user with hashed password
      const hashedPassword = await authService.hashPassword('test123456');
      await createTestUser({
        name: 'Login User',
        email: 'login@test.com',
        password: hashedPassword,
      });
    });

    it('should login with correct credentials', async () => {
      const credentials = {
        email: 'login@test.com',
        password: 'test123456',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.user.email).toBe(credentials.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 401 for incorrect password', async () => {
      const credentials = {
        email: 'login@test.com',
        password: 'wrongpassword',
      };

      await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(401);
    });

    it('should return 401 for non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@test.com',
        password: 'test123456',
      };

      await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(401);
    });

    it('should return 400 for missing fields', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com' })
        .expect(400);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user with valid token', async () => {
      const user = await createTestUser({
        name: 'Me User',
        email: 'me@test.com',
        password: 'test123456',
      });

      const token = authService.generateToken(user.id, user.email, user.role as Role);

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(user.email);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});

