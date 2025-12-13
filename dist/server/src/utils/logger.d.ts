import winston from 'winston';
import { Request } from 'express';
export declare const logger: winston.Logger;
/**
 * Log request with request ID
 */
export declare const logRequest: (req: Request, message: string, level?: "info" | "warn" | "error") => void;
/**
 * Log error with request context
 */
export declare const logError: (req: Request, error: Error, message?: string) => void;
//# sourceMappingURL=logger.d.ts.map