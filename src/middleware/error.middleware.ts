import { Request, Response, NextFunction } from 'express';
import { logError } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    // Log client errors at warn level, server errors at error level
    if (err.statusCode >= 500) {
      logError(req, err, `Server error: ${err.message}`);
    } else if (err.statusCode >= 400) {
      // Log client errors at info level (less verbose)
      const { logRequest } = require('../utils/logger');
      logRequest(req, `Client error: ${err.message}`, 'warn');
    }

    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        timestamp: new Date().toISOString(),
        path: req.path,
        requestId: req.requestId,
        ...(process.env.NODE_ENV === 'development' && { details: err.details }),
      },
    });
  }

  // Log unexpected errors
  logError(req, err, 'Unexpected error occurred');

  // Generic error response
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.path,
      requestId: req.requestId,
    },
  });
};

