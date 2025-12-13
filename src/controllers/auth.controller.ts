import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json({
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
            statusCode: 401,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      const user = await authService.getUserById(userId);
      res.json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

