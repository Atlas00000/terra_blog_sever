import { Request, Response, NextFunction } from 'express';
export declare class NewsletterController {
    /**
     * POST /api/v1/newsletter/subscribe
     */
    subscribe(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/newsletter/confirm
     */
    confirm(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/newsletter/unsubscribe
     */
    unsubscribe(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/newsletter/preferences
     */
    updatePreferences(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/newsletter (admin only)
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/newsletter/:email
     */
    getByEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const newsletterController: NewsletterController;
//# sourceMappingURL=newsletter.controller.d.ts.map