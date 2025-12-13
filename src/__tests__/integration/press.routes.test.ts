import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { seedTestData } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { Role } from '@prisma/client';

describe('Press Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('GET /api/v1/press', () => {
    it('should return paginated press releases (public)', async () => {
      await global.prisma.pressRelease.createMany({
        data: [
          {
            title: 'Release 1',
            slug: 'release-1',
            content: 'Content 1',
            publishedAt: new Date(),
            featured: false,
          },
          {
            title: 'Release 2',
            slug: 'release-2',
            content: 'Content 2',
            publishedAt: new Date(),
            featured: true,
          },
        ],
      });

      const response = await request(app)
        .get('/api/v1/press')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter by featured', async () => {
      // Clean any existing press releases first to ensure test isolation
      await global.prisma.pressRelease.deleteMany({});
      
      // Create test data with explicit featured values
      const featuredRelease = await global.prisma.pressRelease.create({
        data: {
          title: 'Featured Release',
          slug: 'featured-release',
          content: 'Content',
          publishedAt: new Date(),
          featured: true,
        },
      });
      
      const regularRelease = await global.prisma.pressRelease.create({
        data: {
          title: 'Regular Release',
          slug: 'regular-release',
          content: 'Content',
          publishedAt: new Date(),
          featured: false,
        },
      });

      // Verify test data was created correctly
      const allPressReleases = await global.prisma.pressRelease.findMany({});
      expect(allPressReleases.length).toBe(2);
      expect(allPressReleases.find((p) => p.id === featuredRelease.id)?.featured).toBe(true);
      expect(allPressReleases.find((p) => p.id === regularRelease.id)?.featured).toBe(false);

      // Test featured=true filter
      const featuredResponse = await request(app)
        .get('/api/v1/press?featured=true')
        .expect(200);

      expect(featuredResponse.body.data).toBeDefined();
      expect(Array.isArray(featuredResponse.body.data)).toBe(true);
      // Verify we only get featured items
      expect(featuredResponse.body.data.length).toBe(1);
      expect(featuredResponse.body.data[0].id).toBe(featuredRelease.id);
      expect(featuredResponse.body.data[0].featured).toBe(true);
      
      // Test featured=false filter
      const nonFeaturedResponse = await request(app)
        .get('/api/v1/press?featured=false')
        .expect(200);

      expect(nonFeaturedResponse.body.data).toBeDefined();
      expect(Array.isArray(nonFeaturedResponse.body.data)).toBe(true);
      // Verify we only get non-featured items
      expect(nonFeaturedResponse.body.data.length).toBe(1);
      expect(nonFeaturedResponse.body.data[0].id).toBe(regularRelease.id);
      expect(nonFeaturedResponse.body.data[0].featured).toBe(false);
    });
  });

  describe('GET /api/v1/press/:slug', () => {
    it('should return press release by slug (public)', async () => {
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'Test Release',
          slug: 'test-release',
          content: 'Test content',
          publishedAt: new Date(),
        },
      });

      const response = await request(app)
        .get('/api/v1/press/test-release')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.slug).toBe(release.slug);
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app)
        .get('/api/v1/press/non-existent-slug')
        .expect(404);
    });
  });

  describe('POST /api/v1/press', () => {
    it('should create press release for admin/editor', async () => {
      const { editor } = await seedTestData();
      const token = authService.generateToken(editor.id, editor.email, editor.role as Role);

      const releaseData = {
        title: 'New Release',
        slug: 'new-release',
        content: 'New release content',
        publishedAt: new Date().toISOString(),
        featured: false,
      };

      const response = await request(app)
        .post('/api/v1/press')
        .set('Authorization', `Bearer ${token}`)
        .send(releaseData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe(releaseData.title);
      expect(response.body.data.slug).toBe(releaseData.slug);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const releaseData = {
        title: 'New Release',
        slug: 'new-release',
        content: 'Content',
        publishedAt: new Date().toISOString(),
      };

      await request(app)
        .post('/api/v1/press')
        .set('Authorization', `Bearer ${token}`)
        .send(releaseData)
        .expect(403);
    });

    it('should return 409 for duplicate slug', async () => {
      const { admin } = await seedTestData();
      const existing = await global.prisma.pressRelease.create({
        data: {
          title: 'Existing',
          slug: 'existing-slug',
          content: 'Content',
          publishedAt: new Date(),
        },
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const releaseData = {
        title: 'New Release',
        slug: existing.slug,
        content: 'Content',
        publishedAt: new Date().toISOString(),
      };

      await request(app)
        .post('/api/v1/press')
        .set('Authorization', `Bearer ${token}`)
        .send(releaseData)
        .expect(409);
    });
  });

  describe('PUT /api/v1/press/:id', () => {
    it('should update press release for admin/editor', async () => {
      const { editor } = await seedTestData();
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'Original Title',
          slug: 'original-slug',
          content: 'Original content',
          publishedAt: new Date(),
        },
      });

      const token = authService.generateToken(editor.id, editor.email, editor.role as Role);

      const updateData = {
        title: 'Updated Title',
        featured: true,
      };

      const response = await request(app)
        .put(`/api/v1/press/${release.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.featured).toBe(updateData.featured);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'Test Release',
          slug: 'test-release',
          content: 'Content',
          publishedAt: new Date(),
        },
      });

      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .put(`/api/v1/press/${release.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated' })
        .expect(403);
    });
  });

  describe('DELETE /api/v1/press/:id', () => {
    it('should delete press release for admin', async () => {
      const { admin } = await seedTestData();
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'To Delete',
          slug: 'to-delete',
          content: 'Content',
          publishedAt: new Date(),
        },
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/press/${release.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deleted = await global.prisma.pressRelease.findUnique({
        where: { id: release.id },
      });
      expect(deleted).toBeNull();
    });

    it('should return 403 for non-admin', async () => {
      const { editor } = await seedTestData();
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'To Delete',
          slug: 'to-delete',
          content: 'Content',
          publishedAt: new Date(),
        },
      });

      const token = authService.generateToken(editor.id, editor.email, editor.role as Role);

      await request(app)
        .delete(`/api/v1/press/${release.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });
});

