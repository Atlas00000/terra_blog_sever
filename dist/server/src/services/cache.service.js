"use strict";
/**
 * Redis Caching Service
 * Provides caching functionality for frequently accessed data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheKeys = exports.cacheService = void 0;
const redis_1 = require("../utils/redis");
const DEFAULT_TTL = 3600; // 1 hour in seconds
class CacheService {
    /**
     * Get cached value
     */
    async get(key) {
        try {
            const value = await redis_1.redisClient.get(key);
            if (value) {
                return JSON.parse(value);
            }
            return null;
        }
        catch (error) {
            // If Redis fails, return null (graceful degradation)
            if (process.env.NODE_ENV === 'development') {
                console.error('Cache get error:', error);
            }
            return null;
        }
    }
    /**
     * Set cached value
     */
    async set(key, value, ttl = DEFAULT_TTL) {
        try {
            await redis_1.redisClient.setEx(key, ttl, JSON.stringify(value));
        }
        catch (error) {
            // If Redis fails, continue without caching (graceful degradation)
            if (process.env.NODE_ENV === 'development') {
                console.error('Cache set error:', error);
            }
        }
    }
    /**
     * Delete cached value
     */
    async delete(key) {
        try {
            await redis_1.redisClient.del(key);
        }
        catch (error) {
            // If Redis fails, continue (graceful degradation)
            if (process.env.NODE_ENV === 'development') {
                console.error('Cache delete error:', error);
            }
        }
    }
    /**
     * Delete multiple cached values by pattern
     */
    async deletePattern(pattern) {
        try {
            const keys = await redis_1.redisClient.keys(pattern);
            if (keys.length > 0) {
                await redis_1.redisClient.del(keys);
            }
        }
        catch (error) {
            // If Redis fails, continue (graceful degradation)
            if (process.env.NODE_ENV === 'development') {
                console.error('Cache delete pattern error:', error);
            }
        }
    }
    /**
     * Invalidate cache for a specific resource
     */
    async invalidateResource(resource, id) {
        if (id) {
            await this.delete(`${resource}:${id}`);
        }
        // Also invalidate list caches
        await this.deletePattern(`${resource}:list:*`);
        await this.deletePattern(`${resource}:*:list`);
    }
    /**
     * Generate cache key for a resource
     */
    generateKey(resource, identifier, ...params) {
        const parts = [resource, identifier, ...params].filter(Boolean);
        return parts.join(':');
    }
    /**
     * Check if cache is available
     */
    async isAvailable() {
        try {
            await redis_1.redisClient.ping();
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.cacheService = new CacheService();
// Cache key generators
exports.cacheKeys = {
    post: (id) => `post:${id}`,
    postList: (page, limit, filters) => `post:list:${page}:${limit}${filters ? `:${filters}` : ''}`,
    category: (id) => `category:${id}`,
    categorySlug: (slug) => `category:slug:${slug}`,
    categoryList: (page, limit) => `category:list:${page}:${limit}`,
    tag: (id) => `tag:${id}`,
    tagSlug: (slug) => `tag:slug:${slug}`,
    tagList: (page, limit) => `tag:list:${page}:${limit}`,
    product: (id) => `product:${id}`,
    productSlug: (slug) => `product:slug:${slug}`,
    productList: (page, limit) => `product:list:${page}:${limit}`,
    user: (id) => `user:${id}`,
    userList: (page, limit) => `user:list:${page}:${limit}`,
};
//# sourceMappingURL=cache.service.js.map