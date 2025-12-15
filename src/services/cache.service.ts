/**
 * Redis Caching Service
 * Provides caching functionality for frequently accessed data
 */

import { redisClient } from '../utils/redis';

const DEFAULT_TTL = 3600; // 1 hour in seconds

class CacheService {
  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
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
  async set(key: string, value: any, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      // If Redis fails, continue without caching (graceful degradation)
      if (process.env.NODE_ENV === 'development') {
        console.error('Cache set error:', error);
      }
    }
  }

  /**
   * Delete cached value
   */
  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      // If Redis fails, continue (graceful degradation)
      if (process.env.NODE_ENV === 'development') {
        console.error('Cache delete error:', error);
      }
    }
  }

  /**
   * Delete multiple cached values by pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      // If Redis fails, continue (graceful degradation)
      if (process.env.NODE_ENV === 'development') {
        console.error('Cache delete pattern error:', error);
      }
    }
  }

  /**
   * Invalidate cache for a specific resource
   */
  async invalidateResource(resource: string, id?: string): Promise<void> {
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
  generateKey(resource: string, identifier: string, ...params: string[]): string {
    const parts = [resource, identifier, ...params].filter(Boolean);
    return parts.join(':');
  }

  /**
   * Check if cache is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await redisClient.ping();
      return true;
    } catch {
      return false;
    }
  }
}

export const cacheService = new CacheService();

// Cache key generators
export const cacheKeys = {
  post: (id: string) => `post:${id}`,
  postList: (page: number, limit: number, filters?: string) =>
    `post:list:${page}:${limit}${filters ? `:${filters}` : ''}`,
  category: (id: string) => `category:${id}`,
  categorySlug: (slug: string) => `category:slug:${slug}`,
  categoryList: (page: number, limit: number) => `category:list:${page}:${limit}`,
  tag: (id: string) => `tag:${id}`,
  tagSlug: (slug: string) => `tag:slug:${slug}`,
  tagList: (page: number, limit: number) => `tag:list:${page}:${limit}`,
  commentList: (slug: string, page: number, limit: number) =>
    `comment:list:${slug}:${page}:${limit}`,
  product: (id: string) => `product:${id}`,
  productSlug: (slug: string) => `product:slug:${slug}`,
  productList: (page: number, limit: number) => `product:list:${page}:${limit}`,
  user: (id: string) => `user:${id}`,
  userList: (page: number, limit: number) => `user:list:${page}:${limit}`,
};

