import { PostStatus } from '@prisma/client';
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
declare class PostsService {
    /**
     * Calculate reading time in minutes
     */
    calculateReadingTime(content: string): number;
    /**
     * Get all posts with filters
     */
    getAll(params: PostQueryParams): Promise<{
        data: ({
            author: {
                email: string;
                id: string;
                slug: string | null;
                name: string | null;
                avatar: string | null;
            };
            categories: {
                id: string;
                slug: string;
                name: string;
            }[];
            tags: {
                id: string;
                slug: string;
                name: string;
            }[];
        } & {
            status: import(".prisma/client").$Enums.PostStatus;
            deletedAt: Date | null;
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            title: string;
            coverImage: string | null;
            readingTime: number | null;
            authorId: string;
            publishedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get post by slug
     */
    getBySlug(slug: string): Promise<{
        author: {
            email: string;
            id: string;
            slug: string | null;
            name: string | null;
            bio: string | null;
            avatar: string | null;
            socialLinks: import("@prisma/client/runtime/library").JsonValue;
        };
        categories: {
            id: string;
            slug: string;
            name: string;
        }[];
        tags: {
            id: string;
            slug: string;
            name: string;
        }[];
        products: {
            id: string;
            slug: string;
            name: string;
        }[];
    } & {
        status: import(".prisma/client").$Enums.PostStatus;
        deletedAt: Date | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        excerpt: string | null;
        title: string;
        coverImage: string | null;
        readingTime: number | null;
        authorId: string;
        publishedAt: Date | null;
    }>;
    /**
     * Get post by ID (for admin)
     */
    getById(id: string): Promise<{
        author: {
            email: string;
            id: string;
            slug: string | null;
            name: string | null;
            avatar: string | null;
        };
        categories: {
            id: string;
            slug: string;
            name: string;
        }[];
        tags: {
            id: string;
            slug: string;
            name: string;
        }[];
        products: {
            id: string;
            slug: string;
            name: string;
        }[];
    } & {
        status: import(".prisma/client").$Enums.PostStatus;
        deletedAt: Date | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        excerpt: string | null;
        title: string;
        coverImage: string | null;
        readingTime: number | null;
        authorId: string;
        publishedAt: Date | null;
    }>;
    /**
     * Create post
     */
    create(data: CreatePostData, authorId: string): Promise<{
        author: {
            email: string;
            id: string;
            slug: string | null;
            name: string | null;
            avatar: string | null;
        };
        categories: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            description: string | null;
        }[];
        tags: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            description: string | null;
        }[];
        products: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            features: import("@prisma/client/runtime/library").JsonValue;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            videos: string[];
        }[];
    } & {
        status: import(".prisma/client").$Enums.PostStatus;
        deletedAt: Date | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        excerpt: string | null;
        title: string;
        coverImage: string | null;
        readingTime: number | null;
        authorId: string;
        publishedAt: Date | null;
    }>;
    /**
     * Update post
     */
    update(id: string, data: UpdatePostData, userId: string, userRole: string): Promise<{
        author: {
            email: string;
            id: string;
            slug: string | null;
            name: string | null;
            avatar: string | null;
        };
        categories: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            description: string | null;
        }[];
        tags: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            description: string | null;
        }[];
        products: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            features: import("@prisma/client/runtime/library").JsonValue;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            videos: string[];
        }[];
    } & {
        status: import(".prisma/client").$Enums.PostStatus;
        deletedAt: Date | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        excerpt: string | null;
        title: string;
        coverImage: string | null;
        readingTime: number | null;
        authorId: string;
        publishedAt: Date | null;
    }>;
    /**
     * Delete post (soft delete)
     */
    delete(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
}
export declare const postsService: PostsService;
export {};
//# sourceMappingURL=posts.service.d.ts.map