"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("@prisma/client");
class PostsService {
    /**
     * Calculate reading time in minutes
     */
    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
    /**
     * Get all posts with filters
     */
    async getAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        // Filter by status (default to PUBLISHED for public)
        if (params.status) {
            where.status = params.status;
        }
        else {
            where.status = 'PUBLISHED';
        }
        // Filter by category
        if (params.category) {
            where.categories = {
                some: {
                    slug: params.category,
                },
            };
        }
        // Filter by tag
        if (params.tag) {
            where.tags = {
                some: {
                    slug: params.tag,
                },
            };
        }
        // Filter by author
        if (params.author) {
            where.author = {
                slug: params.author,
            };
        }
        // Search
        if (params.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { excerpt: { contains: params.search, mode: 'insensitive' } },
                { content: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [posts, total] = await Promise.all([
            prisma_1.default.post.findMany({
                where,
                skip,
                take: limit,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true,
                            slug: true,
                        },
                    },
                    categories: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: {
                    publishedAt: 'desc',
                },
            }),
            prisma_1.default.post.count({ where }),
        ]);
        return {
            data: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get post by slug
     */
    async getBySlug(slug) {
        const post = await prisma_1.default.post.findFirst({
            where: {
                slug,
                deletedAt: null,
                status: 'PUBLISHED',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        slug: true,
                        bio: true,
                        socialLinks: true,
                    },
                },
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                products: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        if (!post) {
            throw new error_middleware_1.AppError('POST_NOT_FOUND', 'Post not found', 404);
        }
        return post;
    }
    /**
     * Get post by ID (for admin)
     */
    async getById(id) {
        const post = await prisma_1.default.post.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        slug: true,
                    },
                },
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                products: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        if (!post) {
            throw new error_middleware_1.AppError('POST_NOT_FOUND', 'Post not found', 404);
        }
        return post;
    }
    /**
     * Create post
     */
    async create(data, authorId) {
        // Check if slug is taken
        const existingPost = await prisma_1.default.post.findUnique({
            where: { slug: data.slug },
        });
        if (existingPost) {
            throw new error_middleware_1.AppError('SLUG_EXISTS', 'Post with this slug already exists', 409);
        }
        // Calculate reading time
        const readingTime = this.calculateReadingTime(data.content);
        // Create post
        const post = await prisma_1.default.post.create({
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                coverImage: data.coverImage,
                status: data.status || client_1.PostStatus.DRAFT,
                readingTime,
                authorId,
                publishedAt: data.status === client_1.PostStatus.PUBLISHED ? new Date() : null,
                categories: data.categoryIds
                    ? {
                        connect: data.categoryIds.map((id) => ({ id })),
                    }
                    : undefined,
                tags: data.tagIds
                    ? {
                        connect: data.tagIds.map((id) => ({ id })),
                    }
                    : undefined,
                products: data.productIds
                    ? {
                        connect: data.productIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        slug: true,
                    },
                },
                categories: true,
                tags: true,
                products: true,
            },
        });
        return post;
    }
    /**
     * Update post
     */
    async update(id, data, userId, userRole) {
        // Check if post exists
        const existingPost = await prisma_1.default.post.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingPost) {
            throw new error_middleware_1.AppError('POST_NOT_FOUND', 'Post not found', 404);
        }
        // Check permissions (author can only edit own posts, admin/editor can edit all)
        if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && existingPost.authorId !== userId) {
            throw new error_middleware_1.AppError('FORBIDDEN', 'You can only edit your own posts', 403);
        }
        // Check if slug is taken (if provided and different)
        if (data.slug && data.slug !== existingPost.slug) {
            const existingSlug = await prisma_1.default.post.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new error_middleware_1.AppError('SLUG_EXISTS', 'Post with this slug already exists', 409);
            }
        }
        // Calculate reading time if content changed
        let readingTime = existingPost.readingTime;
        if (data.content) {
            readingTime = this.calculateReadingTime(data.content);
        }
        // Update post
        const updateData = {
            ...data,
            readingTime,
        };
        // Handle publishedAt
        if (data.status === client_1.PostStatus.PUBLISHED && existingPost.status !== client_1.PostStatus.PUBLISHED) {
            updateData.publishedAt = new Date();
        }
        const post = await prisma_1.default.post.update({
            where: { id },
            data: {
                ...updateData,
                categories: data.categoryIds
                    ? {
                        set: data.categoryIds.map((id) => ({ id })),
                    }
                    : undefined,
                tags: data.tagIds
                    ? {
                        set: data.tagIds.map((id) => ({ id })),
                    }
                    : undefined,
                products: data.productIds
                    ? {
                        set: data.productIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        slug: true,
                    },
                },
                categories: true,
                tags: true,
                products: true,
            },
        });
        return post;
    }
    /**
     * Delete post (soft delete)
     */
    async delete(id, userId, userRole) {
        // Check if post exists
        const post = await prisma_1.default.post.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!post) {
            throw new error_middleware_1.AppError('POST_NOT_FOUND', 'Post not found', 404);
        }
        // Check permissions
        if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && post.authorId !== userId) {
            throw new error_middleware_1.AppError('FORBIDDEN', 'You can only delete your own posts', 403);
        }
        // Soft delete
        await prisma_1.default.post.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { message: 'Post deleted successfully' };
    }
}
exports.postsService = new PostsService();
//# sourceMappingURL=posts.service.js.map