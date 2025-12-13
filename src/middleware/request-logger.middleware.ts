/**
 * Request Logger Middleware
 * Logs all incoming requests with request ID
 */

import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Skip logging for health checks in production
  if (process.env.NODE_ENV === 'production' && req.path.startsWith('/health')) {
    return next();
  }

  // Log request
  logRequest(req, `${req.method} ${req.path}`, 'info');

  // Log response when finished
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    logRequest(req, `${req.method} ${req.path} ${res.statusCode} - ${duration}ms`, level);
  });

  next();
};

