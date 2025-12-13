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
declare class CategoriesService {
    /**
     * Get all categories with filters
     */
    getAll(params: CategoryQueryParams): Promise<any>;
    /**
     * Get category by slug
     */
    getBySlug(slug: string): Promise<any>;
    /**
     * Get category by ID
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
     * Create category
     */
    create(data: CreateCategoryData): Promise<{
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
     * Update category
     */
    update(id: string, data: UpdateCategoryData): Promise<{
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
     * Delete category
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
export declare const categoriesService: CategoriesService;
export {};
//# sourceMappingURL=categories.service.d.ts.map