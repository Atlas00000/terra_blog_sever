/**
 * Request ID Middleware
 * Adds a unique request ID to each request for tracing and logging
 */
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            requestId?: string;
        }
    }
}
/**
 * Generate and attach a unique request ID to each request
 */
export declare const requestId: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=request-id.middleware.d.ts.map