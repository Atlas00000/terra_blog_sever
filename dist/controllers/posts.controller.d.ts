import { Request, Response, NextFunction } from 'express';
export declare class PostsController {
    /**
     * GET /api/v1/posts
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/posts/:slug
     */
    getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/posts/id/:id (admin)
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/posts
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/posts/:id
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/posts/:id
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const postsController: PostsController;
//# sourceMappingURL=posts.controller.d.ts.map