/**
 * Request ID Middleware
 * Adds a unique request ID to each request for tracing and logging
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Extend Express Request type to include requestId
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
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = uuidv4();
  req.requestId = id;
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', id);
  
  next();
};

