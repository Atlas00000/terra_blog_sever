import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
type ValidationTarget = 'body' | 'query' | 'params';
export declare const validate: (schema: ZodSchema, target?: ValidationTarget) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validation.middleware.d.ts.map