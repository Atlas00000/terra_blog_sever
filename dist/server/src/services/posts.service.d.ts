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
    getAll(params: PostQueryParams): Promise<any>;
    /**
     * Get post by slug
     */
    getBySlug(slug: string): Promise<any>;
    /**
     * Get post by ID (for admin)
     */
    getById(id: string): Promise<{
        author: {
            name: string | null;
            email: string;
            id: string;
            slug: string | null;
            avatar: string | null;
        };
        categories: {
            name: string;
            id: string;
            slug: string;
        }[];
        tags: {
            name: string;
            id: string;
            slug: string;
        }[];
        products: {
            name: string;
            id: string;
            slug: string;
        }[];
    } & {
        status: import(".prisma/client").$Enums.PostStatus;
        content: string;
        excerpt: string | null;
        deletedAt: Date | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
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
            name: string | null;
            email: string;
            id: string;
            slug: string | null;
            avatar: string | null;
        };
        categories: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            description: string | null;
        }[];
        tags: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            description: string | null;
        }[];
        products: {
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
    } & {
        status: import(".prisma/client").$Enums.PostStatus;
        content: string;
        excerpt: string | null;
        deletedAt: Date | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
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
            name: string | null;
            email: string;
            id: string;
            slug: string | null;
            avatar: string | null;
        };
        categories: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            description: string | null;
        }[];
        tags: {
            name: string;
            id: string;
            slug: string;
            createdAt: Date;
            description: string | null;
        }[];
        products: {
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
    } & {
        status: import(".prisma/client").$Enums.PostStatus;
        content: string;
        excerpt: string | null;
        deletedAt: Date | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
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