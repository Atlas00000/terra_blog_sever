import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { CommentStatus, PostStatus } from '@prisma/client';
import { cacheService, cacheKeys } from './cache.service';

export interface CreateCommentData {
  slug: string;
  content: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  userId?: string;
}

export interface ListCommentsParams {
  slug: string;
  page?: number;
  limit?: number;
}

export interface AdminListCommentsParams {
  page?: number;
  limit?: number;
  status?: CommentStatus;
  postId?: string;
  postSlug?: string;
}

class CommentsService {
  /**
   * Public: list approved comments for a post
   */
  async listForPost(params: ListCommentsParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const post = await prisma.post.findFirst({
      where: { slug: params.slug, status: PostStatus.PUBLISHED, deletedAt: null },
      select: { id: true },
    });

    if (!post) {
      throw new AppError('POST_NOT_FOUND', 'Post not found or not published', 404);
    }

    const where = {
      postId: post.id,
      status: CommentStatus.APPROVED,
    };

    const cacheKey =
      process.env.NODE_ENV !== 'development'
        ? cacheKeys.commentList(post.id, page, limit)
        : null;

    if (cacheKey) {
      const cached = await cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          content: true,
          authorName: true,
          authorUrl: true,
          parentId: true,
          createdAt: true,
        },
      }),
      prisma.comment.count({ where }),
    ]);

    const result = {
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    if (cacheKey) {
      await cacheService.set(cacheKey, result, 600); // 10 minutes
    }

    return result;
  }

  /**
   * Public: create comment (pending by default)
   */
  async create(data: CreateCommentData) {
    const post = await prisma.post.findFirst({
      where: { slug: data.slug, status: PostStatus.PUBLISHED, deletedAt: null },
      select: { id: true },
    });

    if (!post) {
      throw new AppError('POST_NOT_FOUND', 'Post not found or not published', 404);
    }

    // Verify parent belongs to same post if provided
    if (data.parentId) {
      const parent = await prisma.comment.findFirst({
        where: { id: data.parentId, postId: post.id },
        select: { id: true },
      });
      if (!parent) {
        throw new AppError('COMMENT_NOT_FOUND', 'Parent comment not found', 404);
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        parentId: data.parentId,
        content: data.content,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        authorUrl: data.authorUrl,
        status: CommentStatus.PENDING,
        userId: data.userId,
      },
    });

    // Invalidate cache
    await cacheService.invalidateResource('comment');
    await cacheService.deletePattern(`comment:list:${post.id}:*`);

    return comment;
  }

  /**
   * Admin: list comments with filters
   */
  async adminList(params: AdminListCommentsParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.postId) {
      where.postId = params.postId;
    }

    if (params.postSlug) {
      const post = await prisma.post.findUnique({
        where: { slug: params.postSlug },
        select: { id: true },
      });
      if (post) {
        where.postId = post.id;
      } else {
        return {
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        };
      }
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: { id: true, title: true, slug: true },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin: update comment status
   */
  async updateStatus(id: string, status: CommentStatus) {
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!comment) {
      throw new AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { status },
    });

    // Invalidate cache
    await cacheService.invalidateResource('comment', id);
    await cacheService.deletePattern('comment:list:*');

    return updated;
  }

  /**
   * Admin: delete (soft delete)
   */
  async softDelete(id: string) {
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!comment) {
      throw new AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
    }

    await prisma.comment.update({
      where: { id },
      data: { status: CommentStatus.REJECTED },
    });

    // Invalidate cache
    await cacheService.invalidateResource('comment', id);
    await cacheService.deletePattern('comment:list:*');

    return { message: 'Comment deleted successfully' };
  }
}

export const commentsService = new CommentsService();
