import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { authService } from '../services/auth.service';

/**
 * Authenticate user via JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('UNAUTHORIZED', 'No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = authService.verifyToken(token);

    // Attach user info to request
    (req as any).user = decoded;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          statusCode: error.statusCode,
          timestamp: new Date().toISOString(),
          path: req.path,
        },
      });
      return;
    }
    next(error);
  }
};

/**
 * Authorize user based on roles
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        throw new AppError('UNAUTHORIZED', 'Not authenticated', 401);
      }

      if (!allowedRoles.includes(user.role)) {
        throw new AppError(
          'FORBIDDEN',
          'Insufficient permissions',
          403
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: {
            code: error.code,
            message: error.message,
            statusCode: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.path,
          },
        });
        return;
      }
      next(error);
    }
  };
};

