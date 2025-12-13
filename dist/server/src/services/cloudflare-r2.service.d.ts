/**
 * Cloudflare R2 Service
 * Handles file uploads, deletions, and URL generation for R2 storage
 */
declare class CloudflareR2Service {
    private s3Client;
    private bucketName;
    private publicUrl;
    constructor();
    /**
     * Check if R2 is configured
     */
    isConfigured(): boolean;
    /**
     * Upload file to R2
     */
    uploadFile(file: Express.Multer.File, key?: string): Promise<string>;
    /**
     * Delete file from R2
     */
    deleteFile(key: string): Promise<void>;
    /**
     * Extract key from R2 URL
     */
    extractKeyFromUrl(url: string): string;
    /**
     * Generate unique file key
     */
    private generateFileKey;
    /**
     * List files in R2 (optional, for admin panel)
     */
    listFiles(prefix?: string, maxKeys?: number): Promise<string[]>;
}
export declare const cloudflareR2Service: CloudflareR2Service;
export {};
//# sourceMappingURL=cloudflare-r2.service.d.ts.map