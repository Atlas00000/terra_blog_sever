"use strict";
/**
 * File validation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFile = validateFile;
exports.validateImage = validateImage;
exports.validateVideo = validateVideo;
exports.validateDocument = validateDocument;
exports.getFileExtension = getFileExtension;
exports.generateUniqueFilename = generateUniqueFilename;
exports.isImage = isImage;
exports.isVideo = isVideo;
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];
const DEFAULT_ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/ogg',
];
const DEFAULT_ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
/**
 * Validate file based on options
 */
function validateFile(file, options = {}) {
    const { maxSize = DEFAULT_MAX_SIZE, allowedMimeTypes, allowedExtensions, } = options;
    // Check file size
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
        };
    }
    // Check MIME type
    if (allowedMimeTypes && allowedMimeTypes.length > 0) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return {
                valid: false,
                error: `File type not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
            };
        }
    }
    // Check file extension
    if (allowedExtensions && allowedExtensions.length > 0) {
        const extension = file.originalname.split('.').pop()?.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
            return {
                valid: false,
                error: `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
            };
        }
    }
    return { valid: true };
}
/**
 * Validate image file
 */
function validateImage(file) {
    return validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: DEFAULT_ALLOWED_IMAGE_TYPES,
    });
}
/**
 * Validate video file
 */
function validateVideo(file) {
    return validateFile(file, {
        maxSize: 100 * 1024 * 1024, // 100MB
        allowedMimeTypes: DEFAULT_ALLOWED_VIDEO_TYPES,
    });
}
/**
 * Validate document file
 */
function validateDocument(file) {
    return validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: DEFAULT_ALLOWED_DOCUMENT_TYPES,
    });
}
/**
 * Get file extension from filename
 */
function getFileExtension(filename) {
    return filename.split('.').pop()?.toLowerCase() || '';
}
/**
 * Generate unique filename
 */
function generateUniqueFilename(originalName, prefix) {
    const extension = getFileExtension(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const prefixPart = prefix ? `${prefix}-` : '';
    return `${prefixPart}${baseName}-${timestamp}-${random}.${extension}`;
}
/**
 * Check if file is an image
 */
function isImage(mimeType) {
    return mimeType.startsWith('image/');
}
/**
 * Check if file is a video
 */
function isVideo(mimeType) {
    return mimeType.startsWith('video/');
}
//# sourceMappingURL=file-validation.js.map