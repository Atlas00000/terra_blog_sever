import { Request, Response, NextFunction } from 'express';
export declare class CategoriesController {
    /**
     * GET /api/v1/categories
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/categories/:slug
     */
    getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/categories/id/:id
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/categories
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/categories/:id
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/categories/:id
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const categoriesController: CategoriesController;
//# sourceMappingURL=categories.controller.d.ts.map