/**
 * Comments Service
 * Handles comment CRUD operations, moderation, and threading
 */

import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { CommentStatus } from '@prisma/client';

export interface CreateCommentData {
  postId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  content: string;
  userId?: string;
}

export interface UpdateCommentData {
  content?: string;
  status?: CommentStatus;
}

export interface CommentQueryParams {
  page?: number;
  limit?: number;
  postId?: string;
  status?: CommentStatus;
}

class CommentsService {
  /**
   * Get all comments with filters
   */
  async getAll(params: CommentQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.postId) {
      where.postId = params.postId;
    }

    // For public endpoints, only show approved comments
    if (params.status) {
      where.status = params.status;
    } else {
      where.status = CommentStatus.APPROVED;
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          replies: {
            where: {
              status: CommentStatus.APPROVED,
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      data: comments.map((comment) => ({
        ...comment,
        replyCount: comment._count.replies,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get comment by ID
   */
  async getById(id: string) {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        replies: {
          where: {
            status: CommentStatus.APPROVED,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!comment) {
      throw new AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
    }

    return {
      ...comment,
      replyCount: comment._count.replies,
    };
  }

  /**
   * Create comment
   */
  async create(data: CreateCommentData) {
    // Verify post exists
    const post = await prisma.post.findFirst({
      where: {
        id: data.postId,
        deletedAt: null,
        status: 'PUBLISHED',
      },
    });

    if (!post) {
      throw new AppError('POST_NOT_FOUND', 'Post not found or not published', 404);
    }

    // If parentId provided, verify parent comment exists
    if (data.parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new AppError('PARENT_COMMENT_NOT_FOUND', 'Parent comment not found', 404);
      }

      // Ensure parent is on the same post
      if (parent.postId !== data.postId) {
        throw new AppError('INVALID_PARENT', 'Parent comment must be on the same post', 400);
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        postId: data.postId,
        parentId: data.parentId,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        authorUrl: data.authorUrl,
        content: data.content,
        userId: data.userId,
        status: CommentStatus.PENDING, // Default to pending for moderation
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return comment;
  }

  /**
   * Update comment
   */
  async update(id: string, data: UpdateCommentData, userId: string, userRole: string) {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
    }

    // Check permissions
    // Admin/Editor can update any comment, users can only update their own
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && comment.userId !== userId) {
      throw new AppError('FORBIDDEN', 'You can only update your own comments', 403);
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: {
        ...(data.content && { content: data.content }),
        ...(data.status && { status: data.status }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Delete comment (soft delete via status change)
   */
  async delete(id: string, userId: string, userRole: string) {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
    }

    // Check permissions
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && comment.userId !== userId) {
      throw new AppError('FORBIDDEN', 'You can only delete your own comments', 403);
    }

    // Mark as rejected instead of deleting
    await prisma.comment.update({
      where: { id },
      data: {
        status: CommentStatus.REJECTED,
      },
    });

    return { message: 'Comment deleted successfully' };
  }

  /**
   * Moderate comment (approve/reject/spam)
   */
  async moderate(id: string, status: CommentStatus) {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return updated;
  }
}

export const commentsService = new CommentsService();

