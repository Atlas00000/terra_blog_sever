import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { cacheService, cacheKeys } from './cache.service';

export interface CreateTagData {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateTagData {
  name?: string;
  slug?: string;
  description?: string;
}

export interface TagQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

class TagsService {
  /**
   * Get all tags with filters
   */
  async getAll(params: TagQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;

    // Generate cache key
    const cacheKey = cacheKeys.tagList(page, limit);
    if (!params.search) {
      const cached = await cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const skip = (page - 1) * limit;

    const where: any = {};

    // Search
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
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
      prisma.tag.count({ where }),
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
      await cacheService.set(cacheKey, result, 3600); // 1 hour
    }

    return result;
  }

  /**
   * Get tag by slug
   */
  async getBySlug(slug: string) {
    // Try cache first
    const cacheKey = cacheKeys.tagSlug(slug);
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const tag = await prisma.tag.findUnique({
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
      throw new AppError('TAG_NOT_FOUND', 'Tag not found', 404);
    }

    const result = {
      ...tag,
      postCount: tag._count.posts,
    };

    // Cache the result
    await cacheService.set(cacheKey, result, 3600); // 1 hour

    return result;
  }

  /**
   * Get tag by ID
   */
  async getById(id: string) {
    const tag = await prisma.tag.findUnique({
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
      throw new AppError('TAG_NOT_FOUND', 'Tag not found', 404);
    }

    return {
      ...tag,
      postCount: tag._count.posts,
    };
  }

  /**
   * Create tag
   */
  async create(data: CreateTagData) {
    // Check if name is taken
    const existingName = await prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      throw new AppError('TAG_NAME_EXISTS', 'Tag with this name already exists', 409);
    }

    // Check if slug is taken
    const existingSlug = await prisma.tag.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new AppError('TAG_SLUG_EXISTS', 'Tag with this slug already exists', 409);
    }

    // Create tag
    const tag = await prisma.tag.create({
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
    await cacheService.invalidateResource('tag', tag.id);
    await cacheService.delete(cacheKeys.tagSlug(tag.slug));
    await cacheService.deletePattern('tag:list:*');

    return result;
  }

  /**
   * Update tag
   */
  async update(id: string, data: UpdateTagData) {
    // Check if tag exists
    const existing = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('TAG_NOT_FOUND', 'Tag not found', 404);
    }

    // Check if name is taken (if provided and different)
    if (data.name && data.name !== existing.name) {
      const existingName = await prisma.tag.findUnique({
        where: { name: data.name },
      });

      if (existingName) {
        throw new AppError('TAG_NAME_EXISTS', 'Tag with this name already exists', 409);
      }
    }

    // Check if slug is taken (if provided and different)
    if (data.slug && data.slug !== existing.slug) {
      const existingSlug = await prisma.tag.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new AppError('TAG_SLUG_EXISTS', 'Tag with this slug already exists', 409);
      }
    }

    // Update tag
    const tag = await prisma.tag.update({
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
    await cacheService.invalidateResource('tag', id);
    if (existing.slug) {
      await cacheService.delete(cacheKeys.tagSlug(existing.slug));
    }
    if (data.slug && data.slug !== existing.slug) {
      await cacheService.delete(cacheKeys.tagSlug(data.slug));
    }
    await cacheService.deletePattern('tag:list:*');

    return result;
  }

  /**
   * Delete tag
   */
  async delete(id: string) {
    // Check if tag exists
    const tag = await prisma.tag.findUnique({
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
      throw new AppError('TAG_NOT_FOUND', 'Tag not found', 404);
    }

    // Check if tag has posts
    if (tag._count.posts > 0) {
      throw new AppError('TAG_HAS_POSTS', 'Cannot delete tag with associated posts', 409);
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id },
    });

    // Invalidate cache
    await cacheService.invalidateResource('tag', id);
    await cacheService.delete(cacheKeys.tagSlug(tag.slug));
    await cacheService.deletePattern('tag:list:*');

    return { message: 'Tag deleted successfully' };
  }
}

export const tagsService = new TagsService();

