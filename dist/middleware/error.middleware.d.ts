import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    code: string;
    message: string;
    statusCode: number;
    details?: any | undefined;
    constructor(code: string, message: string, statusCode: number, details?: any | undefined);
}
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=error.middleware.d.ts.map