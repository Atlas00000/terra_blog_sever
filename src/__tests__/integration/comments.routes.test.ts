import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { createTestPost, createTestUser, seedTestData } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { CommentStatus, Role } from '@prisma/client';

describe('Comments Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('GET /api/v1/comments', () => {
    it('should return paginated approved comments (public)', async () => {
      const { post } = await seedTestData();
      await global.prisma.comment.createMany({
        data: [
          {
            postId: post.id,
            authorName: 'Commenter 1',
            authorEmail: 'c1@test.com',
            content: 'Comment 1',
            status: CommentStatus.APPROVED,
          },
          {
            postId: post.id,
            authorName: 'Commenter 2',
            authorEmail: 'c2@test.com',
            content: 'Comment 2',
            status: CommentStatus.APPROVED,
          },
        ],
      });

      const response = await request(app)
        .get('/api/v1/comments')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.every((c: any) => c.status === CommentStatus.APPROVED)).toBe(true);
    });

    it('should filter by postId', async () => {
      const { author } = await seedTestData();
      const post1 = await createTestPost({ title: 'Post 1', slug: 'post-1', authorId: author.id });
      const post2 = await createTestPost({ title: 'Post 2', slug: 'post-2', authorId: author.id });

      await global.prisma.comment.createMany({
        data: [
          {
            postId: post1.id,
            authorName: 'Commenter',
            authorEmail: 'c@test.com',
            content: 'Comment on post 1',
            status: CommentStatus.APPROVED,
          },
          {
            postId: post2.id,
            authorName: 'Commenter',
            authorEmail: 'c@test.com',
            content: 'Comment on post 2',
            status: CommentStatus.APPROVED,
          },
        ],
      });

      const response = await request(app)
        .get(`/api/v1/comments?postId=${post1.id}`)
        .expect(200);

      expect(response.body.data.every((c: any) => c.postId === post1.id)).toBe(true);
    });
  });

  describe('POST /api/v1/comments', () => {
    it('should create comment (public)', async () => {
      const { post } = await seedTestData();

      const commentData = {
        postId: post.id,
        authorName: 'New Commenter',
        authorEmail: 'newcommenter@test.com',
        content: 'New comment content',
      };

      const response = await request(app)
        .post('/api/v1/comments')
        .send(commentData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.authorName).toBe(commentData.authorName);
      expect(response.body.data.status).toBe(CommentStatus.PENDING);
    });

    it('should return 400 for invalid data', async () => {
      const { post } = await seedTestData();

      const commentData = {
        postId: post.id,
        authorName: '', // Invalid: empty name
        authorEmail: 'commenter@test.com',
        content: 'Comment',
      };

      await request(app)
        .post('/api/v1/comments')
        .send(commentData)
        .expect(400);
    });

    it('should return 404 for non-existent post', async () => {
      // Use a valid CUID format that doesn't exist
      const fakePostId = 'clx00000000000000000000000';
      const commentData = {
        postId: fakePostId,
        authorName: 'Commenter',
        authorEmail: 'commenter@test.com',
        content: 'Comment',
      };

      await request(app)
        .post('/api/v1/comments')
        .send(commentData)
        .expect(404);
    });
  });

  describe('PUT /api/v1/comments/:id', () => {
    it('should update comment for author', async () => {
      const { post } = await seedTestData();
      const user = await createTestUser({ email: 'user@test.com', name: 'User' });
      const comment = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Original content',
          status: CommentStatus.PENDING,
          userId: user.id,
        },
      });

      const token = authService.generateToken(user.id, user.email, user.role as Role);

      const updateData = {
        content: 'Updated content',
      };

      const response = await request(app)
        .put(`/api/v1/comments/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.content).toBe(updateData.content);
    });

    it('should return 403 when user tries to update another user\'s comment', async () => {
      const { post } = await seedTestData();
      const user1 = await createTestUser({ email: 'user1@test.com', name: 'User 1' });
      const user2 = await createTestUser({ email: 'user2@test.com', name: 'User 2' });

      const comment = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Comment',
          status: CommentStatus.PENDING,
          userId: user1.id,
        },
      });

      const token = authService.generateToken(user2.id, user2.email, user2.role as Role);

      await request(app)
        .put(`/api/v1/comments/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Hacked content' })
        .expect(403);
    });
  });

  describe('PUT /api/v1/comments/:id/moderate', () => {
    it('should moderate comment for admin', async () => {
      const { admin, post } = await seedTestData();
      const comment = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Comment',
          status: CommentStatus.PENDING,
        },
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const response = await request(app)
        .put(`/api/v1/comments/${comment.id}/moderate`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: CommentStatus.APPROVED })
        .expect(200);

      expect(response.body.data.status).toBe(CommentStatus.APPROVED);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author, post } = await seedTestData();
      const comment = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Comment',
          status: CommentStatus.PENDING,
        },
      });

      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .put(`/api/v1/comments/${comment.id}/moderate`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: CommentStatus.APPROVED })
        .expect(403);
    });
  });

  describe('DELETE /api/v1/comments/:id', () => {
    it('should soft delete comment for author', async () => {
      const { post } = await seedTestData();
      const user = await createTestUser({ email: 'user@test.com', name: 'User' });
      const comment = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Comment',
          status: CommentStatus.APPROVED,
          userId: user.id,
        },
      });

      const token = authService.generateToken(user.id, user.email, user.role as Role);

      await request(app)
        .delete(`/api/v1/comments/${comment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deleted = await global.prisma.comment.findUnique({
        where: { id: comment.id },
      });
      // Comments use status-based soft deletes, check that status is updated
      expect(deleted?.status).toBe(CommentStatus.REJECTED);
    });
  });
});

