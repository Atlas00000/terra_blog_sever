import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (
  schema: ZodSchema,
  target: ValidationTarget = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate: any;

      switch (target) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
      }

      const validated = schema.parse(dataToValidate);

      // Replace the original data with validated data
      switch (target) {
        case 'body':
          req.body = validated;
          break;
        case 'query':
          req.query = validated as any;
          break;
        case 'params':
          req.params = validated as any;
          break;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            statusCode: 400,
            timestamp: new Date().toISOString(),
            path: req.path,
            details: error.errors,
          },
        });
        return;
      }
      next(error);
    }
  };
};

