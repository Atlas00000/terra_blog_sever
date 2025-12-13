import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { createTestCategory, seedTestData, createTestPost } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { Role } from '@prisma/client';

describe('Categories Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('GET /api/v1/categories', () => {
    it('should return paginated categories (public)', async () => {
      await createTestCategory({ name: 'Technology', slug: 'technology' });
      await createTestCategory({ name: 'Business', slug: 'business' });

      const response = await request(app)
        .get('/api/v1/categories')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should search categories', async () => {
      await createTestCategory({ name: 'Technology', slug: 'technology' });
      await createTestCategory({ name: 'Science', slug: 'science' });

      const response = await request(app)
        .get('/api/v1/categories?search=Tech')
        .expect(200);

      expect(response.body.data.some((c: any) => c.name.includes('Tech'))).toBe(true);
    });
  });

  describe('GET /api/v1/categories/:slug', () => {
    it('should return category by slug (public)', async () => {
      const category = await createTestCategory({ name: 'Technology', slug: 'technology' });

      const response = await request(app)
        .get('/api/v1/categories/technology')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.slug).toBe(category.slug);
      expect(response.body.data.postCount).toBeDefined();
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app)
        .get('/api/v1/categories/non-existent-slug')
        .expect(404);
    });
  });

  describe('POST /api/v1/categories', () => {
    it('should create category for admin', async () => {
      const { admin } = await seedTestData();
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const categoryData = {
        name: 'New Category',
        slug: 'new-category',
        description: 'New category description',
      };

      const response = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(categoryData.name);
      expect(response.body.data.slug).toBe(categoryData.slug);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const categoryData = {
        name: 'New Category',
        slug: 'new-category',
      };

      await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryData)
        .expect(403);
    });

    it('should return 400 for invalid data', async () => {
      const { admin } = await seedTestData();
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const categoryData = {
        name: '', // Invalid: empty name
        slug: 'new-category',
      };

      await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryData)
        .expect(400);
    });

    it('should return 409 for duplicate name', async () => {
      const { admin } = await seedTestData();
      const existing = await createTestCategory({ name: 'Existing', slug: 'existing' });
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const categoryData = {
        name: existing.name,
        slug: 'different-slug',
      };

      await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryData)
        .expect(409);
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    it('should update category for admin', async () => {
      const { admin } = await seedTestData();
      const category = await createTestCategory({ name: 'Original', slug: 'original' });
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const updateData = {
        name: 'Updated Category',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/v1/categories/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const category = await createTestCategory({ name: 'Test', slug: 'test' });
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .put(`/api/v1/categories/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' })
        .expect(403);
    });

    it('should return 401 without authentication', async () => {
      const category = await createTestCategory({ name: 'Test', slug: 'test' });

      await request(app)
        .put(`/api/v1/categories/${category.id}`)
        .send({ name: 'Updated' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should delete category for admin', async () => {
      const { admin } = await seedTestData();
      const category = await createTestCategory({ name: 'To Delete', slug: 'to-delete' });
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/categories/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify category is deleted
      const deleted = await global.prisma.category.findUnique({
        where: { id: category.id },
      });
      expect(deleted).toBeNull();
    });

    it('should return 403 for non-admin', async () => {
      const { editor } = await seedTestData();
      const category = await createTestCategory({ name: 'To Delete', slug: 'to-delete' });
      const token = authService.generateToken(editor.id, editor.email, editor.role as Role);

      await request(app)
        .delete(`/api/v1/categories/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 409 if category has posts', async () => {
      const { admin, author, category } = await seedTestData();
      await createTestPost({
        title: 'Post with Category',
        slug: 'post-with-category',
        authorId: author.id,
        categoryIds: [category.id],
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/categories/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
    });

    it('should return 401 without authentication', async () => {
      const category = await createTestCategory({ name: 'To Delete', slug: 'to-delete' });

      await request(app)
        .delete(`/api/v1/categories/${category.id}`)
        .expect(401);
    });
  });
});

