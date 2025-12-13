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
declare class ProductsService {
    /**
     * Get all products with filters
     */
    getAll(params: ProductQueryParams): Promise<{
        data: {
            postCount: number;
            _count: {
                posts: number;
            };
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            features: import("@prisma/client/runtime/library").JsonValue;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            videos: string[];
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get product by slug
     */
    getBySlug(slug: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        features: import("@prisma/client/runtime/library").JsonValue;
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        images: string[];
        videos: string[];
    }>;
    /**
     * Get product by ID
     */
    getById(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        features: import("@prisma/client/runtime/library").JsonValue;
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        images: string[];
        videos: string[];
    }>;
    /**
     * Create product
     */
    create(data: CreateProductData): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        features: import("@prisma/client/runtime/library").JsonValue;
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        images: string[];
        videos: string[];
    }>;
    /**
     * Update product
     */
    update(id: string, data: UpdateProductData): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        features: import("@prisma/client/runtime/library").JsonValue;
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        images: string[];
        videos: string[];
    }>;
    /**
     * Delete product
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
export declare const productsService: ProductsService;
export {};
//# sourceMappingURL=products.service.d.ts.map