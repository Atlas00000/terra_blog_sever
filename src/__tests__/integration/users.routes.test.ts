import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { createTestUser, seedTestData } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { Role } from '@prisma/client';

describe('Users Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('GET /api/v1/users', () => {
    it('should return paginated users for admin', async () => {
      const { admin } = await seedTestData();
      await createTestUser({ email: 'user1@test.com', name: 'User 1' });
      await createTestUser({ email: 'user2@test.com', name: 'User 2' });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.data.length).toBeGreaterThanOrEqual(3); // admin + 2 users
    });

    it('should return 403 for non-admin user', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/v1/users')
        .expect(401);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by ID for authenticated user', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const response = await request(app)
        .get(`/api/v1/users/${author.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(author.id);
      expect(response.body.data.email).toBe(author.email);
    });

    it('should return 401 without authentication', async () => {
      const { author } = await seedTestData();

      await request(app)
        .get(`/api/v1/users/${author.id}`)
        .expect(401);
    });

    it('should return 404 for non-existent user', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      // Use a valid CUID format that doesn't exist
      const fakeId = 'clx00000000000000000000000';
      await request(app)
        .get(`/api/v1/users/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /api/v1/users/slug/:slug', () => {
    it('should return user by slug (public)', async () => {
      const { author } = await seedTestData();

      const response = await request(app)
        .get(`/api/v1/users/slug/${author.slug}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.slug).toBe(author.slug);
      expect(response.body.data.email).toBe(author.email);
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app)
        .get('/api/v1/users/slug/non-existent-slug')
        .expect(404);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create user for admin', async () => {
      const { admin } = await seedTestData();
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const userData = {
        email: 'newuser@test.com',
        password: 'test123456',
        name: 'New User',
        role: 'AUTHOR',
      };

      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(userData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.name).toBe(userData.name);
    });

    it('should return 403 for non-admin user', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const userData = {
        email: 'newuser@test.com',
        password: 'test123456',
        name: 'New User',
      };

      await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(userData)
        .expect(403);
    });

    it('should return 400 for invalid data', async () => {
      const { admin } = await seedTestData();
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const userData = {
        email: 'invalid-email',
        password: 'short',
      };

      await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(userData)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      const { admin, author } = await seedTestData();
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const userData = {
        email: author.email,
        password: 'test123456',
        name: 'Duplicate User',
      };

      await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(userData)
        .expect(409);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user for admin', async () => {
      const { admin, author } = await seedTestData();
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
      };

      const response = await request(app)
        .put(`/api/v1/users/${author.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.bio).toBe(updateData.bio);
    });

    it('should allow user to update own profile', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const updateData = {
        name: 'My Updated Name',
        bio: 'My bio',
      };

      const response = await request(app)
        .put(`/api/v1/users/${author.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should return 403 when user tries to update another user', async () => {
      const { author } = await seedTestData();
      const otherUser = await createTestUser({ email: 'other@test.com', name: 'Other User' });
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const updateData = {
        name: 'Hacked Name',
      };

      await request(app)
        .put(`/api/v1/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(403);
    });

    it('should return 401 without authentication', async () => {
      const { author } = await seedTestData();

      await request(app)
        .put(`/api/v1/users/${author.id}`)
        .send({ name: 'New Name' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete user for admin', async () => {
      const { admin } = await seedTestData();
      const userToDelete = await createTestUser({ email: 'todelete@test.com', name: 'To Delete' });
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify user is deleted
      const deleted = await global.prisma.user.findUnique({
        where: { id: userToDelete.id },
      });
      expect(deleted).toBeNull();
    });

    it('should return 403 for non-admin user', async () => {
      const { author } = await seedTestData();
      const userToDelete = await createTestUser({ email: 'todelete@test.com', name: 'To Delete' });
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .delete(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 401 without authentication', async () => {
      const userToDelete = await createTestUser({ email: 'todelete@test.com', name: 'To Delete' });

      await request(app)
        .delete(`/api/v1/users/${userToDelete.id}`)
        .expect(401);
    });

    it('should return 404 for non-existent user', async () => {
      const { admin } = await seedTestData();
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      // Use a valid CUID format that doesn't exist
      const fakeId = 'clx00000000000000000000000';
      await request(app)
        .delete(`/api/v1/users/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

