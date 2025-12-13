import { Request, Response, NextFunction } from 'express';
/**
 * Authenticate user via JWT token
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Authorize user based on roles
 */
export declare const authorize: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map