/**
 * Press Releases Service
 * Handles press release CRUD operations
 */
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
declare class PressReleasesService {
    /**
     * Get all press releases with filters
     */
    getAll(params: PressReleaseQueryParams): Promise<{
        data: {
            content: string;
            excerpt: string | null;
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            publishedAt: Date;
            featured: boolean;
            mediaKitUrl: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get press release by slug
     */
    getBySlug(slug: string): Promise<{
        content: string;
        excerpt: string | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        publishedAt: Date;
        featured: boolean;
        mediaKitUrl: string | null;
    }>;
    /**
     * Get press release by ID
     */
    getById(id: string): Promise<{
        content: string;
        excerpt: string | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        publishedAt: Date;
        featured: boolean;
        mediaKitUrl: string | null;
    }>;
    /**
     * Create press release
     */
    create(data: CreatePressReleaseData): Promise<{
        content: string;
        excerpt: string | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        publishedAt: Date;
        featured: boolean;
        mediaKitUrl: string | null;
    }>;
    /**
     * Update press release
     */
    update(id: string, data: UpdatePressReleaseData): Promise<{
        content: string;
        excerpt: string | null;
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        publishedAt: Date;
        featured: boolean;
        mediaKitUrl: string | null;
    }>;
    /**
     * Delete press release
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
export declare const pressReleasesService: PressReleasesService;
export {};
//# sourceMappingURL=press.service.d.ts.map