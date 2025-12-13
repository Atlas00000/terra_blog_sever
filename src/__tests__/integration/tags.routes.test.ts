import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { createTestTag, seedTestData, createTestPost } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { Role } from '@prisma/client';

describe('Tags Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('GET /api/v1/tags', () => {
    it('should return paginated tags (public)', async () => {
      await createTestTag({ name: 'JavaScript', slug: 'javascript' });
      await createTestTag({ name: 'TypeScript', slug: 'typescript' });

      const response = await request(app)
        .get('/api/v1/tags')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should search tags', async () => {
      await createTestTag({ name: 'JavaScript', slug: 'javascript' });
      await createTestTag({ name: 'Python', slug: 'python' });

      const response = await request(app)
        .get('/api/v1/tags?search=Script')
        .expect(200);

      expect(response.body.data.some((t: any) => t.name.includes('Script'))).toBe(true);
    });
  });

  describe('GET /api/v1/tags/:slug', () => {
    it('should return tag by slug (public)', async () => {
      const tag = await createTestTag({ name: 'JavaScript', slug: 'javascript' });

      const response = await request(app)
        .get('/api/v1/tags/javascript')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.slug).toBe(tag.slug);
      expect(response.body.data.postCount).toBeDefined();
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app)
        .get('/api/v1/tags/non-existent-slug')
        .expect(404);
    });
  });

  describe('POST /api/v1/tags', () => {
    it('should create tag for admin/editor', async () => {
      const { editor } = await seedTestData();
      const token = authService.generateToken(editor.id, editor.email, editor.role as Role);

      const tagData = {
        name: 'New Tag',
        slug: 'new-tag',
        description: 'New tag description',
      };

      const response = await request(app)
        .post('/api/v1/tags')
        .set('Authorization', `Bearer ${token}`)
        .send(tagData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(tagData.name);
      expect(response.body.data.slug).toBe(tagData.slug);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const tagData = {
        name: 'New Tag',
        slug: 'new-tag',
      };

      await request(app)
        .post('/api/v1/tags')
        .set('Authorization', `Bearer ${token}`)
        .send(tagData)
        .expect(403);
    });

    it('should return 409 for duplicate name', async () => {
      const { admin } = await seedTestData();
      const existing = await createTestTag({ name: 'Existing', slug: 'existing' });
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const tagData = {
        name: existing.name,
        slug: 'different-slug',
      };

      await request(app)
        .post('/api/v1/tags')
        .set('Authorization', `Bearer ${token}`)
        .send(tagData)
        .expect(409);
    });
  });

  describe('PUT /api/v1/tags/:id', () => {
    it('should update tag for admin/editor', async () => {
      const { editor } = await seedTestData();
      const tag = await createTestTag({ name: 'Original', slug: 'original' });
      const token = authService.generateToken(editor.id, editor.email, editor.role as Role);

      const updateData = {
        name: 'Updated Tag',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/v1/tags/${tag.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const tag = await createTestTag({ name: 'Test', slug: 'test' });
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .put(`/api/v1/tags/${tag.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' })
        .expect(403);
    });
  });

  describe('DELETE /api/v1/tags/:id', () => {
    it('should delete tag for admin', async () => {
      const { admin } = await seedTestData();
      const tag = await createTestTag({ name: 'To Delete', slug: 'to-delete' });
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/tags/${tag.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deleted = await global.prisma.tag.findUnique({
        where: { id: tag.id },
      });
      expect(deleted).toBeNull();
    });

    it('should return 409 if tag has posts', async () => {
      const { admin, author, tag } = await seedTestData();
      await createTestPost({
        title: 'Post with Tag',
        slug: 'post-with-tag',
        authorId: author.id,
        tagIds: [tag.id],
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/tags/${tag.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
    });
  });
});

