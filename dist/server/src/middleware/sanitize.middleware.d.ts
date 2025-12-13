/**
 * Input Sanitization Middleware
 * Prevents XSS attacks by sanitizing user input
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Sanitize request body, query, and params
 */
export declare const sanitize: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Sanitize only string fields (for rich text content that may contain HTML)
 * Use this for endpoints that need to preserve HTML formatting
 */
export declare const sanitizeStrings: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=sanitize.middleware.d.ts.map