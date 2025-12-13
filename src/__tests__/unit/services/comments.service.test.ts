import { commentsService } from '../../../services/comments.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase, seedTestData, createTestPost, createTestUser } from '../../helpers/db.helper';
import { CommentStatus } from '@prisma/client';

describe('CommentsService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('getAll', () => {
    it('should return paginated comments', async () => {
      const { post } = await seedTestData();
      await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Test comment',
          status: CommentStatus.APPROVED,
        },
      });

      const result = await commentsService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
    });

    it('should filter by postId', async () => {
      const { post, author } = await seedTestData();
      const post2 = await createTestPost({
        title: 'Post 2',
        slug: 'post-2',
        authorId: author.id,
      });

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
            postId: post2.id,
            authorName: 'Commenter 2',
            authorEmail: 'c2@test.com',
            content: 'Comment 2',
            status: CommentStatus.APPROVED,
          },
        ],
      });

      const result = await commentsService.getAll({ postId: post.id });

      expect(result.data.every((c) => c.postId === post.id)).toBe(true);
    });

    it('should only show approved comments by default', async () => {
      const { post } = await seedTestData();
      await global.prisma.comment.createMany({
        data: [
          {
            postId: post.id,
            authorName: 'Approved',
            authorEmail: 'approved@test.com',
            content: 'Approved comment',
            status: CommentStatus.APPROVED,
          },
          {
            postId: post.id,
            authorName: 'Pending',
            authorEmail: 'pending@test.com',
            content: 'Pending comment',
            status: CommentStatus.PENDING,
          },
        ],
      });

      const result = await commentsService.getAll({});

      expect(result.data.every((c) => c.status === CommentStatus.APPROVED)).toBe(true);
    });
  });

  describe('getById', () => {
    it('should get comment by ID', async () => {
      const { post } = await seedTestData();
      const comment = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Test comment',
          status: CommentStatus.APPROVED,
        },
      });

      const result = await commentsService.getById(comment.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(comment.id);
    });

    it('should throw error if comment not found', async () => {
      await expect(commentsService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const { post } = await seedTestData();

      const data = {
        postId: post.id,
        authorName: 'New Commenter',
        authorEmail: 'newcommenter@test.com',
        content: 'New comment content',
      };

      const comment = await commentsService.create(data);

      expect(comment).toBeDefined();
      expect(comment.authorName).toBe(data.authorName);
      expect(comment.content).toBe(data.content);
      expect(comment.status).toBe(CommentStatus.PENDING);
    });

    it('should create reply comment', async () => {
      const { post } = await seedTestData();
      const parent = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Parent',
          authorEmail: 'parent@test.com',
          content: 'Parent comment',
          status: CommentStatus.APPROVED,
        },
      });

      const data = {
        postId: post.id,
        parentId: parent.id,
        authorName: 'Reply',
        authorEmail: 'reply@test.com',
        content: 'Reply content',
      };

      const comment = await commentsService.create(data);

      expect(comment.parentId).toBe(parent.id);
    });

    it('should throw error if post not found', async () => {
      const data = {
        postId: 'non-existent-id',
        authorName: 'Commenter',
        authorEmail: 'commenter@test.com',
        content: 'Comment',
      };

      await expect(commentsService.create(data)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update comment', async () => {
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

      const updateData = {
        content: 'Updated content',
      };

      const updated = await commentsService.update(comment.id, updateData, user.id, 'AUTHOR');

      expect(updated.content).toBe(updateData.content);
    });

    it('should throw error if comment not found', async () => {
      await expect(
        commentsService.update('non-existent-id', { content: 'New' }, 'user-id', 'AUTHOR')
      ).rejects.toThrow(AppError);
    });

    it('should throw error if user tries to update another user\'s comment', async () => {
      const { post } = await seedTestData();
      const user = await createTestUser({ email: 'user1@test.com', name: 'User 1' });
      const user2 = await createTestUser({ email: 'user2@test.com', name: 'User 2' });

      const comment = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Comment',
          status: CommentStatus.PENDING,
          userId: user.id,
        },
      });

      await expect(
        commentsService.update(comment.id, { content: 'Hacked' }, user2.id, 'AUTHOR')
      ).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should soft delete comment', async () => {
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

      await commentsService.delete(comment.id, user.id, 'AUTHOR');

      const deleted = await global.prisma.comment.findUnique({
        where: { id: comment.id },
      });

      expect(deleted?.status).toBe(CommentStatus.REJECTED);
    });

    it('should throw error if comment not found', async () => {
      await expect(
        commentsService.delete('non-existent-id', 'user-id', 'AUTHOR')
      ).rejects.toThrow(AppError);
    });
  });

  describe('moderate', () => {
    it('should moderate comment', async () => {
      const { post } = await seedTestData();
      const comment = await global.prisma.comment.create({
        data: {
          postId: post.id,
          authorName: 'Commenter',
          authorEmail: 'commenter@test.com',
          content: 'Comment',
          status: CommentStatus.PENDING,
        },
      });

      const moderated = await commentsService.moderate(comment.id, CommentStatus.APPROVED);

      expect(moderated.status).toBe(CommentStatus.APPROVED);
    });

    it('should throw error if comment not found', async () => {
      await expect(
        commentsService.moderate('non-existent-id', CommentStatus.APPROVED)
      ).rejects.toThrow(AppError);
    });
  });
});

