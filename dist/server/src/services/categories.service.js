"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const cache_service_1 = require("./cache.service");
class CategoriesService {
    /**
     * Get all categories with filters
     */
    async getAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        // Generate cache key
        const cacheKey = cache_service_1.cacheKeys.categoryList(page, limit);
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
        const [categories, total] = await Promise.all([
            prisma_1.default.category.findMany({
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
            prisma_1.default.category.count({ where }),
        ]);
        const result = {
            data: categories.map((cat) => ({
                ...cat,
                postCount: cat._count.posts,
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
     * Get category by slug
     */
    async getBySlug(slug) {
        // Try cache first
        const cacheKey = cache_service_1.cacheKeys.categorySlug(slug);
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const category = await prisma_1.default.category.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!category) {
            throw new error_middleware_1.AppError('CATEGORY_NOT_FOUND', 'Category not found', 404);
        }
        const result = {
            ...category,
            postCount: category._count.posts,
        };
        // Cache the result
        await cache_service_1.cacheService.set(cacheKey, result, 3600); // 1 hour
        return result;
    }
    /**
     * Get category by ID
     */
    async getById(id) {
        const category = await prisma_1.default.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!category) {
            throw new error_middleware_1.AppError('CATEGORY_NOT_FOUND', 'Category not found', 404);
        }
        return {
            ...category,
            postCount: category._count.posts,
        };
    }
    /**
     * Create category
     */
    async create(data) {
        // Check if name is taken
        const existingName = await prisma_1.default.category.findUnique({
            where: { name: data.name },
        });
        if (existingName) {
            throw new error_middleware_1.AppError('CATEGORY_NAME_EXISTS', 'Category with this name already exists', 409);
        }
        // Check if slug is taken
        const existingSlug = await prisma_1.default.category.findUnique({
            where: { slug: data.slug },
        });
        if (existingSlug) {
            throw new error_middleware_1.AppError('CATEGORY_SLUG_EXISTS', 'Category with this slug already exists', 409);
        }
        // Create category
        const category = await prisma_1.default.category.create({
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
            ...category,
            postCount: category._count.posts,
        };
        // Invalidate cache
        await cache_service_1.cacheService.invalidateResource('category', category.id);
        await cache_service_1.cacheService.delete(cache_service_1.cacheKeys.categorySlug(category.slug));
        await cache_service_1.cacheService.deletePattern('category:list:*');
        return result;
    }
    /**
     * Update category
     */
    async update(id, data) {
        // Check if category exists
        const existing = await prisma_1.default.category.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new error_middleware_1.AppError('CATEGORY_NOT_FOUND', 'Category not found', 404);
        }
        // Check if name is taken (if provided and different)
        if (data.name && data.name !== existing.name) {
            const existingName = await prisma_1.default.category.findUnique({
                where: { name: data.name },
            });
            if (existingName) {
                throw new error_middleware_1.AppError('CATEGORY_NAME_EXISTS', 'Category with this name already exists', 409);
            }
        }
        // Check if slug is taken (if provided and different)
        if (data.slug && data.slug !== existing.slug) {
            const existingSlug = await prisma_1.default.category.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new error_middleware_1.AppError('CATEGORY_SLUG_EXISTS', 'Category with this slug already exists', 409);
            }
        }
        // Update category
        const category = await prisma_1.default.category.update({
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
            ...category,
            postCount: category._count.posts,
        };
        // Invalidate cache
        await cache_service_1.cacheService.invalidateResource('category', id);
        if (existing.slug) {
            await cache_service_1.cacheService.delete(cache_service_1.cacheKeys.categorySlug(existing.slug));
        }
        if (data.slug && data.slug !== existing.slug) {
            await cache_service_1.cacheService.delete(cache_service_1.cacheKeys.categorySlug(data.slug));
        }
        await cache_service_1.cacheService.deletePattern('category:list:*');
        return result;
    }
    /**
     * Delete category
     */
    async delete(id) {
        // Check if category exists
        const category = await prisma_1.default.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!category) {
            throw new error_middleware_1.AppError('CATEGORY_NOT_FOUND', 'Category not found', 404);
        }
        // Check if category has posts
        if (category._count.posts > 0) {
            throw new error_middleware_1.AppError('CATEGORY_HAS_POSTS', 'Cannot delete category with associated posts', 409);
        }
        // Delete category
        await prisma_1.default.category.delete({
            where: { id },
        });
        // Invalidate cache
        await cache_service_1.cacheService.invalidateResource('category', id);
        await cache_service_1.cacheService.delete(cache_service_1.cacheKeys.categorySlug(category.slug));
        await cache_service_1.cacheService.deletePattern('category:list:*');
        return { message: 'Category deleted successfully' };
    }
}
exports.categoriesService = new CategoriesService();
//# sourceMappingURL=categories.service.js.map