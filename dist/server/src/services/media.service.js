"use strict";
/**
 * Media Service
 * Handles media CRUD operations and file management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const cloudflare_r2_service_1 = require("./cloudflare-r2.service");
const cloudflare_images_service_1 = require("./cloudflare-images.service");
const file_validation_1 = require("../utils/file-validation");
class MediaService {
    /**
     * Get all media with filters
     */
    async getAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        // Search
        if (params.search) {
            where.OR = [
                { fileName: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        // Filter by MIME type
        if (params.mimeType) {
            where.mimeType = params.mimeType;
        }
        // Filter by uploader
        if (params.uploadedById) {
            where.uploadedById = params.uploadedById;
        }
        const [media, total] = await Promise.all([
            prisma_1.default.media.findMany({
                where,
                skip,
                take: limit,
                include: {
                    uploadedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma_1.default.media.count({ where }),
        ]);
        // Add optimized URLs for images
        const mediaWithUrls = media.map((item) => {
            const baseData = {
                ...item,
                uploadedBy: item.uploadedBy || null,
            };
            if ((0, file_validation_1.isImage)(item.mimeType)) {
                const responsiveUrls = cloudflare_images_service_1.cloudflareImagesService.getResponsiveUrls(item.originalUrl);
                return {
                    ...baseData,
                    optimizedUrl: responsiveUrls.medium,
                    thumbnailUrl: responsiveUrls.thumbnail,
                    responsiveUrls,
                };
            }
            return baseData;
        });
        return {
            data: mediaWithUrls,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get media by ID
     */
    async getById(id) {
        const media = await prisma_1.default.media.findUnique({
            where: { id },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!media) {
            throw new error_middleware_1.AppError('MEDIA_NOT_FOUND', 'Media not found', 404);
        }
        // Add optimized URLs for images
        if ((0, file_validation_1.isImage)(media.mimeType)) {
            const responsiveUrls = cloudflare_images_service_1.cloudflareImagesService.getResponsiveUrls(media.originalUrl);
            return {
                ...media,
                optimizedUrl: responsiveUrls.medium,
                thumbnailUrl: responsiveUrls.thumbnail,
                responsiveUrls,
            };
        }
        return media;
    }
    /**
     * Create media record
     */
    async create(data) {
        // Generate optimized URL if image
        let optimizedUrl = data.originalUrl;
        let thumbnailUrl = null;
        if ((0, file_validation_1.isImage)(data.mimeType)) {
            const responsiveUrls = cloudflare_images_service_1.cloudflareImagesService.getResponsiveUrls(data.originalUrl);
            optimizedUrl = responsiveUrls.medium;
            thumbnailUrl = responsiveUrls.thumbnail;
        }
        const media = await prisma_1.default.media.create({
            data: {
                originalUrl: data.originalUrl,
                optimizedUrl,
                thumbnailUrl,
                fileName: data.fileName,
                fileSize: data.fileSize,
                mimeType: data.mimeType,
                uploadedById: data.uploadedById,
            },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        // Add responsive URLs for images
        if ((0, file_validation_1.isImage)(media.mimeType)) {
            const responsiveUrls = cloudflare_images_service_1.cloudflareImagesService.getResponsiveUrls(media.originalUrl);
            return {
                ...media,
                responsiveUrls,
            };
        }
        return media;
    }
    /**
     * Delete media
     */
    async delete(id, userId, userRole) {
        // Check if media exists
        const media = await prisma_1.default.media.findUnique({
            where: { id },
        });
        if (!media) {
            throw new error_middleware_1.AppError('MEDIA_NOT_FOUND', 'Media not found', 404);
        }
        // Check permissions (admin can delete any, users can only delete their own)
        if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && media.uploadedById !== userId) {
            throw new error_middleware_1.AppError('FORBIDDEN', 'You can only delete your own media', 403);
        }
        // Delete from R2
        if (cloudflare_r2_service_1.cloudflareR2Service.isConfigured()) {
            try {
                const key = cloudflare_r2_service_1.cloudflareR2Service.extractKeyFromUrl(media.originalUrl);
                await cloudflare_r2_service_1.cloudflareR2Service.deleteFile(key);
            }
            catch (error) {
                // Log error but continue with database deletion
                console.error('Failed to delete file from R2:', error);
            }
        }
        // Delete from database
        await prisma_1.default.media.delete({
            where: { id },
        });
        return { message: 'Media deleted successfully' };
    }
}
exports.mediaService = new MediaService();
//# sourceMappingURL=media.service.js.map