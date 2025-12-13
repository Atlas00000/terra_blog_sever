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
declare class TagsService {
    /**
     * Get all tags with filters
     */
    getAll(params: TagQueryParams): Promise<any>;
    /**
     * Get tag by slug
     */
    getBySlug(slug: string): Promise<any>;
    /**
     * Get tag by ID
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
        description: string | null;
    }>;
    /**
     * Create tag
     */
    create(data: CreateTagData): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        description: string | null;
    }>;
    /**
     * Update tag
     */
    update(id: string, data: UpdateTagData): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        id: string;
        slug: string;
        createdAt: Date;
        description: string | null;
    }>;
    /**
     * Delete tag
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
export declare const tagsService: TagsService;
export {};
//# sourceMappingURL=tags.service.d.ts.map