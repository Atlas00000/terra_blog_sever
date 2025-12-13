"use strict";
/**
 * Press Releases Service
 * Handles press release CRUD operations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pressReleasesService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
class PressReleasesService {
    /**
     * Get all press releases with filters
     */
    async getAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.featured !== undefined) {
            where.featured = params.featured;
        }
        if (params.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { excerpt: { contains: params.search, mode: 'insensitive' } },
                { content: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [pressReleases, total] = await Promise.all([
            prisma_1.default.pressRelease.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    publishedAt: 'desc',
                },
            }),
            prisma_1.default.pressRelease.count({ where }),
        ]);
        return {
            data: pressReleases,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get press release by slug
     */
    async getBySlug(slug) {
        const pressRelease = await prisma_1.default.pressRelease.findUnique({
            where: { slug },
        });
        if (!pressRelease) {
            throw new error_middleware_1.AppError('PRESS_RELEASE_NOT_FOUND', 'Press release not found', 404);
        }
        return pressRelease;
    }
    /**
     * Get press release by ID
     */
    async getById(id) {
        const pressRelease = await prisma_1.default.pressRelease.findUnique({
            where: { id },
        });
        if (!pressRelease) {
            throw new error_middleware_1.AppError('PRESS_RELEASE_NOT_FOUND', 'Press release not found', 404);
        }
        return pressRelease;
    }
    /**
     * Create press release
     */
    async create(data) {
        // Check if slug is taken
        const existing = await prisma_1.default.pressRelease.findUnique({
            where: { slug: data.slug },
        });
        if (existing) {
            throw new error_middleware_1.AppError('SLUG_EXISTS', 'Press release with this slug already exists', 409);
        }
        const pressRelease = await prisma_1.default.pressRelease.create({
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                publishedAt: data.publishedAt,
                featured: data.featured || false,
                mediaKitUrl: data.mediaKitUrl,
            },
        });
        return pressRelease;
    }
    /**
     * Update press release
     */
    async update(id, data) {
        const existing = await prisma_1.default.pressRelease.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new error_middleware_1.AppError('PRESS_RELEASE_NOT_FOUND', 'Press release not found', 404);
        }
        // Check if slug is taken (if provided and different)
        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await prisma_1.default.pressRelease.findUnique({
                where: { slug: data.slug },
            });
            if (slugExists) {
                throw new error_middleware_1.AppError('SLUG_EXISTS', 'Press release with this slug already exists', 409);
            }
        }
        const pressRelease = await prisma_1.default.pressRelease.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.slug && { slug: data.slug }),
                ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
                ...(data.content && { content: data.content }),
                ...(data.publishedAt && { publishedAt: data.publishedAt }),
                ...(data.featured !== undefined && { featured: data.featured }),
                ...(data.mediaKitUrl !== undefined && { mediaKitUrl: data.mediaKitUrl }),
            },
        });
        return pressRelease;
    }
    /**
     * Delete press release
     */
    async delete(id) {
        const pressRelease = await prisma_1.default.pressRelease.findUnique({
            where: { id },
        });
        if (!pressRelease) {
            throw new error_middleware_1.AppError('PRESS_RELEASE_NOT_FOUND', 'Press release not found', 404);
        }
        await prisma_1.default.pressRelease.delete({
            where: { id },
        });
        return { message: 'Press release deleted successfully' };
    }
}
exports.pressReleasesService = new PressReleasesService();
//# sourceMappingURL=press.service.js.map