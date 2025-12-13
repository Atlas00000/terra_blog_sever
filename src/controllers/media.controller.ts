import { Request, Response, NextFunction } from 'express';
import { mediaService } from '../services/media.service';
import { cloudflareR2Service } from '../services/cloudflare-r2.service';
import { validateImage, validateVideo } from '../utils/file-validation';
import { AppError } from '../middleware/error.middleware';

export class MediaController {
  /**
   * GET /api/v1/media
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
        mimeType: req.query.mimeType as string,
        uploadedById: req.query.uploadedById as string,
      };

      const result = await mediaService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/media/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const media = await mediaService.getById(id);
      res.json({ data: media });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/media/upload
   */
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('VALIDATION_ERROR', 'No file provided', 400);
      }

      // Check if R2 is configured
      if (!cloudflareR2Service.isConfigured()) {
        throw new AppError(
          'R2_NOT_CONFIGURED',
          'File upload is not configured',
          503
        );
      }

      // Validate file (default to image validation)
      const validation = validateImage(req.file);
      if (!validation.valid) {
        throw new AppError('VALIDATION_ERROR', validation.error || 'Invalid file', 400);
      }

      // Upload to R2
      const originalUrl = await cloudflareR2Service.uploadFile(req.file);

      // Create media record
      const userId = (req as any).user?.userId;
      const media = await mediaService.create({
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
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/media/upload-multiple
   */
  async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        throw new AppError('VALIDATION_ERROR', 'No files provided', 400);
      }

      // Check if R2 is configured
      if (!cloudflareR2Service.isConfigured()) {
        throw new AppError(
          'R2_NOT_CONFIGURED',
          'File upload is not configured',
          503
        );
      }

      // Handle different multer file types
      let files: Express.Multer.File[] = [];
      
      if (Array.isArray(req.files)) {
        files = req.files;
      } else if (req.files && typeof req.files === 'object') {
        // Handle fieldname-based file object
        const fileObject = req.files as { [fieldname: string]: Express.Multer.File[] };
        files = Object.values(fileObject).flat();
      }

      if (files.length === 0) {
        throw new AppError('VALIDATION_ERROR', 'No files provided', 400);
      }

      const userId = (req as any).user?.userId;
      const uploads: any[] = [];
      const failed: any[] = [];

      // Process each file
      for (const file of files) {
        try {
          // Validate file
          const validation = validateImage(file);
          if (!validation.valid) {
            failed.push({
              fileName: file.originalname,
              error: validation.error,
            });
            continue;
          }

          // Upload to R2
          const originalUrl = await cloudflareR2Service.uploadFile(file);

          // Create media record
          const media = await mediaService.create({
            originalUrl,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            uploadedById: userId,
          });

          uploads.push(media);
        } catch (error: any) {
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
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/media/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      if (!userId) {
        throw new AppError('UNAUTHORIZED', 'Not authenticated', 401);
      }

      await mediaService.delete(id, userId, userRole);
      res.json({ message: 'Media deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();

