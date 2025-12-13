import { Request, Response, NextFunction } from 'express';
export declare class ContactController {
    /**
     * POST /api/v1/contact
     */
    submit(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/contact (admin only)
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/contact/:id (admin only)
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/contact/:id/status (admin only)
     */
    updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/contact/:id (admin only)
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const contactController: ContactController;
//# sourceMappingURL=contact.controller.d.ts.map