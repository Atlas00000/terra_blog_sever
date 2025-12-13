/**
 * Cloudflare Images Service
 * Handles image optimization and transformations
 * Note: This is a placeholder for Cloudflare Images API integration
 * For now, we'll use URL parameters for basic transformations
 */
export interface ImageTransformOptions {
    width?: number;
    height?: number;
    format?: 'webp' | 'jpeg' | 'png' | 'gif';
    quality?: number;
    fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
    gravity?: 'auto' | 'side';
}
declare class CloudflareImagesService {
    private isConfigured;
    constructor();
    /**
     * Check if Images API is configured
     */
    isImagesConfigured(): boolean;
    /**
     * Generate optimized image URL
     * For R2 public URLs, we can use Cloudflare's automatic image optimization
     * by accessing through Cloudflare's CDN with transformation parameters
     */
    getOptimizedUrl(originalUrl: string, options?: ImageTransformOptions): string;
    /**
     * Generate thumbnail URL
     */
    getThumbnailUrl(originalUrl: string, size?: number): string;
    /**
     * Generate responsive image URLs
     */
    getResponsiveUrls(originalUrl: string): {
        thumbnail: string;
        small: string;
        medium: string;
        large: string;
        original: string;
    };
}
export declare const cloudflareImagesService: CloudflareImagesService;
export {};
//# sourceMappingURL=cloudflare-images.service.d.ts.map