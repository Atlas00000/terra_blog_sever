import { Request, Response, NextFunction } from 'express';
export declare class CommentsController {
    /**
     * GET /api/v1/comments
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/comments/:id
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/comments
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/comments/:id
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/comments/:id
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/comments/:id/moderate (admin/editor only)
     */
    moderate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const commentsController: CommentsController;
//# sourceMappingURL=comments.controller.d.ts.map