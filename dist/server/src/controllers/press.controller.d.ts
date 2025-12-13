import { Request, Response, NextFunction } from 'express';
export declare class PressController {
    /**
     * GET /api/v1/press
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/press/:slug
     */
    getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/press/id/:id
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/press
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/press/:id
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/press/:id
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const pressController: PressController;
//# sourceMappingURL=press.controller.d.ts.map