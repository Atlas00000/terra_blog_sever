"use strict";
/**
 * Comments Service
 * Handles comment CRUD operations, moderation, and threading
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("@prisma/client");
class CommentsService {
    /**
     * Get all comments with filters
     */
    async getAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.postId) {
            where.postId = params.postId;
        }
        // For public endpoints, only show approved comments
        if (params.status) {
            where.status = params.status;
        }
        else {
            where.status = client_1.CommentStatus.APPROVED;
        }
        const [comments, total] = await Promise.all([
            prisma_1.default.comment.findMany({
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
                            status: client_1.CommentStatus.APPROVED,
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
            prisma_1.default.comment.count({ where }),
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
    async getById(id) {
        const comment = await prisma_1.default.comment.findUnique({
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
                        status: client_1.CommentStatus.APPROVED,
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
            throw new error_middleware_1.AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
        }
        return {
            ...comment,
            replyCount: comment._count.replies,
        };
    }
    /**
     * Create comment
     */
    async create(data) {
        // Verify post exists
        const post = await prisma_1.default.post.findFirst({
            where: {
                id: data.postId,
                deletedAt: null,
                status: 'PUBLISHED',
            },
        });
        if (!post) {
            throw new error_middleware_1.AppError('POST_NOT_FOUND', 'Post not found or not published', 404);
        }
        // If parentId provided, verify parent comment exists
        if (data.parentId) {
            const parent = await prisma_1.default.comment.findUnique({
                where: { id: data.parentId },
            });
            if (!parent) {
                throw new error_middleware_1.AppError('PARENT_COMMENT_NOT_FOUND', 'Parent comment not found', 404);
            }
            // Ensure parent is on the same post
            if (parent.postId !== data.postId) {
                throw new error_middleware_1.AppError('INVALID_PARENT', 'Parent comment must be on the same post', 400);
            }
        }
        // Create comment
        const comment = await prisma_1.default.comment.create({
            data: {
                postId: data.postId,
                parentId: data.parentId,
                authorName: data.authorName,
                authorEmail: data.authorEmail,
                authorUrl: data.authorUrl,
                content: data.content,
                userId: data.userId,
                status: client_1.CommentStatus.PENDING, // Default to pending for moderation
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
    async update(id, data, userId, userRole) {
        const comment = await prisma_1.default.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new error_middleware_1.AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
        }
        // Check permissions
        // Admin/Editor can update any comment, users can only update their own
        if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && comment.userId !== userId) {
            throw new error_middleware_1.AppError('FORBIDDEN', 'You can only update your own comments', 403);
        }
        const updated = await prisma_1.default.comment.update({
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
    async delete(id, userId, userRole) {
        const comment = await prisma_1.default.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new error_middleware_1.AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
        }
        // Check permissions
        if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && comment.userId !== userId) {
            throw new error_middleware_1.AppError('FORBIDDEN', 'You can only delete your own comments', 403);
        }
        // Mark as rejected instead of deleting
        await prisma_1.default.comment.update({
            where: { id },
            data: {
                status: client_1.CommentStatus.REJECTED,
            },
        });
        return { message: 'Comment deleted successfully' };
    }
    /**
     * Moderate comment (approve/reject/spam)
     */
    async moderate(id, status) {
        const comment = await prisma_1.default.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new error_middleware_1.AppError('COMMENT_NOT_FOUND', 'Comment not found', 404);
        }
        const updated = await prisma_1.default.comment.update({
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
exports.commentsService = new CommentsService();
//# sourceMappingURL=comments.service.js.map