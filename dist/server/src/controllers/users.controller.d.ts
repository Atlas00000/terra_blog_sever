import { Request, Response, NextFunction } from 'express';
export declare class UsersController {
    /**
     * GET /api/v1/users
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/users/:id
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/users/slug/:slug
     */
    getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/users
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/users/:id
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/users/:id
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const usersController: UsersController;
//# sourceMappingURL=users.controller.d.ts.map