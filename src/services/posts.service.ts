import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { PostStatus } from '@prisma/client';
import { cacheService, cacheKeys } from './cache.service';

export interface CreatePostData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status?: PostStatus;
  categoryIds?: string[];
  tagIds?: string[];
  productIds?: string[];
}

export interface UpdatePostData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  status?: PostStatus;
  categoryIds?: string[];
  tagIds?: string[];
  productIds?: string[];
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  author?: string;
  status?: PostStatus;
  search?: string;
}

class PostsService {
  /**
   * Calculate reading time in minutes
   */
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Get all posts with filters
   */
  async getAll(params: PostQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    
    // Generate cache key
    const cacheKey = cacheKeys.postList(
      page,
      limit,
      JSON.stringify({ ...params, page, limit })
    );

    // Try to get from cache
    // Skip cache in development to avoid stale content during edits
    if (process.env.NODE_ENV !== 'development') {
      const cached = await cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    // Filter by status (default to PUBLISHED for public)
    if (params.status) {
      where.status = params.status;
    } else {
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

    // Search - don't cache search results
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { excerpt: { contains: params.search, mode: 'insensitive' } },
        { content: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
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
      prisma.post.count({ where }),
    ]);

    const result = {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache result (only if no search, as search results change frequently)
    if (process.env.NODE_ENV !== 'development' && !params.search) {
      await cacheService.set(cacheKey, result, 1800); // 30 minutes
    }

    return result;
  }

  /**
   * Get post by slug
   */
  async getBySlug(slug: string) {
    // Try cache first
    const cacheKey = `post:slug:${slug}`;
    // Skip cache in development to avoid stale content during edits
    if (process.env.NODE_ENV !== 'development') {
      const cached = await cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const post = await prisma.post.findFirst({
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
      throw new AppError('POST_NOT_FOUND', 'Post not found', 404);
    }

    // Cache the result
    if (process.env.NODE_ENV !== 'development') {
      await cacheService.set(cacheKey, post, 3600); // 1 hour
    }

    return post;
  }

  /**
   * Get post by ID (admin/editor can access all, author can access own)
   */
  async getById(id: string, userId?: string, userRole?: string) {
    const post = await prisma.post.findFirst({
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
      throw new AppError('POST_NOT_FOUND', 'Post not found', 404);
    }

    // Check permissions (author can only access own posts, admin/editor can access all)
    if (userId && userRole && userRole !== 'ADMIN' && userRole !== 'EDITOR' && post.authorId !== userId) {
      throw new AppError('FORBIDDEN', 'You can only access your own posts', 403);
    }

    return post;
  }

  /**
   * Create post
   */
  async create(data: CreatePostData, authorId: string) {
    // Check if slug is taken
    const existingPost = await prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      throw new AppError('SLUG_EXISTS', 'Post with this slug already exists', 409);
    }

    // Calculate reading time
    const readingTime = this.calculateReadingTime(data.content);

    // Create post
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status || PostStatus.DRAFT,
        readingTime,
        authorId,
        publishedAt: data.status === PostStatus.PUBLISHED ? new Date() : null,
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

    // Invalidate cache
    await cacheService.invalidateResource('post', post.id);
    await cacheService.delete(`post:slug:${post.slug}`); // delete new slug cache
    await cacheService.deletePattern('post:list:*');

    return post;
  }

  /**
   * Update post
   */
  async update(id: string, data: UpdatePostData, userId: string, userRole: string) {
    // Check if post exists
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingPost) {
      throw new AppError('POST_NOT_FOUND', 'Post not found', 404);
    }

    // Check permissions (author can only edit own posts, admin/editor can edit all)
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && existingPost.authorId !== userId) {
      throw new AppError('FORBIDDEN', 'You can only edit your own posts', 403);
    }

    // Check if slug is taken (if provided and different)
    if (data.slug && data.slug !== existingPost.slug) {
      const existingSlug = await prisma.post.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new AppError('SLUG_EXISTS', 'Post with this slug already exists', 409);
      }
    }

    // Calculate reading time if content changed
    let readingTime = existingPost.readingTime;
    if (data.content) {
      readingTime = this.calculateReadingTime(data.content);
    }

    // Update post
    // Remove relation IDs from updateData as they're handled separately
    const { categoryIds, tagIds, productIds, ...postData } = data;
    const updateData: any = {
      ...postData,
      readingTime,
    };

    // Handle publishedAt
    if (data.status === PostStatus.PUBLISHED && existingPost.status !== PostStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }

    const post = await prisma.post.update({
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

    // Invalidate cache
    await cacheService.invalidateResource('post', id);
    if (existingPost.slug) {
      await cacheService.delete(`post:slug:${existingPost.slug}`); // delete old slug cache
    }
    if (data.slug && data.slug !== existingPost.slug) {
      await cacheService.delete(`post:slug:${data.slug}`); // delete new slug cache if changed
    }
    await cacheService.deletePattern('post:list:*');

    return post;
  }

  /**
   * Delete post (soft delete)
   */
  async delete(id: string, userId: string, userRole: string) {
    // Check if post exists
    const post = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!post) {
      throw new AppError('POST_NOT_FOUND', 'Post not found', 404);
    }

    // Check permissions
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && post.authorId !== userId) {
      throw new AppError('FORBIDDEN', 'You can only delete your own posts', 403);
    }

    // Soft delete
    await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Invalidate cache
    await cacheService.invalidateResource('post', id);
    if (post.slug) {
      await cacheService.delete(`post:slug:${post.slug}`); // delete slug cache
    }
    await cacheService.deletePattern('post:list:*');

    return { message: 'Post deleted successfully' };
  }
}

export const postsService = new PostsService();

