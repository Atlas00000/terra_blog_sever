/**
 * Press Releases Service
 * Handles press release CRUD operations
 */

import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export interface CreatePressReleaseData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  publishedAt: Date;
  featured?: boolean;
  mediaKitUrl?: string;
}

export interface UpdatePressReleaseData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  publishedAt?: Date;
  featured?: boolean;
  mediaKitUrl?: string;
}

export interface PressReleaseQueryParams {
  page?: number;
  limit?: number;
  featured?: boolean;
  search?: string;
}

class PressReleasesService {
  /**
   * Get all press releases with filters
   */
  async getAll(params: PressReleaseQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

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
      prisma.pressRelease.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
      }),
      prisma.pressRelease.count({ where }),
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
  async getBySlug(slug: string) {
    const pressRelease = await prisma.pressRelease.findUnique({
      where: { slug },
    });

    if (!pressRelease) {
      throw new AppError('PRESS_RELEASE_NOT_FOUND', 'Press release not found', 404);
    }

    return pressRelease;
  }

  /**
   * Get press release by ID
   */
  async getById(id: string) {
    const pressRelease = await prisma.pressRelease.findUnique({
      where: { id },
    });

    if (!pressRelease) {
      throw new AppError('PRESS_RELEASE_NOT_FOUND', 'Press release not found', 404);
    }

    return pressRelease;
  }

  /**
   * Create press release
   */
  async create(data: CreatePressReleaseData) {
    // Check if slug is taken
    const existing = await prisma.pressRelease.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new AppError('SLUG_EXISTS', 'Press release with this slug already exists', 409);
    }

    const pressRelease = await prisma.pressRelease.create({
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
  async update(id: string, data: UpdatePressReleaseData) {
    const existing = await prisma.pressRelease.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('PRESS_RELEASE_NOT_FOUND', 'Press release not found', 404);
    }

    // Check if slug is taken (if provided and different)
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.pressRelease.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        throw new AppError('SLUG_EXISTS', 'Press release with this slug already exists', 409);
      }
    }

    const pressRelease = await prisma.pressRelease.update({
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
  async delete(id: string) {
    const pressRelease = await prisma.pressRelease.findUnique({
      where: { id },
    });

    if (!pressRelease) {
      throw new AppError('PRESS_RELEASE_NOT_FOUND', 'Press release not found', 404);
    }

    await prisma.pressRelease.delete({
      where: { id },
    });

    return { message: 'Press release deleted successfully' };
  }
}

export const pressReleasesService = new PressReleasesService();

