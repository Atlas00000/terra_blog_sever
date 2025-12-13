"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
class ProductsService {
    /**
     * Get all products with filters
     */
    async getAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        // Search
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [products, total] = await Promise.all([
            prisma_1.default.product.findMany({
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
            prisma_1.default.product.count({ where }),
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
    async getBySlug(slug) {
        const product = await prisma_1.default.product.findUnique({
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
            throw new error_middleware_1.AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
        }
        return {
            ...product,
            postCount: product._count.posts,
        };
    }
    /**
     * Get product by ID
     */
    async getById(id) {
        const product = await prisma_1.default.product.findUnique({
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
            throw new error_middleware_1.AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
        }
        return {
            ...product,
            postCount: product._count.posts,
        };
    }
    /**
     * Create product
     */
    async create(data) {
        // Check if name is taken
        const existingName = await prisma_1.default.product.findUnique({
            where: { name: data.name },
        });
        if (existingName) {
            throw new error_middleware_1.AppError('PRODUCT_NAME_EXISTS', 'Product with this name already exists', 409);
        }
        // Check if slug is taken
        const existingSlug = await prisma_1.default.product.findUnique({
            where: { slug: data.slug },
        });
        if (existingSlug) {
            throw new error_middleware_1.AppError('PRODUCT_SLUG_EXISTS', 'Product with this slug already exists', 409);
        }
        // Create product
        const product = await prisma_1.default.product.create({
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
    async update(id, data) {
        // Check if product exists
        const existing = await prisma_1.default.product.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new error_middleware_1.AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
        }
        // Check if name is taken (if provided and different)
        if (data.name && data.name !== existing.name) {
            const existingName = await prisma_1.default.product.findUnique({
                where: { name: data.name },
            });
            if (existingName) {
                throw new error_middleware_1.AppError('PRODUCT_NAME_EXISTS', 'Product with this name already exists', 409);
            }
        }
        // Check if slug is taken (if provided and different)
        if (data.slug && data.slug !== existing.slug) {
            const existingSlug = await prisma_1.default.product.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new error_middleware_1.AppError('PRODUCT_SLUG_EXISTS', 'Product with this slug already exists', 409);
            }
        }
        // Build update data
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.slug)
            updateData.slug = data.slug;
        if (data.description)
            updateData.description = data.description;
        if (data.features)
            updateData.features = data.features;
        if (data.specifications !== undefined) {
            updateData.specifications = data.specifications || undefined;
        }
        if (data.images !== undefined)
            updateData.images = data.images;
        if (data.videos !== undefined)
            updateData.videos = data.videos;
        // Update product
        const product = await prisma_1.default.product.update({
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
    async delete(id) {
        // Check if product exists
        const product = await prisma_1.default.product.findUnique({
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
            throw new error_middleware_1.AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
        }
        // Check if product has posts
        if (product._count.posts > 0) {
            throw new error_middleware_1.AppError('PRODUCT_HAS_POSTS', 'Cannot delete product with associated posts', 409);
        }
        // Delete product
        await prisma_1.default.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
}
exports.productsService = new ProductsService();
//# sourceMappingURL=products.service.js.map