import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    /**
     * POST /api/v1/auth/register
     */
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/auth/login
     */
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/auth/me
     */
    getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map