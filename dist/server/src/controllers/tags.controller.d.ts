import { Request, Response, NextFunction } from 'express';
export declare class TagsController {
    /**
     * GET /api/v1/tags
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/tags/:slug
     */
    getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/tags/id/:id
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/tags
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/tags/:id
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/tags/:id
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const tagsController: TagsController;
//# sourceMappingURL=tags.controller.d.ts.map