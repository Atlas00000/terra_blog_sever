"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaController = exports.MediaController = void 0;
const media_service_1 = require("../services/media.service");
const cloudflare_r2_service_1 = require("../services/cloudflare-r2.service");
const file_validation_1 = require("../utils/file-validation");
const error_middleware_1 = require("../middleware/error.middleware");
class MediaController {
    /**
     * GET /api/v1/media
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                search: req.query.search,
                mimeType: req.query.mimeType,
                uploadedById: req.query.uploadedById,
            };
            const result = await media_service_1.mediaService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/media/:id
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const media = await media_service_1.mediaService.getById(id);
            res.json({ data: media });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/media/upload
     */
    async upload(req, res, next) {
        try {
            if (!req.file) {
                throw new error_middleware_1.AppError('VALIDATION_ERROR', 'No file provided', 400);
            }
            // Check if R2 is configured
            if (!cloudflare_r2_service_1.cloudflareR2Service.isConfigured()) {
                throw new error_middleware_1.AppError('R2_NOT_CONFIGURED', 'File upload is not configured', 503);
            }
            // Validate file (default to image validation)
            const validation = (0, file_validation_1.validateImage)(req.file);
            if (!validation.valid) {
                throw new error_middleware_1.AppError('VALIDATION_ERROR', validation.error || 'Invalid file', 400);
            }
            // Upload to R2
            const originalUrl = await cloudflare_r2_service_1.cloudflareR2Service.uploadFile(req.file);
            // Create media record
            const userId = req.user?.userId;
            const media = await media_service_1.mediaService.create({
                originalUrl,
                fileName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                uploadedById: userId,
            });
            res.status(201).json({
                data: media,
                message: 'File uploaded successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/media/upload-multiple
     */
    async uploadMultiple(req, res, next) {
        try {
            if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
                throw new error_middleware_1.AppError('VALIDATION_ERROR', 'No files provided', 400);
            }
            // Check if R2 is configured
            if (!cloudflare_r2_service_1.cloudflareR2Service.isConfigured()) {
                throw new error_middleware_1.AppError('R2_NOT_CONFIGURED', 'File upload is not configured', 503);
            }
            // Handle different multer file types
            let files = [];
            if (Array.isArray(req.files)) {
                files = req.files;
            }
            else if (req.files && typeof req.files === 'object') {
                // Handle fieldname-based file object
                const fileObject = req.files;
                files = Object.values(fileObject).flat();
            }
            if (files.length === 0) {
                throw new error_middleware_1.AppError('VALIDATION_ERROR', 'No files provided', 400);
            }
            const userId = req.user?.userId;
            const uploads = [];
            const failed = [];
            // Process each file
            for (const file of files) {
                try {
                    // Validate file
                    const validation = (0, file_validation_1.validateImage)(file);
                    if (!validation.valid) {
                        failed.push({
                            fileName: file.originalname,
                            error: validation.error,
                        });
                        continue;
                    }
                    // Upload to R2
                    const originalUrl = await cloudflare_r2_service_1.cloudflareR2Service.uploadFile(file);
                    // Create media record
                    const media = await media_service_1.mediaService.create({
                        originalUrl,
                        fileName: file.originalname,
                        fileSize: file.size,
                        mimeType: file.mimetype,
                        uploadedById: userId,
                    });
                    uploads.push(media);
                }
                catch (error) {
                    failed.push({
                        fileName: file.originalname,
                        error: error.message,
                    });
                }
            }
            res.status(201).json({
                data: {
                    uploads,
                    failed,
                    total: files.length,
                    successful: uploads.length,
                    failedCount: failed.length,
                },
                message: `Uploaded ${uploads.length} of ${files.length} file(s)`,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/media/:id
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            if (!userId) {
                throw new error_middleware_1.AppError('UNAUTHORIZED', 'Not authenticated', 401);
            }
            await media_service_1.mediaService.delete(id, userId, userRole);
            res.json({ message: 'Media deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MediaController = MediaController;
exports.mediaController = new MediaController();
//# sourceMappingURL=media.controller.js.map