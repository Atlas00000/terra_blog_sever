"use strict";
/**
 * Upload middleware configuration
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Configure multer to use memory storage
const storage = multer_1.default.memoryStorage();
// File filter
const fileFilter = (req, file, cb) => {
    // Allow images and videos
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'video/mp4',
        'video/webm',
        'video/ogg',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};
// Single file upload
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max
    },
});
// Multiple files upload
exports.uploadMultiple = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max per file
        files: 10, // Max 10 files at once
    },
});
//# sourceMappingURL=upload.middleware.js.map