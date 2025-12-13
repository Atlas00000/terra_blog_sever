import { Request, Response, NextFunction } from 'express';
export declare class MediaController {
    /**
     * GET /api/v1/media
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/media/:id
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/media/upload
     */
    upload(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/media/upload-multiple
     */
    uploadMultiple(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/media/:id
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const mediaController: MediaController;
//# sourceMappingURL=media.controller.d.ts.map