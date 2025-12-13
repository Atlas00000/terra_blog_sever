"use strict";
/**
 * Cloudflare Images Service
 * Handles image optimization and transformations
 * Note: This is a placeholder for Cloudflare Images API integration
 * For now, we'll use URL parameters for basic transformations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudflareImagesService = void 0;
const env_1 = require("../config/env");
class CloudflareImagesService {
    isConfigured;
    constructor() {
        // Cloudflare Images requires API token
        this.isConfigured = !!(env_1.env.CLOUDFLARE_IMAGES_API_TOKEN && env_1.env.CLOUDFLARE_ACCOUNT_ID);
    }
    /**
     * Check if Images API is configured
     */
    isImagesConfigured() {
        return this.isConfigured;
    }
    /**
     * Generate optimized image URL
     * For R2 public URLs, we can use Cloudflare's automatic image optimization
     * by accessing through Cloudflare's CDN with transformation parameters
     */
    getOptimizedUrl(originalUrl, options = {}) {
        // If using Cloudflare R2 public URL, we can use Cloudflare's image optimization
        // by adding transformation parameters
        if (originalUrl.includes('r2.dev') || originalUrl.includes('cloudflare')) {
            const params = new URLSearchParams();
            if (options.width) {
                params.append('width', options.width.toString());
            }
            if (options.height) {
                params.append('height', options.height.toString());
            }
            if (options.format) {
                params.append('format', options.format);
            }
            if (options.quality) {
                params.append('quality', options.quality.toString());
            }
            if (options.fit) {
                params.append('fit', options.fit);
            }
            if (options.gravity) {
                params.append('gravity', options.gravity);
            }
            // If no params, return original URL
            if (params.toString()) {
                return `${originalUrl}?${params.toString()}`;
            }
        }
        return originalUrl;
    }
    /**
     * Generate thumbnail URL
     */
    getThumbnailUrl(originalUrl, size = 400) {
        return this.getOptimizedUrl(originalUrl, {
            width: size,
            height: size,
            format: 'webp',
            quality: 80,
            fit: 'cover',
        });
    }
    /**
     * Generate responsive image URLs
     */
    getResponsiveUrls(originalUrl) {
        return {
            thumbnail: this.getOptimizedUrl(originalUrl, {
                width: 400,
                format: 'webp',
                quality: 80,
                fit: 'cover',
            }),
            small: this.getOptimizedUrl(originalUrl, {
                width: 640,
                format: 'webp',
                quality: 85,
                fit: 'scale-down',
            }),
            medium: this.getOptimizedUrl(originalUrl, {
                width: 1024,
                format: 'webp',
                quality: 85,
                fit: 'scale-down',
            }),
            large: this.getOptimizedUrl(originalUrl, {
                width: 1920,
                format: 'webp',
                quality: 90,
                fit: 'scale-down',
            }),
            original: originalUrl,
        };
    }
}
exports.cloudflareImagesService = new CloudflareImagesService();
//# sourceMappingURL=cloudflare-images.service.js.map