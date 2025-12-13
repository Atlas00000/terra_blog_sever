/**
 * Cloudflare R2 Service
 * Handles file uploads, deletions, and URL generation for R2 storage
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';

class CloudflareR2Service {
  private s3Client: S3Client | null = null;
  private bucketName: string = '';
  private publicUrl: string = '';

  constructor() {
    // Only initialize if credentials are provided
    if (
      env.CLOUDFLARE_ACCOUNT_ID &&
      env.CLOUDFLARE_ACCESS_KEY_ID &&
      env.CLOUDFLARE_SECRET_ACCESS_KEY &&
      env.CLOUDFLARE_R2_BUCKET_NAME &&
      env.CLOUDFLARE_R2_PUBLIC_URL
    ) {
      const endpoint = env.CLOUDFLARE_R2_ENDPOINT || 
        `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

      this.s3Client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
          secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
        },
      });

      this.bucketName = env.CLOUDFLARE_R2_BUCKET_NAME;
      this.publicUrl = env.CLOUDFLARE_R2_PUBLIC_URL;
    } else {
      console.warn('⚠️  Cloudflare R2 credentials not configured. Media uploads will be disabled.');
    }
  }

  /**
   * Check if R2 is configured
   */
  isConfigured(): boolean {
    return this.s3Client !== null;
  }

  /**
   * Upload file to R2
   */
  async uploadFile(
    file: Express.Multer.File,
    key?: string
  ): Promise<string> {
    if (!this.s3Client) {
      throw new AppError(
        'R2_NOT_CONFIGURED',
        'Cloudflare R2 is not configured',
        500
      );
    }

    const fileKey = key || this.generateFileKey(file.originalname);

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000', // 1 year cache
      });

      await this.s3Client.send(command);

      // Return public URL
      return `${this.publicUrl}/${fileKey}`;
    } catch (error: any) {
      throw new AppError(
        'R2_UPLOAD_FAILED',
        `Failed to upload file to R2: ${error.message}`,
        500
      );
    }
  }

  /**
   * Delete file from R2
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new AppError(
        'R2_NOT_CONFIGURED',
        'Cloudflare R2 is not configured',
        500
      );
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error: any) {
      throw new AppError(
        'R2_DELETE_FAILED',
        `Failed to delete file from R2: ${error.message}`,
        500
      );
    }
  }

  /**
   * Extract key from R2 URL
   */
  extractKeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // Remove leading slash
    } catch (error) {
      throw new AppError(
        'INVALID_URL',
        'Invalid R2 URL format',
        400
      );
    }
  }

  /**
   * Generate unique file key
   */
  private generateFileKey(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop()?.toLowerCase() || '';
    const baseName = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .substring(0, 50);

    // Organize by date: YYYY/MM/filename-timestamp-random.ext
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}/${month}/${baseName}-${timestamp}-${random}.${extension}`;
  }

  /**
   * List files in R2 (optional, for admin panel)
   */
  async listFiles(prefix?: string, maxKeys: number = 100): Promise<string[]> {
    if (!this.s3Client) {
      throw new AppError(
        'R2_NOT_CONFIGURED',
        'Cloudflare R2 is not configured',
        500
      );
    }

    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const response = await this.s3Client.send(command);
      return (response.Contents || []).map((obj) => obj.Key || '').filter(Boolean);
    } catch (error: any) {
      throw new AppError(
        'R2_LIST_FAILED',
        `Failed to list files from R2: ${error.message}`,
        500
      );
    }
  }
}

export const cloudflareR2Service = new CloudflareR2Service();

