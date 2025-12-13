import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { createTestPost, createTestUser, seedTestData, createTestCategory, createTestTag } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { PostStatus, Role } from '@prisma/client';

describe('Posts Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('GET /api/v1/posts', () => {
    it('should return paginated published posts (public)', async () => {
      const { author } = await seedTestData();
      await createTestPost({
        title: 'Published Post 1',
        slug: 'published-post-1',
        authorId: author.id,
        status: PostStatus.PUBLISHED,
      });
      await createTestPost({
        title: 'Published Post 2',
        slug: 'published-post-2',
        authorId: author.id,
        status: PostStatus.PUBLISHED,
      });

      const response = await request(app)
        .get('/api/v1/posts')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.data.every((p: any) => p.status === PostStatus.PUBLISHED)).toBe(true);
    });

    it('should filter by category', async () => {
      const { author } = await seedTestData();
      const category1 = await createTestCategory({ name: 'Tech', slug: 'tech' });
      const category2 = await createTestCategory({ name: 'Business', slug: 'business' });

      await createTestPost({
        title: 'Tech Post',
        slug: 'tech-post',
        authorId: author.id,
        categoryIds: [category1.id],
        status: PostStatus.PUBLISHED,
      });
      await createTestPost({
        title: 'Business Post',
        slug: 'business-post',
        authorId: author.id,
        categoryIds: [category2.id],
        status: PostStatus.PUBLISHED,
      });

      const response = await request(app)
        .get('/api/v1/posts?category=tech')
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every((p: any) => 
        p.categories.some((c: any) => c.slug === 'tech')
      )).toBe(true);
    });

    it('should filter by tag', async () => {
      const { author } = await seedTestData();
      const tag1 = await createTestTag({ name: 'JavaScript', slug: 'javascript' });
      const tag2 = await createTestTag({ name: 'Python', slug: 'python' });

      await createTestPost({
        title: 'JS Post',
        slug: 'js-post',
        authorId: author.id,
        tagIds: [tag1.id],
        status: PostStatus.PUBLISHED,
      });
      await createTestPost({
        title: 'Python Post',
        slug: 'python-post',
        authorId: author.id,
        tagIds: [tag2.id],
        status: PostStatus.PUBLISHED,
      });

      const response = await request(app)
        .get('/api/v1/posts?tag=javascript')
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every((p: any) => 
        p.tags.some((t: any) => t.slug === 'javascript')
      )).toBe(true);
    });

    it('should search posts', async () => {
      const { author } = await seedTestData();
      await createTestPost({
        title: 'Technology Post',
        slug: 'tech-post',
        authorId: author.id,
        content: 'This is about technology',
        status: PostStatus.PUBLISHED,
      });
      await createTestPost({
        title: 'Business Post',
        slug: 'business-post',
        authorId: author.id,
        content: 'This is about business',
        status: PostStatus.PUBLISHED,
      });

      const response = await request(app)
        .get('/api/v1/posts?search=technology')
        .expect(200);

      expect(response.body.data.some((p: any) => p.title.includes('Technology'))).toBe(true);
    });

    it('should not return draft posts for public', async () => {
      const { author } = await seedTestData();
      await createTestPost({
        title: 'Draft Post',
        slug: 'draft-post',
        authorId: author.id,
        status: PostStatus.DRAFT,
      });

      const response = await request(app)
        .get('/api/v1/posts')
        .expect(200);

      expect(response.body.data.every((p: any) => p.status !== PostStatus.DRAFT)).toBe(true);
    });
  });

  describe('GET /api/v1/posts/:slug', () => {
    it('should return post by slug (public)', async () => {
      const { author, post } = await seedTestData();

      const response = await request(app)
        .get(`/api/v1/posts/${post.slug}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.slug).toBe(post.slug);
      expect(response.body.data.status).toBe(PostStatus.PUBLISHED);
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app)
        .get('/api/v1/posts/non-existent-slug')
        .expect(404);
    });

    it('should return 404 for draft post', async () => {
      const { author } = await seedTestData();
      await createTestPost({
        title: 'Draft Post',
        slug: 'draft-post',
        authorId: author.id,
        status: PostStatus.DRAFT,
      });

      await request(app)
        .get('/api/v1/posts/draft-post')
        .expect(404);
    });
  });

  describe('GET /api/v1/posts/id/:id', () => {
    it('should return post by ID for admin', async () => {
      const { admin, post } = await seedTestData();

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const response = await request(app)
        .get(`/api/v1/posts/id/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(post.id);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author, post } = await seedTestData();

      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .get(`/api/v1/posts/id/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('POST /api/v1/posts', () => {
    it('should create post for authenticated user', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const postData = {
        title: 'New Post',
        slug: 'new-post',
        excerpt: 'Post excerpt',
        content: 'This is the post content with enough words to calculate reading time.',
        status: PostStatus.DRAFT,
      };

      const response = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe(postData.title);
      expect(response.body.data.slug).toBe(postData.slug);
      expect(response.body.data.readingTime).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const postData = {
        title: 'New Post',
        slug: 'new-post',
        content: 'Content',
      };

      await request(app)
        .post('/api/v1/posts')
        .send(postData)
        .expect(401);
    });

    it('should return 400 for invalid data', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const postData = {
        title: '', // Invalid: empty title
        slug: 'new-post',
        content: 'Content',
      };

      await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData)
        .expect(400);
    });

    it('should return 409 for duplicate slug', async () => {
      const { author, post } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const postData = {
        title: 'Duplicate Slug',
        slug: post.slug,
        content: 'Content',
      };

      await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData)
        .expect(409);
    });
  });

  describe('PUT /api/v1/posts/:id', () => {
    it('should update post for author', async () => {
      const { author } = await seedTestData();
      const post = await createTestPost({
        title: 'Original Title',
        slug: 'original-post',
        authorId: author.id,
      });

      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const updateData = {
        title: 'Updated Title',
        content: 'Updated content with enough words to calculate reading time.',
      };

      const response = await request(app)
        .put(`/api/v1/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe(updateData.title);
    });

    it('should allow admin to update any post', async () => {
      const { admin, author } = await seedTestData();
      const post = await createTestPost({
        title: 'Original Title',
        slug: 'original-post',
        authorId: author.id,
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const updateData = {
        title: 'Admin Updated Title',
      };

      const response = await request(app)
        .put(`/api/v1/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe(updateData.title);
    });

    it('should return 403 when author tries to update another author\'s post', async () => {
      const { author } = await seedTestData();
      const otherAuthor = await createTestUser({ email: 'other@test.com', name: 'Other Author' });
      const post = await createTestPost({
        title: 'Other Post',
        slug: 'other-post',
        authorId: otherAuthor.id,
      });

      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .put(`/api/v1/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Hacked Title' })
        .expect(403);
    });

    it('should return 401 without authentication', async () => {
      const { author } = await seedTestData();
      const post = await createTestPost({
        title: 'Update Post',
        slug: 'update-post',
        authorId: author.id,
      });

      await request(app)
        .put(`/api/v1/posts/${post.id}`)
        .send({ title: 'New Title' })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/posts/:id', () => {
    it('should soft delete post for author', async () => {
      const { author } = await seedTestData();
      const post = await createTestPost({
        title: 'To Delete',
        slug: 'to-delete',
        authorId: author.id,
      });

      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .delete(`/api/v1/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify soft delete
      const deleted = await global.prisma.post.findUnique({
        where: { id: post.id },
      });
      expect(deleted?.deletedAt).toBeDefined();
    });

    it('should allow admin to delete any post', async () => {
      const { admin, author } = await seedTestData();
      const post = await createTestPost({
        title: 'To Delete',
        slug: 'to-delete',
        authorId: author.id,
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 403 when author tries to delete another author\'s post', async () => {
      const { author } = await seedTestData();
      const otherAuthor = await createTestUser({ email: 'other@test.com', name: 'Other Author' });
      const post = await createTestPost({
        title: 'Other Post',
        slug: 'other-post',
        authorId: otherAuthor.id,
      });

      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .delete(`/api/v1/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 401 without authentication', async () => {
      const { author } = await seedTestData();
      const post = await createTestPost({
        title: 'Delete Post',
        slug: 'delete-post',
        authorId: author.id,
      });

      await request(app)
        .delete(`/api/v1/posts/${post.id}`)
        .expect(401);
    });
  });
});

