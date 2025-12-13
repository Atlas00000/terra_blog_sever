import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  features: string[];
  specifications?: Record<string, any>;
  images?: string[];
  videos?: string[];
}

export interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  features?: string[];
  specifications?: Record<string, any>;
  images?: string[];
  videos?: string[];
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

class ProductsService {
  /**
   * Get all products with filters
   */
  async getAll(params: ProductQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Search
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
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
      prisma.product.count({ where }),
    ]);

    return {
      data: products.map((product) => ({
        ...product,
        postCount: product._count.posts,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get product by slug
   */
  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
    }

    return {
      ...product,
      postCount: product._count.posts,
    };
  }

  /**
   * Get product by ID
   */
  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
    }

    return {
      ...product,
      postCount: product._count.posts,
    };
  }

  /**
   * Create product
   */
  async create(data: CreateProductData) {
    // Check if name is taken
    const existingName = await prisma.product.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      throw new AppError('PRODUCT_NAME_EXISTS', 'Product with this name already exists', 409);
    }

    // Check if slug is taken
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new AppError('PRODUCT_SLUG_EXISTS', 'Product with this slug already exists', 409);
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        features: data.features,
        specifications: data.specifications || undefined,
        images: data.images || [],
        videos: data.videos || [],
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return {
      ...product,
      postCount: product._count.posts,
    };
  }

  /**
   * Update product
   */
  async update(id: string, data: UpdateProductData) {
    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
    }

    // Check if name is taken (if provided and different)
    if (data.name && data.name !== existing.name) {
      const existingName = await prisma.product.findUnique({
        where: { name: data.name },
      });

      if (existingName) {
        throw new AppError('PRODUCT_NAME_EXISTS', 'Product with this name already exists', 409);
      }
    }

    // Check if slug is taken (if provided and different)
    if (data.slug && data.slug !== existing.slug) {
      const existingSlug = await prisma.product.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new AppError('PRODUCT_SLUG_EXISTS', 'Product with this slug already exists', 409);
      }
    }

    // Build update data
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.slug) updateData.slug = data.slug;
    if (data.description) updateData.description = data.description;
    if (data.features) updateData.features = data.features;
    if (data.specifications !== undefined) {
      updateData.specifications = data.specifications || undefined;
    }
    if (data.images !== undefined) updateData.images = data.images;
    if (data.videos !== undefined) updateData.videos = data.videos;

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return {
      ...product,
      postCount: product._count.posts,
    };
  }

  /**
   * Delete product
   */
  async delete(id: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
    }

    // Check if product has posts
    if (product._count.posts > 0) {
      throw new AppError('PRODUCT_HAS_POSTS', 'Cannot delete product with associated posts', 409);
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}

export const productsService = new ProductsService();

