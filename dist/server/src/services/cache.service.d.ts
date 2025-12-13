/**
 * Redis Caching Service
 * Provides caching functionality for frequently accessed data
 */
declare class CacheService {
    /**
     * Get cached value
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set cached value
     */
    set(key: string, value: any, ttl?: number): Promise<void>;
    /**
     * Delete cached value
     */
    delete(key: string): Promise<void>;
    /**
     * Delete multiple cached values by pattern
     */
    deletePattern(pattern: string): Promise<void>;
    /**
     * Invalidate cache for a specific resource
     */
    invalidateResource(resource: string, id?: string): Promise<void>;
    /**
     * Generate cache key for a resource
     */
    generateKey(resource: string, identifier: string, ...params: string[]): string;
    /**
     * Check if cache is available
     */
    isAvailable(): Promise<boolean>;
}
export declare const cacheService: CacheService;
export declare const cacheKeys: {
    post: (id: string) => string;
    postList: (page: number, limit: number, filters?: string) => string;
    category: (id: string) => string;
    categorySlug: (slug: string) => string;
    categoryList: (page: number, limit: number) => string;
    tag: (id: string) => string;
    tagSlug: (slug: string) => string;
    tagList: (page: number, limit: number) => string;
    product: (id: string) => string;
    productSlug: (slug: string) => string;
    productList: (page: number, limit: number) => string;
    user: (id: string) => string;
    userList: (page: number, limit: number) => string;
};
export {};
//# sourceMappingURL=cache.service.d.ts.map