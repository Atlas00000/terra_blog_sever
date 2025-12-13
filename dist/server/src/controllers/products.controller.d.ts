import { Request, Response, NextFunction } from 'express';
export declare class ProductsController {
    /**
     * GET /api/v1/products
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/products/:slug
     */
    getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/products/id/:id
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/products
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/products/:id
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/products/:id
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const productsController: ProductsController;
//# sourceMappingURL=products.controller.d.ts.map