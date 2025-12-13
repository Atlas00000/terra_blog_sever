/**
 * File validation utilities
 */
export interface FileValidationOptions {
    maxSize?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
}
export interface ValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Validate file based on options
 */
export declare function validateFile(file: Express.Multer.File, options?: FileValidationOptions): ValidationResult;
/**
 * Validate image file
 */
export declare function validateImage(file: Express.Multer.File): ValidationResult;
/**
 * Validate video file
 */
export declare function validateVideo(file: Express.Multer.File): ValidationResult;
/**
 * Validate document file
 */
export declare function validateDocument(file: Express.Multer.File): ValidationResult;
/**
 * Get file extension from filename
 */
export declare function getFileExtension(filename: string): string;
/**
 * Generate unique filename
 */
export declare function generateUniqueFilename(originalName: string, prefix?: string): string;
/**
 * Check if file is an image
 */
export declare function isImage(mimeType: string): boolean;
/**
 * Check if file is a video
 */
export declare function isVideo(mimeType: string): boolean;
//# sourceMappingURL=file-validation.d.ts.map