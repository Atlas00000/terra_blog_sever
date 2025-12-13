/**
 * Media Service
 * Handles media CRUD operations and file management
 */

import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { cloudflareR2Service } from './cloudflare-r2.service';
import { cloudflareImagesService } from './cloudflare-images.service';
import { isImage } from '../utils/file-validation';

export interface CreateMediaData {
  originalUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedById?: string;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  mimeType?: string;
  uploadedById?: string;
}

class MediaService {
  /**
   * Get all media with filters
   */
  async getAll(params: MediaQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

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
      prisma.media.findMany({
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
      prisma.media.count({ where }),
    ]);

    // Add optimized URLs for images
    const mediaWithUrls = media.map((item) => {
      const baseData = {
        ...item,
        uploadedBy: item.uploadedBy || null,
      };

      if (isImage(item.mimeType)) {
        const responsiveUrls = cloudflareImagesService.getResponsiveUrls(item.originalUrl);
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
  async getById(id: string) {
    const media = await prisma.media.findUnique({
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
      throw new AppError('MEDIA_NOT_FOUND', 'Media not found', 404);
    }

    // Add optimized URLs for images
    if (isImage(media.mimeType)) {
      const responsiveUrls = cloudflareImagesService.getResponsiveUrls(media.originalUrl);
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
  async create(data: CreateMediaData) {
    // Generate optimized URL if image
    let optimizedUrl = data.originalUrl;
    let thumbnailUrl: string | null = null;

    if (isImage(data.mimeType)) {
      const responsiveUrls = cloudflareImagesService.getResponsiveUrls(data.originalUrl);
      optimizedUrl = responsiveUrls.medium;
      thumbnailUrl = responsiveUrls.thumbnail;
    }

    const media = await prisma.media.create({
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
    if (isImage(media.mimeType)) {
      const responsiveUrls = cloudflareImagesService.getResponsiveUrls(media.originalUrl);
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
  async delete(id: string, userId: string, userRole: string) {
    // Check if media exists
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new AppError('MEDIA_NOT_FOUND', 'Media not found', 404);
    }

    // Check permissions (admin can delete any, users can only delete their own)
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && media.uploadedById !== userId) {
      throw new AppError('FORBIDDEN', 'You can only delete your own media', 403);
    }

    // Delete from R2
    if (cloudflareR2Service.isConfigured()) {
      try {
        const key = cloudflareR2Service.extractKeyFromUrl(media.originalUrl);
        await cloudflareR2Service.deleteFile(key);
      } catch (error) {
        // Log error but continue with database deletion
        console.error('Failed to delete file from R2:', error);
      }
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    return { message: 'Media deleted successfully' };
  }
}

export const mediaService = new MediaService();

