import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { cacheService, cacheKeys } from './cache.service';

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

class CategoriesService {
  /**
   * Get all categories with filters
   */
  async getAll(params: CategoryQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;

    // Generate cache key
    const cacheKey = cacheKeys.categoryList(page, limit);
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

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
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
      prisma.category.count({ where }),
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
      await cacheService.set(cacheKey, result, 3600); // 1 hour
    }

    return result;
  }

  /**
   * Get category by slug
   */
  async getBySlug(slug: string) {
    // Try cache first
    const cacheKey = cacheKeys.categorySlug(slug);
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const category = await prisma.category.findUnique({
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
      throw new AppError('CATEGORY_NOT_FOUND', 'Category not found', 404);
    }

    const result = {
      ...category,
      postCount: category._count.posts,
    };

    // Cache the result
    await cacheService.set(cacheKey, result, 3600); // 1 hour

    return result;
  }

  /**
   * Get category by ID
   */
  async getById(id: string) {
    const category = await prisma.category.findUnique({
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
      throw new AppError('CATEGORY_NOT_FOUND', 'Category not found', 404);
    }

    return {
      ...category,
      postCount: category._count.posts,
    };
  }

  /**
   * Create category
   */
  async create(data: CreateCategoryData) {
    // Check if name is taken
    const existingName = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      throw new AppError('CATEGORY_NAME_EXISTS', 'Category with this name already exists', 409);
    }

    // Check if slug is taken
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new AppError('CATEGORY_SLUG_EXISTS', 'Category with this slug already exists', 409);
    }

    // Create category
    const category = await prisma.category.create({
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
    await cacheService.invalidateResource('category', category.id);
    await cacheService.delete(cacheKeys.categorySlug(category.slug));
    await cacheService.deletePattern('category:list:*');

    return result;
  }

  /**
   * Update category
   */
  async update(id: string, data: UpdateCategoryData) {
    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('CATEGORY_NOT_FOUND', 'Category not found', 404);
    }

    // Check if name is taken (if provided and different)
    if (data.name && data.name !== existing.name) {
      const existingName = await prisma.category.findUnique({
        where: { name: data.name },
      });

      if (existingName) {
        throw new AppError('CATEGORY_NAME_EXISTS', 'Category with this name already exists', 409);
      }
    }

    // Check if slug is taken (if provided and different)
    if (data.slug && data.slug !== existing.slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new AppError('CATEGORY_SLUG_EXISTS', 'Category with this slug already exists', 409);
      }
    }

    // Update category
    const category = await prisma.category.update({
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
    await cacheService.invalidateResource('category', id);
    if (existing.slug) {
      await cacheService.delete(cacheKeys.categorySlug(existing.slug));
    }
    if (data.slug && data.slug !== existing.slug) {
      await cacheService.delete(cacheKeys.categorySlug(data.slug));
    }
    await cacheService.deletePattern('category:list:*');

    return result;
  }

  /**
   * Delete category
   */
  async delete(id: string) {
    // Check if category exists
    const category = await prisma.category.findUnique({
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
      throw new AppError('CATEGORY_NOT_FOUND', 'Category not found', 404);
    }

    // Check if category has posts
    if (category._count.posts > 0) {
      throw new AppError(
        'CATEGORY_HAS_POSTS',
        'Cannot delete category with associated posts',
        409
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    // Invalidate cache
    await cacheService.invalidateResource('category', id);
    await cacheService.delete(cacheKeys.categorySlug(category.slug));
    await cacheService.deletePattern('category:list:*');

    return { message: 'Category deleted successfully' };
  }
}

export const categoriesService = new CategoriesService();

