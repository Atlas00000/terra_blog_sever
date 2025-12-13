"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const cache_service_1 = require("./cache.service");
class TagsService {
    /**
     * Get all tags with filters
     */
    async getAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        // Generate cache key
        const cacheKey = cache_service_1.cacheKeys.tagList(page, limit);
        if (!params.search) {
            const cached = await cache_service_1.cacheService.get(cacheKey);
            if (cached) {
                return cached;
            }
        }
        const skip = (page - 1) * limit;
        const where = {};
        // Search
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [tags, total] = await Promise.all([
            prisma_1.default.tag.findMany({
                where,
                skip,
                take: limit,
                include: {
                    _count: {
                        select: {
                            posts: true,
                        },
                    },
                },
                orderBy: {
                    name: 'asc',
                },
            }),
            prisma_1.default.tag.count({ where }),
        ]);
        const result = {
            data: tags.map((tag) => ({
                ...tag,
                postCount: tag._count.posts,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
        // Cache result (only if no search)
        if (!params.search) {
            await cache_service_1.cacheService.set(cacheKey, result, 3600); // 1 hour
        }
        return result;
    }
    /**
     * Get tag by slug
     */
    async getBySlug(slug) {
        // Try cache first
        const cacheKey = cache_service_1.cacheKeys.tagSlug(slug);
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const tag = await prisma_1.default.tag.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!tag) {
            throw new error_middleware_1.AppError('TAG_NOT_FOUND', 'Tag not found', 404);
        }
        const result = {
            ...tag,
            postCount: tag._count.posts,
        };
        // Cache the result
        await cache_service_1.cacheService.set(cacheKey, result, 3600); // 1 hour
        return result;
    }
    /**
     * Get tag by ID
     */
    async getById(id) {
        const tag = await prisma_1.default.tag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!tag) {
            throw new error_middleware_1.AppError('TAG_NOT_FOUND', 'Tag not found', 404);
        }
        return {
            ...tag,
            postCount: tag._count.posts,
        };
    }
    /**
     * Create tag
     */
    async create(data) {
        // Check if name is taken
        const existingName = await prisma_1.default.tag.findUnique({
            where: { name: data.name },
        });
        if (existingName) {
            throw new error_middleware_1.AppError('TAG_NAME_EXISTS', 'Tag with this name already exists', 409);
        }
        // Check if slug is taken
        const existingSlug = await prisma_1.default.tag.findUnique({
            where: { slug: data.slug },
        });
        if (existingSlug) {
            throw new error_middleware_1.AppError('TAG_SLUG_EXISTS', 'Tag with this slug already exists', 409);
        }
        // Create tag
        const tag = await prisma_1.default.tag.create({
            data,
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        const result = {
            ...tag,
            postCount: tag._count.posts,
        };
        // Invalidate cache
        await cache_service_1.cacheService.invalidateResource('tag', tag.id);
        await cache_service_1.cacheService.delete(cache_service_1.cacheKeys.tagSlug(tag.slug));
        await cache_service_1.cacheService.deletePattern('tag:list:*');
        return result;
    }
    /**
     * Update tag
     */
    async update(id, data) {
        // Check if tag exists
        const existing = await prisma_1.default.tag.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new error_middleware_1.AppError('TAG_NOT_FOUND', 'Tag not found', 404);
        }
        // Check if name is taken (if provided and different)
        if (data.name && data.name !== existing.name) {
            const existingName = await prisma_1.default.tag.findUnique({
                where: { name: data.name },
            });
            if (existingName) {
                throw new error_middleware_1.AppError('TAG_NAME_EXISTS', 'Tag with this name already exists', 409);
            }
        }
        // Check if slug is taken (if provided and different)
        if (data.slug && data.slug !== existing.slug) {
            const existingSlug = await prisma_1.default.tag.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new error_middleware_1.AppError('TAG_SLUG_EXISTS', 'Tag with this slug already exists', 409);
            }
        }
        // Update tag
        const tag = await prisma_1.default.tag.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        const result = {
            ...tag,
            postCount: tag._count.posts,
        };
        // Invalidate cache
        await cache_service_1.cacheService.invalidateResource('tag', id);
        if (existing.slug) {
            await cache_service_1.cacheService.delete(cache_service_1.cacheKeys.tagSlug(existing.slug));
        }
        if (data.slug && data.slug !== existing.slug) {
            await cache_service_1.cacheService.delete(cache_service_1.cacheKeys.tagSlug(data.slug));
        }
        await cache_service_1.cacheService.deletePattern('tag:list:*');
        return result;
    }
    /**
     * Delete tag
     */
    async delete(id) {
        // Check if tag exists
        const tag = await prisma_1.default.tag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!tag) {
            throw new error_middleware_1.AppError('TAG_NOT_FOUND', 'Tag not found', 404);
        }
        // Check if tag has posts
        if (tag._count.posts > 0) {
            throw new error_middleware_1.AppError('TAG_HAS_POSTS', 'Cannot delete tag with associated posts', 409);
        }
        // Delete tag
        await prisma_1.default.tag.delete({
            where: { id },
        });
        // Invalidate cache
        await cache_service_1.cacheService.invalidateResource('tag', id);
        await cache_service_1.cacheService.delete(cache_service_1.cacheKeys.tagSlug(tag.slug));
        await cache_service_1.cacheService.deletePattern('tag:list:*');
        return { message: 'Tag deleted successfully' };
    }
}
exports.tagsService = new TagsService();
//# sourceMappingURL=tags.service.js.map